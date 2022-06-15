import { faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
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
  const [options, setOptions] = useState<
    { id: string; option: string; image?: File }[]
  >([{ id: "imspecial", option: "" }])
  const useable = useMemo(
    () => options.filter(option => option.option.length > 0),
    [options]
  )
  const router = useRouter()

  return (
    <Main>
      <h1 className="mb-2 flex flex-col text-xl text-slate-900 dark:text-slate-200 sm:text-2xl">
        <span className="text-blue-700 dark:text-blue-500">Finally!</span>
        <span>A Friendly, OpenSource</span>
        <span>Strawpoll App</span>
      </h1>

      <form className="mb-2 flex flex-col gap-2">
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
            <div className="flex flex-col gap-2" key={option.id}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  autoComplete="off"
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
                      setOptions(options =>
                        options.filter((_, i) => index + 1 > i)
                      )
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
                      setOptions(options =>
                        options.filter(v => v.id !== option.id)
                      )
                    }
                  }}
                />
                {option.option.length !== 0 && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`${option.id}.picker`}
                      onChange={e => {
                        setOptions(options => {
                          const copy = options.slice()
                          copy[index] = {
                            ...copy[index],
                            image: e.target.files![0],
                          }
                          return copy
                        })
                      }}
                    />
                    <button
                      className="whitespace-nowrap rounded-lg border border-gray-200 py-2.5 px-3 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      onClick={e => {
                        e.preventDefault()
                        if (!option.image) {
                          const picker = document.getElementById(
                            `${option.id}.picker`
                          ) as HTMLInputElement
                          picker.click()
                        } else {
                          setOptions(options => {
                            const copy = options.slice()
                            copy[index] = {
                              ...copy[index],
                              image: undefined,
                            }
                            return copy
                          })
                        }
                      }}>
                      {option.image ? (
                        "Remove Image"
                      ) : (
                        <FontAwesomeIcon icon={faImage} size="lg" />
                      )}
                    </button>
                  </>
                )}
              </div>
              {option.image && option.option.length !== 0 && (
                <img
                  className="rounded-lg"
                  src={URL.createObjectURL(option.image)}
                  alt="A selected image"
                />
              )}
            </div>
          ))}
        </fieldset>

        <Button
          disabled={title.length === 0 || useable.length < 2}
          onClickLoad={async (e, setLoading) => {
            e.preventDefault()
            setLoading(true)
            function _arrayBufferToBase64(buffer: ArrayBuffer) {
              var binary = ""
              var bytes = new Uint8Array(buffer)
              var len = bytes.byteLength
              for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i])
              }
              return window.btoa(binary)
            }

            const fetched = await fetch(`/api/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                question: title,
                options: await Promise.all(
                  options.map(async option => ({
                    option: option.option,
                    image:
                      option.image &&
                      _arrayBufferToBase64(await option.image.arrayBuffer()),
                    contentType: option.image && option.image.type,
                  }))
                ),
              }),
            })

            const data = (await fetched.json()) as CreateReturn

            if (data.error === null) {
              router.push(data.url!)
            } else {
              setLoading(false)
            }
          }}
          loadingText={`Creating${
            options.find(option => option.image) ? " And Uploading" : ""
          }...`}>
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

      <p className="flex flex-col">
        <span>Polls are hCaptcha and IP protected.</span>

        <span className="flex justify-center gap-1">
          Read the
          <Link href="/privacy">
            <a className="underline">privacy policy</a>
          </Link>
        </span>
      </p>
    </Main>
  )
}

export default Home
