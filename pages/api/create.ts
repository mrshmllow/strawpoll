import { NextApiRequest, NextApiResponse } from 'next'
import shortUUID from 'short-uuid'
import { adminSupabase } from '../../lib/adminSupabaseClient'
import { IOption, IPoll } from '../../types/tables'
import * as colours from '../../lib/colours/colours'

const short = shortUUID()

export interface CreateReturn {
  error: true | null | string
  url: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateReturn>
) {
  let { question, options } = req.body as {
    question?: string
    options?: string[]
  }

  options =
    options &&
    options.filter(option => option.length > 0 && option.length <= 70)

  if (
    options === undefined ||
    !Array.isArray(options) ||
    options.length < 2 ||
    typeof question !== 'string' ||
    question.length > 70
  ) {
    return res.status(400).json({
      error: 'Invalid data',
      url: null,
    })
  }

  const { data: poll } = await adminSupabase
    .from<IPoll>('polls')
    .insert([
      {
        id: short.new(),
        question: question,
        single: true,
        colour: colours.colours[(Math.random() * colours.colours.length) | 0],
      },
    ])
    .limit(1)
    .select('id')
    .single()

  await adminSupabase
    .from<IOption>('options')
    .insert(
      options.map(option => ({
        id: short.new(),
        option,
        owner: poll!.id,
        votes: 0,
      }))
    )
    .select('id')

  return res.status(200).json({
    error: null,
    url: `/${poll!.id}`,
  })
}
