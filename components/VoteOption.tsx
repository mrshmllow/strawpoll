import { faCircle, faCircleDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, SetStateAction } from "react"
import { supabase } from "../lib/supabaseClient"
import { IOption } from "../types/tables"

const VoteOption: React.FC<{
  option: IOption
  selected: string | undefined
  setSelected: Dispatch<SetStateAction<string | undefined>>
}> = ({ option, selected, setSelected }) => {
  return (
    <button
      className={`w-full cursor-pointer items-center break-all rounded-md py-2 text-lg font-medium text-blue-700 transition-colors dark:text-slate-200 sm:text-2xl ${
        selected === option.id ? "dark:bg-slate-800" : "hover:dark:bg-slate-800"
      } ${option.image ? "px-2" : "pr-2"}`}
      onClick={() => setSelected(option.id)}
      aria-label={option.option}
      role="radio"
      aria-checked={selected === option.id}
      id={option.id}>
      <div className="flex w-full">
        <FontAwesomeIcon
          className={`mx-3 w-5 ${
            selected === option.id
              ? "text-blue-600"
              : "text-slate-400 dark:text-slate-600"
          }`}
          size="lg"
          icon={selected === option.id ? faCircleDot : faCircle}
        />
        <label htmlFor={option.id} className="cursor-pointer">
          {option.option}
        </label>
      </div>
      {option.image && (
        <img
          src={
            supabase.storage.from("polls").getPublicUrl(option.image).publicURL!
          }
          className="mx-auto mt-2 rounded-lg"
          alt={option.option}
        />
      )}
    </button>
  )
}

export default VoteOption
