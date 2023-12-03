import moment from 'moment';
import { bool, func, object } from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from '../utils/Toast';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useSecureAxios } from '../hooks/useSecureAxios';
import { useContext, useState } from 'react';
import { ProductContext } from '../pages/Home';

export const ProductCards = ({ product, refetch, isPending }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const context = useContext(ProductContext);

  const secureAxios = useSecureAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (isPending) return <></>;

  const handleVote = async (type, id) => {
    if (!user) return navigate('/signin');
    if (!type || isUpdating) return;
    setIsUpdating(true);

    try {
      const { success } = (
        await secureAxios.patch(
          '/product/vote/' + id,
          { type },
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
        Toast(`Successfully ${type}d the the product`);

        context.refresh && context.refresh();
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
  };
  return (
    <div className="p-6 rounded bg-blue/5 flex flex-col gap-4 max-md:w-full">
      <figure className="h-40 w-full rounded-md overflow-hidden">
        <img src={product?.productPhoto} alt="" />
      </figure>
      <Link to={'/product/' + product?.id}>
        <h1 className="font-mono text-lg font-bold">{product?.productName}</h1>
      </Link>
      <div className="flex items-center gap-2 flex-wrap w-full">
        {product?.tags?.map(tag => (
          <span className="bg-black py-1 px-3 text-sm rounded text-white" key={tag}>
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 mb-6 text-sm font-semibold gap-2">
        <div className="flex items-center gap-2">
          <figure className="w-6 h-6 rounded overflow-hidden">
            <img src={product?.user?.photoURL} alt="" />
          </figure>
          <h4>{product?.user?.name}</h4>
        </div>
        <h4>{moment(product?.createdAt).fromNow()}</h4>
      </div>
      <div className="flex items-center justify-between mt-auto border-t border-red/20 pt-4 text-sm font-semibold">
        <h4>Vote</h4>
        <div className="flex items-center gap-4">
          <button
            disabled={user && product?.vote?.filter(p => p.uid === user?.uid && p.voteType === 'downvote').length}
            onClick={() => handleVote('downvote', product?.id)}
            className="flex items-center gap-4 py-2 px-4 border border-red rounded transition-transform active:scale-[.98] disabled:bg-red disabled:text-white"
          >
            {product.downvote}
            <div
              className={`w-3 h-3 stroke-2 mt-0.5 -rotate-180 ${
                user && product?.vote?.filter(p => p.uid === user?.uid && p.voteType === 'downvote').length ? 'stroke-white text-white' : 'stroke-red text-red'
              }`}
            >
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
              </svg>
            </div>
          </button>
          <button
            disabled={user && product?.vote?.filter(p => p.uid === user?.uid && p.voteType === 'upvote').length}
            onClick={() => handleVote('upvote', product?.id)}
            className="flex items-center gap-4 py-2 px-4 border border-blue rounded transition-transform active:scale-[.98] disabled:bg-blue disabled:text-white"
          >
            {product.upvote}
            <div
              className={`w-3 h-3 stroke-2 mt-0.5 ${user && product?.vote?.filter(p => p.uid === user?.uid && p.voteType === 'upvote').length ? 'stroke-white text-white' : 'stroke-blue text-blue'}`}
            >
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCards.propTypes = {
  product: object,
  refetch: func,
  isPending: bool,
};
