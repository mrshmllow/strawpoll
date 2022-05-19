import Head from "next/head"
import { Main } from "../components/Primitives"

const ServerError = () => (
  <Main>
    <Head>
      <title>A 500 Error | Strawpoll</title>
      <meta name="description" content="Internal Server Error" />
    </Head>

    <div className="flex flex-col">
      <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
        Internal Server Error
      </span>
      <span>500~ error</span>
    </div>
  </Main>
)

export default ServerError
