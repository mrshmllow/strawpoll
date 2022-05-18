import { useMemo } from 'react'
import { IOption } from '../types/tables'
import { m } from 'framer-motion'

const ViewOption: React.FC<{
  option: IOption
  max: number
  colour: string
}> = ({ option, max, colour }) => {
  const width = useMemo(() => {
    const number = (100 * option.votes) / max
    return `${number === NaN ? 0 : number.toFixed(0)}%`
  }, [option.votes, max])

  return (
    <div role="listitem">
      <div
        className={`flex justify-between text-${colour}-700 dark:text-slate-200 font-medium mb-1 gap-2 items-center`}>
        <span className="text-lg sm:text-2xl break-all">{option.option}</span>
        <span className="text-sm sm:text-lg w-fit">{width}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <m.div
          className={`bg-${colour}-600 h-2.5 rounded-full transition`}
          animate={{ width }}
          initial={{ width: 0 }}
          transition={{ ease: 'easeInOut' }}></m.div>
      </div>
    </div>
  )
}

export default ViewOption
