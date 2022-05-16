import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactElement, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { faCog, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const Layout: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [theme])

  return (
    <>
      <header className="m-auto p-2 sm:w-11/12 md:w-3/5 lg:w-2/5 flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-200">
            Strawpoll
          </a>
        </Link>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="py-2.5 px-2.5 text-sm font-medium focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors">
          <FontAwesomeIcon
            size="lg"
            className="mr-2"
            icon={!mounted ? faCog : resolvedTheme === 'light' ? faSun : faMoon}
          />
          Change Theme
        </button>
      </header>
      {children}
    </>
  )
}

export default Layout
