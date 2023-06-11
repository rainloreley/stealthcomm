import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-material-symbols/dist/rounded.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
