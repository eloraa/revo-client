import { useState } from 'react';
import { Spinner } from '../utils/Spinner';
import { useAuth } from '../hooks/useAuth';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Toast } from '../utils/Toast';
import { useSecureAxios } from '../hooks/useSecureAxios';
import { func } from 'prop-types';
import { useCoupons } from '../hooks/useCoupons';
import moment from 'moment';

export const Payment = ({ setPopup }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [paymentFocused, setPaymentFocused] = useState(false);
  const { user, refreshToken } = useAuth();
  const [discount, setDiscout] = useState(0);

  const { coupons } = useCoupons();

  const stripe = useStripe();
  const elements = useElements();
  const secureAxios = useSecureAxios();

  const handleCoupon = e => {
    const coupon = coupons.filter(c => c.code.toLowerCase() === e.target.value.toLowerCase());

    if (moment(coupon[0]?.expires).isBefore()) return setDiscout('expired');

    if (coupon.length) setDiscout(coupon[0].discount);
    else setDiscout(0);
  };

  const handlePayment = async e => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);

    if (e.target.name.value === '' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.email.value)) return;

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log('Stripe.js has not yet loaded.');
      return;
    }

    // const { error, clientSecret } = await createPaymentIntent('card', 'usd', e.target.email.value, event.price * 100);

    const intentData = {
      paymentMethodType: 'card',
      currency: 'usd',
      email: user?.email,
      uid: user?.uid,
      amount: 20 - discount,
    };

    try {
      const { error, clientSecret } = (await secureAxios.post('/payment/create-payment-intent', intentData)).data;
      if (error) {
        Toast(error.message);
        setIsUpdating(false);
        return;
      }
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: e.target.name.value,
            email: user?.email,
          },
        },
      });

      if (stripeError) {
        // Show error to your customer (e.g., insufficient funds)
        Toast(stripeError.message, { isError: true });
        setIsUpdating(false);
        return;
      }

      // Show a success message to your customer
      // There's a risk of the customer closing the window before callback
      // execution. Set up a webhook or plugin to listen for the
      // payment_intent.succeeded event that handles any business critical
      // post-payment actions.
      const { success } = (await secureAxios.post('/payment/add', { uid: user?.uid, email: user?.email, paymentId: paymentIntent.id, name: e.target.name.value, amount: 20 })).data;

      if (success) {
        Toast(`Payment ${paymentIntent.status}`);
        refreshToken(true);
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
        <div>
          Payment -{' '}
          <span className="mt-2 font-semibold text-red">
            Total $
            {discount !== 'expired' && discount ? (
              <span>
                <span className="line-through">
                  <span className="text-neutral-300 px-1">20</span>
                </span>
                <span>{20 - discount}</span>
              </span>
            ) : (
              20
            )}
          </span>
        </div>
        <button className="bg-red/20 py-1 leading-[1] px-2 rounded text-red flex items-center justify-center" onClick={() => setPopup(false)}>
          X
        </button>
      </h1>
      <form onSubmit={handlePayment} className="grid gap-4">
        <div className="w-full">
          <input
            className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors"
            type="text"
            name="name"
            defaultValue={user?.displayName}
            placeholder="Name"
            required
          />
        </div>
        <div className="w-full">
          <input
            className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors"
            type="email"
            name="email"
            value={user?.email}
            readOnly
            placeholder="Email"
            required
          />
        </div>
        <div className="w-full">
          <div className={`w-full py-3 outline-none border-b-2 transition-colors ${paymentFocused ? 'border-red' : 'border-off-white'}`}>
            <CardElement
              onFocus={() => setPaymentFocused(true)}
              onBlur={() => setPaymentFocused(false)}
              style={{ base: { '::placeholder': { fontWeight: 'normal', fontSize: '.975rem' } }, invalid: { iconColor: '#FF1F00' } }}
            ></CardElement>
          </div>
        </div>
        <div className="w-full flex items-center relative">
          <input className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors" type="text" name="coupon" placeholder="Coupon" onChange={handleCoupon} />
          {discount === 'expired' ? (
            <div className="text-xs absolute font-bold right-0 text-red pointer-events-none">Expired</div>
          ) : discount ? (
            <div className="text-xs absolute font-bold right-0 text-blue pointer-events-none">Applied</div>
          ) : (
            ''
          )}
        </div>
        <button className="bg-black rounded font-mono w-full relative py-3 text-white font-bold active:scale-[.99] transition-transform text-sm">
          <span className={isUpdating ? 'opacity-0' : ''}>Payment</span>
          {isUpdating && <Spinner></Spinner>}
        </button>
      </form>
      <h4 className="text-xs mt-8 bg-red/5">
        You can use this example card number: <span className="font-medium">4242 4242 4242 4242</span>
      </h4>
    </div>
  );
};

Payment.propTypes = {
  setPopup: func,
};
