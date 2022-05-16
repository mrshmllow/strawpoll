import dayjs from '../lib/dayjs'
import { useEffect, useState } from 'react'

const TimeSince: React.FC<{ time: dayjs.Dayjs }> = ({ time }) => {
  const [_, setCount] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  return <span>{time.fromNow()}</span>
}

export default TimeSince
