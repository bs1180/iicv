import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center">
      <div className="mx-auto max-w-md px-8">
        <h1 className="text-4xl font-bold leading-tight">International Improv Community in Vienna</h1>
        <div className="py-6">Full website coming soon :)</div>
        <Link href="/register" passHref>
          <a className="btn">Register &#187;</a>
        </Link>
      </div>
    </div>
  );
}
