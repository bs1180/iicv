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
      <div className="bg-gray-50 min-h-screen flex ">
        <div className="mx-auto max-w-sm md:max-w-2xl px-8 space-y-8 py-4 md:py-16 border-t-4 border-transparent">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;
