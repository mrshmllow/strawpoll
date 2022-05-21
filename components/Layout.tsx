import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ReactElement, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  faCog,
  faHeart,
  faMoon,
  faMugHot,
  faSun,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { faGithub } from "@fortawesome/free-brands-svg-icons"

const Layout: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [theme])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full items-center justify-between p-2 sm:w-11/12 md:w-3/5 lg:w-2/5">
        <Link href="/">
          <a className="text-2xl font-extrabold text-slate-900 dark:text-slate-200 sm:text-3xl">
            Strawpoll
          </a>
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg border border-gray-200 py-2.5 px-2.5 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
          <FontAwesomeIcon
            size="lg"
            className="mr-2"
            icon={!mounted ? faCog : resolvedTheme === "light" ? faSun : faMoon}
          />
          Change Theme
        </button>
      </header>
      {children}
      <footer className="mx-auto mt-auto w-full flex flex-col gap-1 p-2 pb-4 sm:w-11/12 md:w-3/5 lg:w-2/5">
        <div className="flex justify-between">
          <span>
            Made with
            <FontAwesomeIcon className="ml-1" icon={faHeart} />
          </span>

          <Link href="https://github.com/mrshmllow/strawpoll">
            <a target="_blank">
              Fork
              <FontAwesomeIcon className="ml-1" icon={faGithub} />
            </a>
          </Link>
        </div>

        <div className="flex justify-between">
          <Link href="/privacy">Privacy</Link>
          <Link href="https://ko-fi.com/mrshmllow">
            <a target="_blank">
              Ko-Fi
              <FontAwesomeIcon className="ml-1" icon={faMugHot} />
            </a>
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Layout
