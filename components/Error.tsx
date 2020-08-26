const Error = ({ message }) => {
  return message ? <div className="text-red-500 text-sm p-1">{message}</div> : null;
};

export default Error;
