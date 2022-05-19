import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { IOption, IPoll, IVote } from '../types/tables'
import { useEffect, useMemo, useState } from 'react'
import ViewOption from '../components/ViewOption'
import pluralize from 'pluralize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBolt, faLock } from '@fortawesome/free-solid-svg-icons'
import VoteOption from '../components/VoteOption'
import { getClientIp } from 'request-ip'
import { adminSupabase } from '../lib/adminSupabaseClient'
import TimeSince from '../components/TimeSince'
import Head from 'next/head'
import { Button, Main } from '../components/Primitives'
import dayjs from '../lib/dayjs'
import { colours } from '../lib/colours/colours'
import { io, Socket } from 'socket.io-client'
import { useRouter } from 'next/router'
import { set as setCookie } from 'tiny-cookie'

type route = ParsedUrlQuery & {
  poll_id: string
}

const Poll: React.FC<{
  poll: Pick<IPoll, 'question' | 'created_at' | 'colour'>
  inital_options: IOption[]
  inital_voted: boolean
}> = ({ poll, inital_options, inital_voted }) => {
  const [options, setOptions] = useState(inital_options)
  const [socket, setSocket] = useState<Socket>(null!)
  const [status, setStatus] = useState<
    'Live' | 'Disconnected' | 'Connecting...'
  >('Connecting...')
  const router = useRouter()
  const { poll_id } = router.query as route

  const total_votes = useMemo(
    () => options.reduce((prev, option) => prev + option.votes, 0),
    [options]
  )
  const [voted, setVoted] = useState(inital_voted)
  const [selected, setSelected] = useState<string | undefined>(undefined)

  useEffect(() => {
    const socket = io({
      withCredentials: true,
      path: '/api/socket.io/',
    })

    socket.on('connect', () => {
      socket.emit('join', poll_id)
      setStatus('Live')
    })

    socket.io.on('reconnect', () => router.reload())
    socket.on('disconnect', () => setStatus('Disconnected'))

    socket.on('receive vote', (option: string) =>
      setOptions(options => {
        const copy = [...options]
        const index = options.findIndex(find => find.id === option)
        copy[index] = {
          ...options[index],
          votes: options[index].votes + 1,
        }

        return copy
      })
    )

    socket.on('return', () => {
      const now = new Date()
      // a week
      now.setDate(now.getDate() + 1 * 7)

      setCookie('voted', 'true', {
        expires: now.toUTCString(),
        path: `/${poll_id}`,
      })
      setVoted(true)
    })

    setSocket(socket)

    return () => {
      socket.close()
    }
  }, [poll_id, router])

  return (
    <Main>
      <Head>
        <title>{poll.question} | Strawpoll</title>
        <meta
          name="description"
          content={`Give your vote on '${poll.question}'!`}
        />
      </Head>

      <div className="flex flex-col gap-2">
        <div>
          <span>Anonymous asks:</span>
          <h1 className="break-all text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
            {poll.question}
          </h1>
        </div>

        <div className="flex justify-between sm:text-lg">
          <span>{pluralize('votes', total_votes, true)}</span>
          <TimeSince time={dayjs(poll.created_at)} />
        </div>

        <hr className="my-1 border-slate-500 dark:border-slate-400" />

        <div
          className="grid auto-rows-auto gap-2"
          role={voted ? 'listbox' : 'radiogroup'}>
          {options.map((option, index) =>
            voted ? (
              <ViewOption
                max={total_votes}
                key={option.id}
                option={option}
                colour={colours[index]}
              />
            ) : (
              <VoteOption
                key={option.id}
                option={option}
                setSelected={setSelected}
                selected={selected}
              />
            )
          )}
        </div>

        {voted ? (
          <div className="flex justify-between">
            <span>
              <FontAwesomeIcon className="mr-2 " icon={faBolt} />
              {status}
            </span>
            <span>
              IP Protected
              <FontAwesomeIcon className="ml-2" icon={faLock} />
            </span>
          </div>
        ) : (
          <>
            <Button
              disabled={!selected}
              onClickLoad={async (e, setLoading) => {
                e.preventDefault()

                // todo make proper loading
                setLoading(true)
                socket.emit('vote', selected)
              }}
              loadingText="Voting...">
              {!selected ? (
                <>Choose an option</>
              ) : (
                `Vote ${options.find(option => option.id === selected)!.option}`
              )}
            </Button>
            <span>
              <FontAwesomeIcon className="mr-2" icon={faLock} />
              Your IP is saved for protection
            </span>

            <button
              className="flex items-center justify-center gap-2"
              onClick={() => setVoted(true)}>
              Jump to results
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </>
        )}
      </div>
    </Main>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { poll_id } = context.query as route
  const ip = getClientIp(context.req)
  const { voted: cookieVoted } = context.req.cookies
  const voted = cookieVoted === 'true'

  const [polls_query, options_query, ip_query] = await Promise.all([
    adminSupabase
      .from<IPoll>('polls')
      .select('question,created_at,colour')
      .filter('id', 'eq', poll_id),
    adminSupabase
      .from<IOption>('options')
      .select('option,id,votes')
      .filter('owner', 'eq', poll_id),
    cookieVoted === undefined
      ? adminSupabase
          .from<IVote>('votes')
          .select('choice')
          .filter('poll_id', 'eq', poll_id)
          .filter('ip', 'eq', ip)
          .limit(1)
          .single()
      : null,
  ])

  if (
    polls_query.error ||
    options_query.error ||
    options_query.body.length === 0
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      poll: polls_query.body[0],
      inital_options: options_query.body,
      inital_voted: cookieVoted !== undefined ? voted : ip_query!.data !== null,
    },
  }
}

export default Poll
