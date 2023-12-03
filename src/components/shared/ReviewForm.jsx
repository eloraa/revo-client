import { func, string } from 'prop-types';
import { useState } from 'react';
import { Spinner } from '../utils/Spinner';
import { useAuth } from '../hooks/useAuth';
import { RatingsInput } from '../utils/RatingInput';
import { Toast } from '../utils/Toast';
import toast from 'react-hot-toast';
import { validateProduct } from '../utils/utils';
import { useSecureAxios } from '../hooks/useSecureAxios';

export const ReviewForm = ({ refetch, id }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const secureAxios = useSecureAxios();

  const { user } = useAuth();
  const saveReview = async (data, e) => {
    try {
      const { success } = (await secureAxios.post('/review', data)).data;

      if (success) {
        Toast('Successfully added the review');
        e.target.reset();
        setIsUpdating(false);
        refetch && refetch();
      } else {
        Toast('Something went wrong', { isError: true });
        setIsUpdating(false);
      }
    } catch (err) {
      toast.dismiss();
      Toast((err?.response?.data?.stack?.body && err?.response?.data?.stack?.body[0]?.message) || err?.response?.data?.message || 'something went wrong', { isError: true });
      console.log(err);
      setIsUpdating(false);
    }
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    if (isUpdating) return;

    const data = {
      email: user?.email,
      uid: user?.uid,
      ratings: e.target.rating.value,
      review: e.target.review.value,
      productId: id,
    };

    if (validateProduct(data)) {
      Toast('Check your input data.');
      return;
    }

    Toast('Adding the product...');
    setIsUpdating(true);

    saveReview(data, e);
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="w-full md:max-w-lg py-4 px-6 bg-red/5 rounded-lg mt-4">
        <h1 className="font-mono mb-10 pt-9">Write Your Review</h1>
        <ul className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-8">
            <li>
              <div className="w-full">
                <h4 className="mb-2 text-sm">User Name</h4>
                <input
                  className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                  type="text"
                  name="userName"
                  placeholder="Name"
                  value={user?.displayName || user?.email}
                  readOnly
                />
              </div>
              {!user?.displayName && (
                <h4 className="mt-4 text-sm flex items-center gap-1">
                  <span className="block w-2 h-2 text-red">
                    <svg viewBox="0 0 7 7">
                      <path
                        d="M2.75564 6.90922L2.89768 4.71036L1.05677 5.94332L0.29541 4.60241L2.27836 3.6365L0.29541 2.67059L1.05677 1.32968L2.89768 2.56263L2.75564 0.36377H4.28405L4.13632 2.56263L5.97723 1.32968L6.73859 2.67059L4.76132 3.6365L6.73859 4.60241L5.97723 5.94332L4.13632 4.71036L4.28405 6.90922H2.75564Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  Display Name is empty. Your email address will be used as the name.
                </h4>
              )}
            </li>
            <li>
              <div className="w-full">
                <h4 className="mb-2 text-sm">User Email</h4>
                <input
                  className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                  type="email"
                  name="userEmail"
                  placeholder="Email"
                  value={user?.email}
                  readOnly
                />
              </div>
            </li>
          </div>
          <li>
            <h4 className="mb-4 text-sm">Short Review</h4>
            <div className="w-full">
              <textarea
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors resize-y"
                rows="3"
                type="text"
                name="review"
                placeholder="Short Review"
              />
            </div>
          </li>
          <li>
            <h4 className="mb-2 text-sm">User Photo</h4>
            <div className="w-full">
              <input
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                type="text"
                name="userPhoto"
                placeholder="User Photo"
                value={user?.photoURL ? user.photoURL : '/assets/images/placeholder/profile.png'}
                readOnly
                hidden
              />
              <figure className="w-16 h-16 rounded overflow-hidden">
                <img src={user?.photoURL ? user.photoURL : '/assets/images/placeholder/profile.png'} alt="" />
              </figure>
            </div>
          </li>
          <li>
            <div className="w-full flex items-center gap-4 py-4">
              <RatingsInput className="w-full flex items-center justify-center gap-5"></RatingsInput>
            </div>
          </li>
          <li>
            <div className="w-full">
              <button name="submit" className="bg-black py-2 w-full px-0 mt-6 text-white font-bold rounded active:scale-[.99] transition-transform font-mono relative">
                {isUpdating ? (
                  <>
                    <Spinner></Spinner> <span className="opacity-0 invisible pointer-events-none">Add Review</span>
                  </>
                ) : (
                  'Add Review'
                )}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </form>
  );
};

ReviewForm.propTypes = {
  refetch: func,
  id: string,
};
