import moment from 'moment/moment';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { user, userclaims } = useAuth();

  return (
    <div className="md:px-10 px-5 py-10">
      <p className="flex justify-between items-center flex-wrap gap-2">
        <span className="font-mono">Overview</span>
        <span>
          Logged in as: <strong className="text-red">{user?.email}</strong>
        </span>
      </p>
      <p className="mt-16">
        Hi <b>{user?.displayName}</b>
      </p>
      <ul className="mt-10 grid gap-4">
        <li>
          User Created: <span className="font-semibold text-red capitalize">{moment(user?.metadata?.creationTime).fromNow()}</span>
        </li>
        <li>
          Account Status: <span className="font-semibold capitalize">{user?.emailVerified ? 'Verified' : <span className="text-red">Not Verified</span>}</span>
        </li>
        <li>
          Last Logged In: <span className="font-semibold capitalize">{moment(user?.metadata?.lastSignInTime).fromNow()}</span>
        </li>
        <li>
          Subscription Status: <span className="font-semibold text-red capitalize">{userclaims?.claims?.subscribed ? 'Subscribed' : 'Not Subscribed'}</span>
        </li>
      </ul>
    </div>
  );
};
