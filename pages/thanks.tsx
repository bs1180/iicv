import Link from "next/link";

const Thanks = () => {
  return (
    <div className="flex items-center min-h-screen">
      <div className="mx-auto text-center space-y-8">
        <div>Thank you for registering!</div>
        <p>Your support is much appreciated.</p>
        <div>
          <Link href="/login">
            <a className="text-sm underline text-gray-400">Login to member's area</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
