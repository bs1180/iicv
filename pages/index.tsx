import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="space-y-5">
      <h1 className="max-w-md text-4xl font-bold leading-tight text-gray-900 text-left">
        International Improv Community in Vienna
      </h1>
      <hr />
      <div>
        We are an English language improv group based in Vienna, Austria.
      </div>
      <div>
        For our upcoming events, please see our{" "}
        <a
          className="underline"
          href="https://www.meetup.com/International-Improv-Wien"
        >
          Meetup
        </a>{" "}
        and{" "}
        <a
          className="underline"
          href="https://www.facebook.com/InternationalImprovVienna"
        >
          Facebook
        </a>{" "}
        pages
      </div>
      <div>
        If you've attended some of our open sessions, you can{" "}
        <Link href="/register">
          <a className="underline">register for membership</a>
        </Link>
      </div>

      <div className="opacity-50">
        Already a member?{" "}
        <Link href="/login" passHref>
          <a className="underline hover:no-underline">Login here</a>
        </Link>
      </div>
    </div>
  );
}
