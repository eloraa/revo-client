import { func, object } from 'prop-types';
import { useSecureAxios } from '../hooks/useSecureAxios';
import toast from 'react-hot-toast';
import { Toast } from '../utils/Toast';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../utils/Spinner';
import { ConfirmToast } from '../utils/ConfirmToast';
import moment from 'moment';

export const CouponsTable = ({ coupon, setCoupon, refetch }) => {
  const secureAxios = useSecureAxios();
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useAuth();
  let toasts;
  const handleDelete = id => {
    if (!id || isUpdating || toasts) return;
    toasts = ConfirmToast(
      <span>
        Are you sure you want to delete the coupon <b className="text-red">{coupon?.code}</b>
      </span>
    )
      .then(async () => {
        setIsUpdating(true);

        try {
          const { success } = (
            await secureAxios.delete('/coupons/' + id, {
              params: {
                email: user?.email,
                uid: user?.uid,
              },
            })
          ).data;
          if (success) {
            toast.dismiss();
            Toast(
              <span>
                Successfully deleted the coupon <b>{coupon?.code}</b>
              </span>
            );
            refetch();
            setIsUpdating(false);
          } else {
            toast.dismiss();
            Toast('Something went wrong', { isError: true });
            setIsUpdating(false);
          }
        } catch (err) {
          toast.dismiss();
          console.log(err);
          Toast('Something went wrong', { isError: true });
          setIsUpdating(false);
        }
      })
      .catch(() => {
        toasts = undefined;
      });
  };
  return (
    <tbody className="border border-red/5 text-sm">
      <tr className="outline outline-1 outline-red/5 max-md:flex max-md:flex-wrap max-md:px-4">
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6 align-top">
          <span className="max-md:block hidden text-neutral-400 mb-2">Code</span>
          {coupon?.code}
        </td>
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6 align-top">
          <span className="max-md:block hidden text-neutral-400 mb-2">Description</span>
          {coupon?.description}
        </td>
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6 align-top">
          <span className="max-md:block hidden text-neutral-400 mb-2">Discount</span>${coupon?.discount}
        </td>
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6 align-top capitalize">
          <span className="max-md:block hidden text-neutral-400 mb-2">Expires</span>
          {moment(coupon?.expires).fromNow()}
        </td>
        <td className="text-right py-4 max-md:w-full max-md:text-center max-md:pb-6 max-md:mt-4 align-top">
          <div className="flex items-center gap-4 md:gap-14 max-md:flex-col justify-end">
            <button
              onClick={() => setCoupon(coupon)}
              className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-black max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(coupon?.id)}
              className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-red text-red max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden relative"
            >
              <span className={isUpdating ? 'opacity-0' : ''}>Remove</span>
              {isUpdating && <Spinner></Spinner>}
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

CouponsTable.propTypes = {
  coupon: object,
  setCoupon: func,
  refetch: func,
};
