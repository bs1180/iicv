import { useEffect } from "react";

const Thanks = () => {
  return (
    <div className="flex items-center min-h-screen">
      <div className="mx-auto text-center space-y-8 px-4 md:px-0">
        <div className="text-xl font-semibold">Thank you for becoming a member!</div>
        <p>An receipt for your payment has been emailed to you.</p>
      </div>
    </div>
  );
};

export default Thanks;
