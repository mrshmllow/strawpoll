import { Html, Head, Main, NextScript } from "next/document"

const Document = () => {
  return (
    <Html className="dark">
      <Head />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,800;0,900;1,800&display=swap"
        rel="stylesheet"
      />
      <body className="bg-white text-center text-slate-500 transition-colors dark:bg-slate-900 dark:text-slate-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
