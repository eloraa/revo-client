import { useState } from 'react';
import { useNormalAxios } from '../hooks/useNormalAxios';
import { Toast } from '../utils/Toast';

export const Footer = () => {
  const [isSubbed, setIsSubbed] = useState(false);
  const [validMail, setValidMail] = useState(false);

  const handleEmail = e => {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)) setValidMail(true);
    else setValidMail(false);
  };
  const normalAxios = useNormalAxios();

  const handleSubmit = async e => {
    e.preventDefault();

    if (isSubbed) return;

    let email;
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.email.value)) email = e.target.email.value;
    else Toast('Enter a valid Email.');

    if (email) {
      try {
        const { success, errors } = (await normalAxios.post('/newsletter', { email })).data;
        if (success) {
          Toast('Thanks for subscribing to our Newsletter.');
          setIsSubbed(true);
        }
        if (errors) {
          throw errors;
        }
      } catch (err) {
        if (err.response?.data?.errors[0]?.messages[0] === '"email" already exists') {
          Toast('You have already subscribed to our newsletter.');
          setIsSubbed(true);
          return;
        }
        console.log(err);
        Toast('Something went wrong.', { isError: true });
      }
    }
  };
  return (
    <footer className="md:px-10 px-5 contact relative bg-white z-10 pt-14">
      <div className="absolute bg-pale -left-[12rem] pointer-events-none -z-10 top-0 w-1/2 h-16 -skew-x-[60deg]"></div>
      <div className="grid md:grid-cols-2 md:gap-28">
        <div className="pt-14">
          <h1 className="max-w-sm text-2xl md:text-4xl font-mono">Subscribe to our newsletter</h1>
          {isSubbed ? (
            <div className="bg-dark-white rounded mt-8 px-8 py-6 text-blue font-mono">Thanks for subscribing to our newsletter</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex mt-8 items-center relative">
                <div className="w-full">
                  <input
                    onChange={handleEmail}
                    className="w-full py-4 bg-transparent font-mono placeholder:font-mono border-b-2 transition-colors focus:border-red border-red/20 outline-none"
                    placeholder="Email"
                    type="email"
                    name="email"
                  />
                </div>
                <button className={`transition-transform absolute right-0 ${validMail ? 'scale-100' : 'scale-0 pointer-events-none duration-500'}`}>
                  <div className="w-5 h-5">
                    <svg>
                      <use xlinkHref="/assets/vector/symbols.svg#arrow-right"></use>
                    </svg>
                  </div>
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="flex flex-col justify-between max-md:mt-8">
          <div>
            <h1 className="text-4xl text-justify [text-align-last:justify] font-mono">9 Florabunda Cir, Orange City, Florida 32763, USA</h1>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold flex-wrap max-md:mt-8 gap-4">
            <a href="mailto:hello@hotel.com">hello@revo.com</a>
            <ul className="flex items-center gap-5 max-md:justify-between max-md:w-full">
              <li>
                <a href="#">Twitter/X</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between py-6 border-t border-red/20 text-xs sm:text-sm font-mono">
        <div className="flex gap-3">
          <h2>Dhaka, Bangladesh</h2>
          <h2>{new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour12: false, hour: 'numeric', minute: 'numeric' })} - Local Time</h2>
        </div>
        <h2>©2023</h2>
      </div>
    </footer>
  );
};
