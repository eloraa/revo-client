import { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { UserTable } from '../../shared/UserTable';
import { Helmet } from 'react-helmet-async';

export const ManageUsers = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { users, refetch } = useUsers();

  return (
    <div className={`md:px-10 px-5 ${isUpdating ? 'pointer-events-none cursor-not-allowed [&*]:cursor-not-allowed' : ''}`}>
      <Helmet>
        <title>Manage Users | REVO</title>
      </Helmet>
      <h1 className="flex items-center justify-between">
        <span className="font-mono">Manage Users</span>
        <p>
          Total Users: <span className="text-red font-semibold">{users.length}</span>
        </p>
      </h1>

      <main>
        {!users.length ? (
          <h1 className="text-2xl mb-1 text-red">There&apos;s no user.</h1>
        ) : (
          <table className="w-full mt-6 mb-16 border-spacing-4 border-separate max-md:flex max-md:flex-col gap-4">
            <thead className="text-left text-sm font-normal mb-2 text-neutral-500 max-md:hidden">
              <tr>
                <th className="font-normal py-4">Name</th>
                <th className="font-normal py-4">Email</th>
                <th className="font-normal py-4">Role</th>
                <th className="text-right font-normal py-4">Action</th>
              </tr>
            </thead>
            {users?.map(user => (
              <UserTable isUpdating={isUpdating} refetch={refetch} setIsUpdating={setIsUpdating} user={user} key={user.id}></UserTable>
            ))}
          </table>
        )}
      </main>
    </div>
  );
};
