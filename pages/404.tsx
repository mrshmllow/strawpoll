import Head from 'next/head'
import { Main } from '../components/Primitives'

const NotFound = () => (
  <Main>
    <Head>
      <title>404 Error | Strawpoll</title>
      <meta name="description" content="Not Found" />
    </Head>
    
    <div className='flex flex-col'>
      <span className='text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl'>Not found</span>
      <span>404</span>
    </div>
  </Main>
)

export default NotFound
