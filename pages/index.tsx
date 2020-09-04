import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center">
      <div className="mx-auto max-w-md px-8 space-y-8">
        <h1 className="text-4xl font-bold leading-tight text-gray-900">
          International Improv Community in Vienna
        </h1>
        <div>
          <Link href="/register" passHref>
            <a className="btn">Register &#187;</a>
          </Link>
        </div>
        <div className="text-gray-600">
          Already a member?{" "}
          <Link href="/login" passHref>
            <a className="underline hover:no-underline">Login here</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
