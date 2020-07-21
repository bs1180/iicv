import "../styles/index.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <title>IICV</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
