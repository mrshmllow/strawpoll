import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import pluralize from 'pluralize'
import { useMemo, useRef, useState } from 'react'
import shortUUID from 'short-uuid'
import { Button, Main } from '../components/Primitives'
import { nth } from '../lib/english'
import { CreateReturn } from './api/create'

const short = shortUUID()

const jokes = [
  {
    question: 'Cats or Dogs?',
    options: ['Cats!', 'Dogs!', 'Rats!?'],
  },
]

const Home: NextPage = () => {
  const titleRef = useRef<HTMLInputElement>(null!)
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState<{ id: string; option: string }[]>([
    { id: 'imspecial', option: '' },
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
            className="block sm:text-lg font-extrabold text-slate-900 tracking-tight dark:text-slate-200 text-left">
            A question
          </label>

          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
            autoComplete="off"
            placeholder="Cats vs Dogs"
            required
            id="question"
            ref={titleRef}
            value={title}
            onChange={e => setTitle((e.target as HTMLInputElement).value)}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="sm:text-lg font-extrabold text-slate-900 tracking-tight dark:text-slate-200 text-left">
            Options
          </legend>
          {options.map((option, index) => (
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
              autoComplete="off"
              key={option.id}
              required={index <= 1}
              value={option.option}
              placeholder={
                jokes[0].options[index]
                  ? jokes[0].options[index]
                  : index === 9
                  ? 'The final option'
                  : `A ${index + 1}${nth(index + 1)} option`
              }
              onChange={e => {
                e.preventDefault()
                if (index === options.length - 1 && options.length < 10) {
                  setOptions(options => [
                    ...options,
                    {
                      id: short.new(),
                      option: '',
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
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
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
            ? 'Add a title'
            : useable.length < 2
            ? `Add ${2 - useable.length} more ${pluralize(
                'option',
                useable.length
              )}`
            : 'Create'}
        </Button>
      </form>
    </Main>
  )
}

export default Home
