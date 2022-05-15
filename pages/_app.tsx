import '../styles/globals.css'
import type { AppProps } from 'next/app'
// import { Provider } from 'react-supabase'
import { LazyMotion } from 'framer-motion'
import { NextPageWithLayout } from '../lib/types'
import Layout from '../components/Layout'
import { config, dom } from '@fortawesome/fontawesome-svg-core'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
config.autoAddCss = false

type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout }

const loadFeatures = () =>
  import('../lib/motionFeatures.js').then(res => res.default)

const App = ({ Component, pageProps }: AppPropsWithLayout) => (
  // <Provider value={supabase}>
    <LazyMotion features={loadFeatures}>
      <ThemeProvider attribute="class">
        <Head>
          <style>{dom.css()}</style>
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </LazyMotion>
  // </Provider>
)

export default App
