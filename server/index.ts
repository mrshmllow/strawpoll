import 'dotenv/config'
import { options } from 'preact';
import { Server } from "socket.io";
import { adminSupabase } from "../lib/adminSupabaseClient";
import { IOption, IVote } from "../types/tables";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

io.on("connection", (socket) => {
  const address = socket.handshake.address

  socket.on("vote", async (option: string) => {
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

    io.emit("receive vote", option)
    socket.emit("return")
  })
});

io.listen(4000);
