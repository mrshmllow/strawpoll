import "../styles/globals.css"
import type { AppProps } from "next/app"
import { LazyMotion } from "framer-motion"
import { NextPageWithLayout } from "../lib/types"
import Layout from "../components/Layout"
import { config, dom } from "@fortawesome/fontawesome-svg-core"
import Head from "next/head"
import Router from "next/router"
import NProgress from "nprogress"
import "../styles/nprogress.css"
import { ThemeProvider } from "next-themes"
config.autoAddCss = false

type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout }

Router.events.on("routeChangeStart", () => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

const loadFeatures = () =>
  import("../lib/motionFeatures.js").then(res => res.default)

const App = ({ Component, pageProps }: AppPropsWithLayout) => (
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
)

export default App
