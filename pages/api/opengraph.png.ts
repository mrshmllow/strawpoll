import { createCanvas, registerFont } from "canvas"
import { NextApiRequest, NextApiResponse } from "next"
import pluralize from "pluralize"
import { colours, hexes } from "../../lib/colours/colours"

registerFont("./fonts/Nunito-Variable.ttf", {
  family: "Nunito",
})

registerFont("./fonts/Nunito-ExtraBold.ttf", {
  family: "Nunito Extrabold",
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    question,
    "options[]": options,
    max,
  } = req.query as {
    question?: string
    "options[]"?: string[]
    max?: string
  }

  if (
    question === undefined ||
    options === undefined ||
    max === undefined ||
    isNaN(Number(max))
  ) {
    return res.status(400).send("")
  }

  const trimmed_question =
    question.length > 25 ? question.substring(0, 25 - 3) + "..." : question

  const WIDTH = 1200 as const
  const HEIGHT = 630 as const
  const DX = 0 as const
  const DY = 0 as const

  const BG_COLOUR = "#0f172a" as const
  const TEXT_COLOUR = "#e2e8f0" as const
  const ALT_TEXT_COLOUR = "#94a3b8" as const

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext("2d")

  // BG
  ctx.fillStyle = BG_COLOUR
  ctx.fillRect(DX, DY, WIDTH, HEIGHT)

  ctx.fillStyle = TEXT_COLOUR
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"

  ctx.font = '60px "Nunito Extrabold"'
  ctx.fillText(trimmed_question, 15, 40)

  ctx.fillText(
    options.length > 4 ? "+ more at Strawpoll.ink" : "At Strawpoll.ink",
    15,
    HEIGHT - 40
  )

  ctx.fillStyle = ALT_TEXT_COLOUR
  const total_votes_string = `${max} ${pluralize("votes", Number(max))}`
  ctx.fillText(
    total_votes_string,
    WIDTH - ctx.measureText(total_votes_string).width - 20,
    40
  )

  ctx.strokeStyle = ALT_TEXT_COLOUR
  ctx.beginPath()
  ctx.lineTo(0, 80)
  ctx.lineTo(WIDTH, 80)
  ctx.stroke()

  options.slice(-4).forEach((optionString, index) => {
    const split = optionString.split(";")
    const vote = Number(split.pop())

    if (isNaN(vote)) return res.status(400).send("")
    const text = split.join(";")
    const text_height = ctx.measureText(text).actualBoundingBoxDescent

    const height = 47
    const padding = 20
    // I have no idea how i did any of this math
    const Y = 55 * 2 + 45 / 2 + (height * 2 + padding) * index
    const line_x = height / 2 + 5

    ctx.fillStyle = TEXT_COLOUR
    ctx.font = '60px "Nunito Extrabold"'
    ctx.fillText(text, padding, Y)

    ctx.strokeStyle = "#374151"
    ctx.lineCap = "round"
    ctx.lineWidth = 20

    // Same here
    const length = WIDTH - padding * 2
    ctx.beginPath()
    ctx.lineTo(padding + 5, Y + text_height + line_x)
    ctx.lineTo(padding - 5 + length, Y + text_height + line_x)
    ctx.stroke()

    ctx.strokeStyle = hexes[colours[index]]
    ctx.beginPath()
    ctx.lineTo(padding + 5, Y + text_height + line_x)
    ctx.lineTo(
      padding - 5 + (length * vote) / Number(max),
      Y + text_height + line_x
    )
    ctx.stroke()

    const number = `${
      vote === 0 ? vote : ((100 * vote) / Number(max)).toFixed(0)
    }%`
    const voteString = `(${vote})`

    ctx.fillText(
      number,
      WIDTH -
        ctx.measureText(number).width -
        ctx.measureText(voteString).width -
        padding * 2,
      Y
    )
    ctx.fillStyle = ALT_TEXT_COLOUR
    ctx.fillText(
      voteString,
      WIDTH - ctx.measureText(voteString).width - padding,
      Y
    )
  })

  const buffer = canvas.toBuffer()

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": buffer.length,
  })
  res.end(buffer, "binary")
}
