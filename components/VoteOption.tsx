import { faCircle, faCircleDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { IOption } from '../types/tables'

const VoteOption: React.FC<{
  option: IOption
  selected: string | undefined
  setSelected: Dispatch<SetStateAction<string | undefined>>
  colour: string
}> = ({ option, colour, selected, setSelected }) => {
  return (
    <label
      className={`w-full text-${colour}-700 dark:text-slate-200 font-medium transition-colors rounded-md flex items-center h-11 cursor-pointer ${
        selected === option.id ? 'dark:bg-slate-800' : 'hover:dark:bg-slate-800'
      }`}
      onClick={() => setSelected(option.id)}>
      <FontAwesomeIcon
        className={`mx-3 ${
          selected === option.id
            ? `text-${colour}-600`
            : 'text-slate-400 dark:text-slate-600'
        }`}
        size="lg"
        icon={selected === option.id ? faCircleDot : faCircle}
      />
      <span className="text-lg sm:text-2xl">{option.option}</span>
    </label>
  )
}

export default VoteOption
