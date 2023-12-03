import { bool, func, object } from 'prop-types';
import { useSecureAxios } from '../hooks/useSecureAxios';
import toast from 'react-hot-toast';
import { Toast } from '../utils/Toast';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../utils/Spinner';
import { ConfirmToast } from '../utils/ConfirmToast';
import { Link } from 'react-router-dom';
import moment from 'moment';

export const ProductTable = ({ product, refetch, isMod }) => {
  const secureAxios = useSecureAxios();
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useAuth();
  let toasts;

  const handleDelete = id => {
    if (!id || isUpdating || toasts) return;
    toasts = ConfirmToast(
      <span>
        Are you sure you want to delete the product <b className="text-red">{product.productName}</b>
      </span>
    )
      .then(async () => {
        setIsUpdating(true);

        try {
          const { success } = (
            await secureAxios.delete('/product/' + id, {
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
                Successfully deleted the product <b>{product.productName}</b>
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

  const handleReport = async id => {
    if (isUpdating) return;

    await ConfirmToast(<span>Are you sure you want to mark this product as safe?</span>, '#0016ec')
      .then(async () => {
        try {
          setIsUpdating(true);
          const { success } = (
            await secureAxios.patch(
              '/product/report/' + id,
              { reported: false },
              {
                params: {
                  email: user?.email,
                  uid: user?.uid,
                },
              }
            )
          ).data;
          if (success) {
            toast.dismiss();
            Toast(`Successfully marked the product`);
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
          Toast(err.response?.data?.message || 'Something went wrong', { isError: true });
          setIsUpdating(false);
        }
      })
      .catch(() => {});
  };

  return (
    <tbody className="border border-red/5 text-sm">
      <tr className="outline outline-1 outline-red/5 max-md:flex max-md:flex-wrap max-md:px-4">
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
          <span className="max-md:block hidden text-neutral-400 mb-2">Name</span>
          {product?.productName}
        </td>
        {isMod && (
          <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
            <span className="max-md:block hidden text-neutral-400 mb-2">Name</span>
            {product?.user?.email}
          </td>
        )}
        {isMod && (
          <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
            <span className="max-md:block hidden text-neutral-400 mb-2">Name</span>
            {moment(product?.createdAt).fromNow()}
          </td>
        )}
        {isMod && (
          <>
            <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
              <Link to={'/product/' + product.id}>
                <button className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-black max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden">
                  View Details
                </button>
              </Link>
            </td>
            <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
              <span className="max-md:block hidden text-neutral-400 mb-2">Total Report</span>
              <span className="text-red font-bold">{product?.reported}</span>
            </td>
          </>
        )}
        {!isMod && (
          <>
            <td className="py-4 max-md:w-full max-md:py-2 capitalize">
              <span className="max-md:block hidden text-neutral-400 mb-2">Up Votes</span>
              <div className="flex items-center gap-4">
                {product.upvote}
                <div className="w-3 h-3 text-blue stroke-2 stroke-blue mt-0.5">
                  <svg>
                    <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
                  </svg>
                </div>
              </div>
            </td>
            <td className="py-4 max-md:w-full max-md:py-2 capitalize">
              <span className="max-md:block hidden text-neutral-400 mb-2">Down Votes</span>
              <div className="flex items-center gap-4">
                {product.downvote}
                <div className="w-3 h-3 text-red stroke-2 stroke-red mt-0.5 rotate-180">
                  <svg>
                    <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
                  </svg>
                </div>
              </div>
            </td>
          </>
        )}
        {!isMod && (
          <td className="py-4 max-md:w-full max-md:py-2 capitalize">
            <span className="max-md:block hidden text-neutral-400 mb-2">Status</span>
            {product.status === 'approved' ? <span className="font-semibold text-blue">Approved</span> : <span className="text-red font-semibold capitalize">{product?.status}</span>}
          </td>
        )}
        <td className="text-right py-4 max-md:w-full max-md:text-center max-md:pb-6 max-md:mt-4">
          <div className="flex items-center gap-4 md:gap-14 max-md:flex-col justify-end">
            {isMod ? (
              <button
                onClick={() => handleReport(product.id)}
                className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-blue text-blue max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden relative"
              >
                <span className={isUpdating ? 'opacity-0' : ''}>Mark as safe</span>
                {isUpdating && <Spinner></Spinner>}
              </button>
            ) : (
              <Link to={'/dashboard/update-product/' + product.id}>
                <button className="font-semibold underline active:scale-[.99] transition-transform max-md:w-full max-md:no-underline max-md:bg-black max-md:text-white max-md:rounded max-md:px-4 max-md:py-3 overflow-hidden">
                  Update
                </button>
              </Link>
            )}
            <button
              onClick={() => handleDelete(product.id)}
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

ProductTable.propTypes = {
  product: object,
  refetch: func,
  isMod: bool,
};
