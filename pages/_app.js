import '../css/style.css'
import '../css/form.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <div className='app'>
      <Head>
        <title>Connect 4</title>
      </Head>

      <div className="top-bar">
        <h1>Connect 4</h1>
      </div>
      <div className=" wrapper ">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
