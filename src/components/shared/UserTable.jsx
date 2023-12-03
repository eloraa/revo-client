import { bool, func, object } from 'prop-types';
import { Toast } from '../utils/Toast';
import { useSecureAxios } from '../hooks/useSecureAxios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const UserTable = ({ user, setIsUpdating, isUpdating, refetch }) => {
  const roles = ['admin', 'moderator', 'normal'];
  const secureAxios = useSecureAxios();
  const { user: currentUser } = useAuth();

  const handleChange = async e => {
    if (isUpdating) return;
    setIsUpdating(true);
    const toasts = Toast(<b>Updating user. it may take some time</b>, { duration: Infinity });
    if (!roles.includes(e.target.value)) return Toast('Something is wrong.', { isError: true });

    try {
      const { success } = (await secureAxios.patch('/auth/claims', { uid: currentUser?.uid, email: currentUser?.email, userEmail: user.email, userUID: user.uid, role: e.target.value })).data;
      if (success) {
        Toast(
          <span>
            Successfully Updated the user <b>{user.name}</b>
          </span>
        );
        refetch();
        toast.dismiss(toasts);
        setIsUpdating(false);
      } else {
        toast.dismiss(toasts);
        Toast('Something went wrong', { isError: true });
        e.target.value = 'action';
        setIsUpdating(false);
      }
    } catch (err) {
      if (err.response?.data?.message === 'There should be at least one admin') Toast('There should be at least one admin');
      else {
        Toast('Something went wrong', { isError: true });
        console.log(err);
      }
      toast.dismiss(toasts);
      e.target.value = 'action';
      setIsUpdating(false);
    }
  };

  return (
    <tbody className="border border-red/5 text-sm">
      <tr className="outline outline-1 outline-red/5 max-md:flex max-md:flex-wrap max-md:px-4">
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
          <span className="max-md:block hidden text-neutral-400 mb-2">Name</span>
          {user.name}
        </td>
        <td className="py-4 max-md:w-full max-md:py-2">
          <span className="max-md:block hidden text-neutral-400 mb-2">Email</span>
          {user.email}
        </td>
        <td className="py-4 max-md:w-full max-md:py-2 capitalize">
          <span className="max-md:block hidden text-neutral-400 mb-2">Role</span>
          {user.role}
        </td>
        <td className="text-right py-4 max-md:w-full max-md:text-center max-md:pb-6 max-md:mt-4">
          <div className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-black max-md:text-white max-md:rounded max-md:pr-4 overflow-hidden">
            <select defaultValue="action" name="" id="" className="bg-transparent max-md:pl-4 max-md:py-3 max-md:w-full max-md:bg-black" onChange={handleChange}>
              <option value="action" disabled>
                Action
              </option>
              <option value="normal" disabled={user.role === 'normal'}>
                Make user normal
              </option>
              <option value="moderator" disabled={user.role === 'moderator'}>
                Make user moderator
              </option>
              <option value="admin" disabled={user.role === 'admin'}>
                Make user admin
              </option>
            </select>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

UserTable.propTypes = {
  user: object,
  setIsUpdating: func,
  isUpdating: bool,
  refetch: func,
};
