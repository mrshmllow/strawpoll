import { NextSeo } from "next-seo"
import { Main } from "../components/Primitives"

const NotFound = () => (
  <Main>
    <NextSeo
      titleTemplate="%s Error | Strawpoll.ink"
      title="404"
      description="Thats an error."
    />

    <div className="flex flex-col">
      <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
        Not found
      </span>
      <span>404</span>
    </div>
  </Main>
)

export default NotFound
