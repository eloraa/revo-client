import { useRef, useState } from 'react';
import { Spinner } from '../utils/Spinner';
import { useAuth } from '../hooks/useAuth';
import { Toast } from '../utils/Toast';
import { useSecureAxios } from '../hooks/useSecureAxios';
import { func, object } from 'prop-types';
import { validateProduct } from '../utils/utils';

export const CouponForm = ({ coupon, setCoupon, setPopup, refetch }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const secureAxios = useSecureAxios();
  const { user } = useAuth();
  const formRef = useRef();

  const handleForm = async e => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);

    const data = {
      code: e.target.code.value,
      description: e.target.description.value,
      discount: e.target.discount.value,
      accent: e.target.accent.value,
      expires: e.target.expires.value,
    };

    if (validateProduct(data)) {
      Toast('Check your input data.');
      return;
    }

    const userData = {
      email: user?.email,
      uid: user?.uid,
    };
    try {
      let success;

      if (coupon)
        success = { success } = (
          await secureAxios.patch('/coupons/' + coupon.id, data, {
            params: userData,
          })
        ).data;
      else
        success = { success } = (
          await secureAxios.post('/coupons', data, {
            params: userData,
          })
        ).data;

      if (success) {
        Toast(`Successfully ${coupon ? 'updated' : 'added'} the coupon`);
        refetch();
        setCoupon(null);
        e.target.reset();
        setPopup(false);
        setIsUpdating(false);
      } else {
        Toast('Something went wrong', { isError: true });
        setIsUpdating(false);
      }
    } catch (err) {
      console.log(err);
      setIsUpdating(false);
      Toast('Something went wrong', { isError: true });
    }
  };
  return (
    <div className="px-10 pb-11 pt-10 bg-white max-md:w-full w-full md:w-[24rem] max-w-md rounded">
      <h1 className="font-semibold font-mono mb-6 flex items-center justify-between">
        <div>{coupon ? 'Update' : 'Add'} Coupon</div>
        <button
          className="bg-red/20 py-1 leading-[1] px-2 rounded text-red flex items-center justify-center"
          onClick={() => {
            setPopup(false);
            if (coupon) {
              setCoupon(null);
              if (formRef.current) formRef.current.reset();
            }
          }}
        >
          X
        </button>
      </h1>
      <form ref={formRef} onSubmit={handleForm} className="grid gap-4">
        <div className="w-full">
          <input
            defaultValue={coupon?.code}
            className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors"
            type="text"
            name="code"
            placeholder="Coupon Code"
            required
          />
        </div>
        <div className="w-full relative flex items-center">
          <h4 className="font-mono absolute translate-y-[.5px]">$</h4>
          <input
            defaultValue={coupon?.discount}
            className="w-full pl-6 py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors"
            type="number"
            name="discount"
            min="1"
            max="19"
            placeholder="Discount Amount"
            required
          />
        </div>
        <div className="w-full">
          <textarea
            defaultValue={coupon?.description || ''}
            className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors resize-y"
            type="text"
            name="description"
            placeholder="Description"
            required
          ></textarea>
        </div>
        <div className="w-full">
          <input
            defaultValue={coupon ? new Date(coupon?.expires).toISOString().split('T')[0] : undefined}
            className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors"
            min={new Date().toISOString().split('T')[0]} // Set min to current date
            type="date"
            name="expires"
            placeholder="Expiry Date"
            required
          />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors">
            <h4 className="text-sm">Accent Color:</h4>
            <input type="color" name="accent" defaultValue={coupon ? coupon?.accent : '#RRGGBB'} />
          </div>
        </div>
        <button className="bg-black rounded font-mono w-full relative py-3 text-white font-bold active:scale-[.99] transition-transform text-sm">
          <span className={isUpdating ? 'opacity-0' : ''}>Add</span>
          {isUpdating && <Spinner></Spinner>}
        </button>
      </form>
    </div>
  );
};

CouponForm.propTypes = {
  coupon: object,
  setCoupon: func,
  setPopup: func,
  refetch: func,
};
