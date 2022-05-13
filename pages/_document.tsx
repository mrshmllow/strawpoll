import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html className="dark">
      <Head />
      <body className="bg-white dark:bg-slate-900 h-screen text-center text-slate-500 dark:text-slate-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
