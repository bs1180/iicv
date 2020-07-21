const AdminDashboard = ({ users }) => {
  const members = users?.data?.users ?? [];

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

export async function getServerSideProps({ req }) {
  const users = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{ 
      users { 
        id
        name
        email
      } }`,
    }),
  }).then((res) => res.json());
  return { props: { users } };
}

export default AdminDashboard;
