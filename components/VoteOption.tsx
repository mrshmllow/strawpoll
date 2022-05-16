import { faCircle, faCircleDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dispatch, SetStateAction } from 'react'
import { IOption } from '../types/tables'

const VoteOption: React.FC<{
  option: IOption
  selected: string | undefined
  setSelected: Dispatch<SetStateAction<string | undefined>>
}> = ({ option, selected, setSelected }) => {
  return (
    <button
      className={`w-full text-blue-700 dark:text-slate-200 font-medium pr-2 py-2 transition-colors rounded-md flex items-center cursor-pointer text-lg sm:text-2xl break-all ${
        selected === option.id ? 'dark:bg-slate-800' : 'hover:dark:bg-slate-800'
      }`}
      onClick={() => setSelected(option.id)}
      aria-label={option.option}
      role="radio"
      aria-checked={selected === option.id}
      id={option.id}>
      <FontAwesomeIcon
        className={`mx-3 w-5 ${
          selected === option.id
            ? 'text-blue-600'
            : 'text-slate-400 dark:text-slate-600'
        }`}
        size="lg"
        icon={selected === option.id ? faCircleDot : faCircle}
      />
      <label htmlFor={option.id} className="cursor-pointer">
        {option.option}
      </label>
    </button>
  )
}

export default VoteOption
