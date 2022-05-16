import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ButtonHTMLAttributes,
  Dispatch,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'

export const Main: React.FC<{ children: ReactNode }> = ({ children }) => (
  <main className="m-auto px-2 sm:w-11/12 md:w-3/5 lg:w-2/5">{children}</main>
)

export const Button: React.FC<
  {
    children: ReactNode
    onClickLoad?: (
      event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
      setLoading: Dispatch<SetStateAction<boolean>>
    ) => void
    loadingText?: string
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, onClickLoad, loadingText, ...props }) => {
  const [loading, setLoading] = useState(false)

  return (
    <button
      {...props}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:dark:bg-slate-700 transition-colors break-all"
      disabled={props.disabled || loading}
      onClick={e => {
        props.onClick && props.onClick(e)
        if (onClickLoad) {
          onClickLoad(e, setLoading)
        }
      }}>
      {loading ? (
        <>
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
