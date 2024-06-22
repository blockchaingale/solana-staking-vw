import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { NextComponentType, NextPageContext } from 'next'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
