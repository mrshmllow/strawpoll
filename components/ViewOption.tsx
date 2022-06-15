import { useMemo } from "react"
import { IOption } from "../types/tables"
import { m } from "framer-motion"
import { supabase } from "../lib/supabaseClient"

const ViewOption: React.FC<{
  option: IOption
  max: number
  colour: string
}> = ({ option, max, colour }) => {
  const width = useMemo(() => {
    const number =
      option.votes === 0 ? option.votes : (100 * option.votes) / max
    return `${number === NaN ? 0 : number.toFixed(0)}%`
  }, [option.votes, max])

  return (
    <div role="listitem">
      <div
        className={`flex justify-between text-${colour}-700 mb-1 items-center gap-2 font-medium dark:text-slate-200`}>
        <span className="break-all text-lg sm:text-2xl">{option.option}</span>
        <span className="w-fit text-sm sm:text-lg">
          {width}{" "}
          <span className="text-slate-500 dark:text-slate-400">
            {option.votes > 0 && `(${option.votes})`}
          </span>
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <m.div
          className={`bg-${colour}-600 h-2.5 rounded-full transition`}
          animate={{ width }}
          initial={{ width: 0 }}
          transition={{ ease: "easeInOut" }}></m.div>
      </div>
      {option.image && (
        <img
          src={
            supabase.storage.from("polls").getPublicUrl(option.image).publicURL!
          }
          className="mx-auto mt-2 rounded-lg"
        />
      )}
    </div>
  )
}

export default ViewOption
