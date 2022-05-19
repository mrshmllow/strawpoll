import { NextApiRequest, NextApiResponse } from "next"
import { Server } from "socket.io"
import { Server as NetServer } from "http"
import { IOption, IVote } from "../../types/tables"
import { adminSupabase } from "../../lib/adminSupabaseClient"
import { Socket as NetSocket } from "net"
import { createClient } from "redis"
import { createAdapter } from "@socket.io/redis-adapter"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: Server
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any
    const io = new Server(httpServer, {
      path: "/api/socket.io/",
    })

    // Connect to redis for subpub
    const pubClient = createClient({
      url: process.env.REDIS_URL,
    })
    const subClient = pubClient.duplicate()

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      io.adapter(createAdapter(pubClient, subClient))
    })

    io.on("connection", socket => {
      const address = socket.handshake.headers["x-forwarded-for"]
        ? (socket.handshake.headers["x-forwarded-for"] as string).split(",")[0]
        : socket.handshake.address

      socket.on("join", (poll: string) => socket.join(`poll:${poll}`))

      socket.on(
        "vote",
        async ({ token, selection }: { selection: string; token: string }) => {
          let url = new URL("https://hcaptcha.com/siteverify")
          url.searchParams.set("secret", process.env.HCAPTCHA_SECRET!)
          url.searchParams.set("response", token)
          url.searchParams.set("remoteip", address)

          const response = await fetch(url.toString(), {
            method: "POST",
          })

          if ((await response.json())["success"] === true) return

          const { data, error } = await adminSupabase
            .from<IOption>("options")
            .select("id,votes,owner")
            .limit(1)
            .filter("id", "eq", selection)
            .single()

          if (error || data === null) return

          const vote = await adminSupabase.from<IVote>("votes").insert({
            ip: address,
            choice: selection,
            poll_id: data.owner,
          })

          if (vote.error === null)
            io.to(`poll:${data.owner}`).emit("receive vote", selection)

          socket.emit("return")
        }
      )
    })

    res.socket.server.io = io
  }
  res.end()
}
