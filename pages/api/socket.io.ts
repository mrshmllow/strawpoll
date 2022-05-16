import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { Server as NetServer } from 'http'
import { IOption, IVote } from '../../types/tables'
import { adminSupabase } from '../../lib/adminSupabaseClient'
import { Socket as NetSocket } from 'net'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'

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
      path: '/api/socket.io/',
    })
    
    // Connect to redis for subpub
    const pubClient = createClient({
      url: process.env.REDIS_URL
    })
    const subClient = pubClient.duplicate()

    io.adapter(createAdapter(pubClient, subClient))

    io.on('connection', socket => {
      const address = socket.handshake.address

      socket.on('join', (poll: string) => socket.join(`poll:${poll}`))

      socket.on('vote', async (option: string) => {
        const { data, error } = await adminSupabase
          .from<IOption>('options')
          .select('id,votes,owner')
          .limit(1)
          .filter('id', 'eq', option)
          .single()

        if (error || data === null) return

        const { data: check } = await adminSupabase
          .from<IVote>('votes')
          .select('ip,poll_id')
          .limit(1)
          .filter('poll_id', 'eq', data.owner)
          .filter('ip', 'eq', address)
          .single()

        if (check !== null) return

        await Promise.all([
          adminSupabase
            .from<IOption>('options')
            .update({
              votes: data.votes + 1,
            })
            .filter('id', 'eq', option),
          adminSupabase.from<IVote>('votes').insert({
            ip: address,
            choice: option,
            poll_id: data.owner,
          }),
        ])

        io.to(`poll:${data.owner}`).emit('receive vote', option)
        socket.emit('return')
      })
    })

    res.socket.server.io = io
  }
  res.end()
}
