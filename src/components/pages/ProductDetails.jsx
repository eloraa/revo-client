import { useProduct } from '../hooks/useProduct';
import { useAuth } from '../hooks/useAuth';
import { useSecureAxios } from '../hooks/useSecureAxios';
import { QueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Toast } from '../utils/Toast';
import { ConfirmToast } from '../utils/ConfirmToast';
import { ReviewForm } from '../shared/ReviewForm';
import { Review } from '../shared/Review';
import { Helmet } from 'react-helmet-async';
import { Error } from '../shared/Error';

export const ProductDetails = () => {
  const params = useParams();
  const query = useMemo(() => {
    return new URLSearchParams(window.location.search);
  }, []);

  const { product, refetch, isError, isLoading } = useProduct(params.id, !!query.get('status'));
  const { user } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = new QueryClient();

  const secureAxios = useSecureAxios();

  if (isLoading) return <></>;
  if (isError) return <Error alt={true}></Error>;

  const handleVote = async (type, id) => {
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

        queryClient.invalidateQueries({ queryKey: ['product'] });
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

  const handleReport = async () => {
    if (isUpdating) return;

    await ConfirmToast(<span>Are you sure you want to report this product?</span>)
      .then(async () => {
        try {
          setIsUpdating(true);
          const { success } = (
            await secureAxios.patch(
              '/product/report/' + product?.id,
              { reported: true },
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
            Toast(`Successfully reported the the product`);
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
    <div className="md:px-10 px-5 py-6">
      <Helmet>
        <title>{product?.productName ? product?.productName : 'Product'} | REVO</title>
      </Helmet>
      {!product ? (
        <Error alt={true}></Error>
      ) : (
        <div>
          <figure className="h-60 md:h-[33rem] rounded-3xl overflow-hidden">
            <img src={product?.productPhoto} alt="" />
          </figure>
          <div className="flex md:items-end justify-between mt-6 max-md:flex-col gap-4">
            <div>
              <h1 className="font-mono text-lg">{product?.productName}</h1>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-neutral-400">By</span>
                <div className="flex items-center gap-2">
                  <figure className="w-6 h-6 rounded overflow-hidden">
                    <img src={product?.user?.photoURL} alt="" />
                  </figure>
                  <h4>{product?.user?.name}</h4>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-4 max-md:w-full justify-between flex-wrap max-md:mt-4">
              <div className="flex items-center gap-2 flex-wrap max-md:w-full">
                {product?.tags?.map(tag => (
                  <span className="bg-black py-1 px-3 text-sm rounded text-white" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button
                  disabled={user && product?.vote?.filter(p => p.uid === user?.uid && p.voteType === 'downvote').length}
                  onClick={() => handleVote('downvote', product?.id)}
                  className="flex items-center gap-4 py-2 px-4 border border-red rounded transition-transform active:scale-[.98] disabled:bg-red disabled:text-white"
                >
                  {product?.downvote}
                  <div
                    className={`w-3 h-3 stroke-2 mt-0.5 rotate-180 ${
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
                  {product?.upvote}
                  <div
                    className={`w-3 h-3 stroke-2 mt-0.5 ${
                      user && product?.vote?.filter(p => p.uid === user?.uid && p.voteType === 'upvote').length ? 'stroke-white text-white' : 'stroke-blue text-blue'
                    }`}
                  >
                    <svg>
                      <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-6">
            <a target="_blank" rel="noreferrer" href={product?.productLink} className="text-blue underline font-semibold flex gap-2 items-center">
              External Link
              <div className="w-3 h-3 stroke-2 mt-1">
                <svg>
                  <use xlinkHref="/assets/vector/symbols.svg#open"></use>
                </svg>
              </div>
            </a>
            <button onClick={handleReport} className="text-red underlinefont-semibold">
              Report Product
            </button>
          </div>

          <div className="mt-10">
            <h1 className="text-sm font-mono mb-2">Description</h1>
            <p>{product?.description}</p>
          </div>

          <div className="mt-10">
            <ReviewForm refetch={refetch} id={product?.id}></ReviewForm>
          </div>

          <div className="mt-10">
            <h1 className="text-sm font-mono mb-2">reviews</h1>
            {product?.review?.length ? (
              <div className="mt-8 grid md:grid-cols-3 xl:grid-cols-4 gap-10">
                {product?.review?.map(review => (
                  <Review key={review?.id} review={review}></Review>
                ))}
              </div>
            ) : (
              <span className="text-red mt-8 font-semibold pb-28">There&apos;s no review.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
