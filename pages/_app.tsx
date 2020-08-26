import "../styles/index.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <title>IICV</title>
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
