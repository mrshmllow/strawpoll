import { NextApiRequest, NextApiResponse } from "next"
import shortUUID from "short-uuid"
import { adminSupabase } from "../../lib/adminSupabaseClient"
import { IOption, IPoll } from "../../types/tables"
import * as colours from "../../lib/colours/colours"
import { decode } from "base64-arraybuffer"
import { Blob } from "node-fetch"

const short = shortUUID()

export interface CreateReturn {
  error: true | null | string
  url: string | null
}

export const config = {
  api: {
    bodyParser: {
      // 8mb limit per image, + 1 mb for data
      sizeLimit: `${8 * 10 + 1}mb`,
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateReturn>
) {
  let { question, options } = req.body as {
    question?: string
    options?: {
      option: string
      image?: string
      contentType?: string
      id: string
    }[]
  }

  options =
    options &&
    options.filter(
      option =>
        option.option.length > 0 &&
        option.option.length <= 70 &&
        new Blob([option.image!]).size <= 1000000 * 8
    )

  if (
    options === undefined ||
    !Array.isArray(options) ||
    options.length < 2 ||
    options.length > 10 ||
    typeof question !== "string" ||
    question.length > 70
  ) {
    return res.status(400).json({
      error: "Invalid data",
      url: null,
    })
  }

  const { data: poll } = await adminSupabase
    .from<IPoll>("polls")
    .insert([
      {
        id: short.new(),
        question: question,
        single: true,
        colour: colours.colours[(Math.random() * colours.colours.length) | 0],
      },
    ])
    .limit(1)
    .select("id")
    .single()

  options.forEach(option => {
    option.id = short.new()
  })

  await adminSupabase
    .from<IOption>("options")
    .insert(
      options.map(option => ({
        id: option.id,
        option: option.option,
        owner: poll!.id,
        votes: 0,
        image: option.image && `${poll!.id}/${option.id}`,
      }))
    )
    .select("id")

  Promise.all(
    options
      .filter(option => option.image)
      .map(option =>
        adminSupabase.storage
          .from("polls")
          .upload(`${poll!.id}/${option.id}`, decode(option.image!), {
            contentType: option.contentType,
          })
      )
  )

  return res.status(200).json({
    error: null,
    url: `/${poll!.id}`,
  })
}
