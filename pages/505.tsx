import { NextSeo } from "next-seo"
import { Main } from "../components/Primitives"

const ServerError = () => (
  <Main>
    <NextSeo
      titleTemplate="%s Error | Strawpoll.ink"
      title="404"
      description="Thats an error."
    />

    <div className="flex flex-col">
      <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
        Internal Server Error
      </span>
      <span>500~ error</span>
    </div>
  </Main>
)

export default ServerError
