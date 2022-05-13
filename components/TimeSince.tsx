import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'

const TimeSince: React.FC<{ dateTime: DateTime }> = ({ dateTime }) => {
  const [show, setShow] = useState(false)
  const [_, setCount] = useState(0)

  useEffect(() => {
    setShow(true)

    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <>{show ? <span>{dateTime.toRelative()}</span> : <span>Loading</span>}</>
  )
  // return <>{false ? <span>{dateTime.toRelative()}</span> : <span className='w-1/5 h-8 rounded-md animate-pulse bg-slate-500 dark:bg-slate-400' />}</>
}

export default TimeSince
