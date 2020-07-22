import { useQuery } from "react-query";
import { fetcher } from "../../utils/fetcher";

const fetchMembers = fetcher(`{ 
  users { 
    id
    name
    email
  } }`);

const AdminDashboard = ({ users }) => {
  const { isLoading, error, data } = useQuery("members", fetchMembers);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops, can't retrieve that.</div>;
  }

  console.log(data);
  const members = [];

  return (
    <div className="">
      <div className="mx-auto max-w-lg">List of members</div>
      <table className="table-fixed bg-white">
        <tbody>
          {members.map((m) => (
            <tr>
              <td className="w-1/2 px-4 py-2">{m.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
