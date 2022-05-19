import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import pluralize from "pluralize"
import { useMemo, useRef, useState } from "react"
import shortUUID from "short-uuid"
import { Button, Main } from "../components/Primitives"
import { nth } from "../lib/english"
import { CreateReturn } from "./api/create"

const short = shortUUID()

const jokes = [
  {
    question: "Cats or Dogs?",
    options: ["Cats!", "Dogs!", "Rats!?"],
  },
]

const Home: NextPage = () => {
  const titleRef = useRef<HTMLInputElement>(null!)
  const [title, setTitle] = useState("")
  const [options, setOptions] = useState<{ id: string; option: string }[]>([
    { id: "imspecial", option: "" },
  ])
  const useable = useMemo(
    () => options.filter(option => option.option.length > 0),
    [options]
  )
  const router = useRouter()

  return (
    <Main>
      <Head>
        <title>Straw Poll</title>
        <meta name="description" content="Create a new straw poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form className="flex flex-col gap-2">
        <div>
          <label
            htmlFor="question"
            className="block text-left font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-lg">
            A question
          </label>

          <input
            type="text"
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            autoComplete="off"
            placeholder="Cats vs Dogs"
            required
            maxLength={70}
            id="question"
            ref={titleRef}
            value={title}
            onChange={e => setTitle((e.target as HTMLInputElement).value)}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-left font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-lg">
            Options
          </legend>
          {options.map((option, index) => (
            <input
              type="text"
              className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              autoComplete="off"
              key={option.id}
              required={index <= 1}
              value={option.option}
              maxLength={70}
              placeholder={
                jokes[0].options[index]
                  ? jokes[0].options[index]
                  : index === 9
                  ? "The final option"
                  : `A ${index + 1}${nth(index + 1)} option`
              }
              onChange={e => {
                e.preventDefault()
                if (index === options.length - 1 && options.length < 10) {
                  setOptions(options => [
                    ...options,
                    {
                      id: short.new(),
                      option: "",
                    },
                  ])
                } else if (
                  index === options.length - 2 &&
                  (e.target as HTMLInputElement).value.length === 0
                ) {
                  setOptions(options => options.filter((_, i) => index + 1 > i))
                }

                setOptions(options => {
                  const copy = options.slice()
                  copy[index] = {
                    ...copy[index],
                    option: (e.target as HTMLInputElement).value,
                  }
                  return copy
                })
              }}
              onBlurCapture={e => {
                if (
                  e.target.value.length === 0 &&
                  index !== options.length - 1
                ) {
                  setOptions(options => options.filter(v => v.id !== option.id))
                }
              }}
            />
          ))}
        </fieldset>

        <Button
          disabled={title.length === 0 || useable.length < 2}
          onClickLoad={async (e, setLoading) => {
            e.preventDefault()
            setLoading(true)
            const fetched = await fetch(`/api/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                question: title,
                options: options.map(option => option.option),
              }),
            })

            const data = (await fetched.json()) as CreateReturn

            if (data.error === null) {
              router.push(data.url!)
            } else {
              setLoading(false)
            }
          }}
          loadingText="Creating...">
          {title.length === 0
            ? "Add a title"
            : useable.length < 2
            ? `Add ${2 - useable.length} more ${pluralize(
                "option",
                useable.length
              )}`
            : "Create"}
        </Button>
      </form>
    </Main>
  )
}

export default Home
