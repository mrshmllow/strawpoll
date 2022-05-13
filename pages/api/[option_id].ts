import type { NextApiRequest, NextApiResponse } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { IOption, IVote } from '../../types/tables'
import { getClientIp } from 'request-ip'
import { adminSupabase } from '../../lib/adminSupabaseClient'

type route = ParsedUrlQuery & {
  option_id: string
}

const supabase = adminSupabase

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    error: true | null
  }>
) {
  const { option_id } = req.query as route
  const ip = getClientIp(req)

  if (ip === null)
    return res.status(500).send({
      error: true,
    })

  const { data, error } = await supabase
    .from<IOption>('options')
    .select('id,votes,owner')
    .limit(1)
    .filter('id', 'eq', option_id)
    .single()

  if (error || data === null) return res.status(404).json({ error: true })

  const { data: check } = await supabase
    .from<IVote>('votes')
    .select('ip,poll_id')
    .limit(1)
    .filter('poll_id', 'eq', data.owner)
    .filter('ip', 'eq', ip)
    .single()

  if (check !== null) return res.status(200).json({ error: true })

  await Promise.all([
    supabase
      .from<IOption>('options')
      .update({
        votes: data.votes + 1,
      })
      .filter('id', 'eq', option_id),
    supabase.from<IVote>('votes').insert({
      ip: ip,
      choice: option_id,
      poll_id: data.owner,
    }),
  ])

  return res.status(200).json({ error: null })
}
