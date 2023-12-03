import { func, object } from 'prop-types';
import { useSecureAxios } from '../hooks/useSecureAxios';
import toast from 'react-hot-toast';
import { Toast } from '../utils/Toast';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../utils/Spinner';
import { ConfirmToast } from '../utils/ConfirmToast';
import { Link } from 'react-router-dom';

export const QueueTable = ({ product, refetch }) => {
  const secureAxios = useSecureAxios();
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useAuth();
  let toasts;

  const handleChange = (id, type) => {
    if (!id || isUpdating || toasts) return;
    if (id.target && id.target.value === 'action') return;
    toast.dismiss(toasts);
    toasts = ConfirmToast(
      <span>
        Are you sure you want to {(type || id.target.value) === 'removefeatured' ? 'remove featured status for' : type || id.target.value} the product{' '}
        <b className={id?.target?.value === 'reject' ? 'text-red' : 'text-blue'}>{product.productName}?</b>
      </span>,
      id?.target?.value === 'reject' ? '#ff4c41' : '#0016ec'
    )
      .then(async () => {
        setIsUpdating(true);

        try {
          const { success } = (
            await secureAxios.patch('/product/set-status/' + product.id, {
              email: user?.email,
              uid: user?.uid,
              status:
                (type || id.target.value) === 'feature'
                  ? 'featured'
                  : (type || id.target.value) === 'removefeatured'
                  ? type || id.target.value
                  : (type || id.target.value) === 'reject'
                  ? 'rejected'
                  : (type || id.target.value) === 'accept' && 'approved',
            })
          ).data;
          if (success) {
            Toast(
              <span>
                Successfully changed the status of the product <b>{product.productName}</b>
              </span>
            );
            refetch();
            toast.dismiss();
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
          id.target && (id.target.value = 'action');
          setIsUpdating(false);
        }
      })
      .catch(() => {
        toasts = undefined;
        id.target && (id.target.value = 'action');
      });
  };

  return (
    <tbody className="border border-red/5 text-sm">
      <tr className="outline outline-1 outline-red/5 max-md:flex max-md:flex-wrap max-md:px-4">
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
          <span className="max-md:block hidden text-neutral-400 mb-2">Name</span>
          {product?.productName}
        </td>
        <td className="py-4 max-md:w-full max-md:py-2">
          <span className="max-md:block hidden text-neutral-400 mb-2">Owner Email</span>
          {product.user.email}
        </td>
        <td className="py-4 max-md:w-full max-md:py-2 capitalize">
          <span className="max-md:block hidden text-neutral-400 mb-2">Details</span>
          <Link to={'/product/' + product.id + '?status=pending'}>
            <button className="font-semibold underline active:scale-[.99] transition-transform overflow-hidden">
              View Details
            </button>
          </Link>
        </td>
        <td className="py-4 max-md:w-full max-md:py-2 capitalize">
          <span className="max-md:block hidden text-neutral-400 mb-2">Status</span>
          {product.status === 'approved' ? <span className="font-semibold text-blue">Approved</span> : <span className="text-red font-semibold capitalize">{product?.status}</span>}
        </td>
        <td className="text-right py-4 max-md:w-full max-md:text-center max-md:pb-6 max-md:mt-4 relative">
          {isUpdating && <Spinner className="right-0"></Spinner>}
          <div className={isUpdating ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
            {product.status === 'pending' ? (
              <div className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-black max-md:text-white max-md:rounded max-md:pr-4 overflow-hidden">
                <select defaultValue="action" name="" id="" className="bg-transparent max-md:pl-4 max-md:py-3 max-md:w-full max-md:bg-black" onChange={handleChange}>
                  <option value="action">Action</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
            ) : product.status === 'rejected' ? (
              <button
                disabled
                className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-red text-red opacity-40 cursor-not-allowed max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden"
              >
                Rejected
              </button>
            ) : !product.featured ? (
              <button
                onClick={() => handleChange(product.id, 'feature')}
                className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-black max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden"
              >
                Make Featured
              </button>
            ) : (
              <button
                onClick={() => handleChange(product.id, 'removefeatured')}
                className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-red text-red max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden"
              >
                Remove Featured
              </button>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );
};

QueueTable.propTypes = {
  product: object,
  refetch: func,
};
