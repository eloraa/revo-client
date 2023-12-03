import { useState } from 'react';
import { Toast } from '../utils/Toast';
import { Slider } from './Slider';
import { SwiperSlide } from 'swiper/react';
import { useNormalAxios } from '../hooks/useNormalAxios';

export const Banner = () => {
  const [isSubbed, setIsSubbed] = useState(false);
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
    <div className="bg-red text-white">
      <div className="md:px-10 px-5 grid md:grid-cols-2 gap-6 py-20">
        <div className="h-[calc(100vh-15rem)] w-full overflow-hidden rounded bg-rose-main">
          <Slider mousewheel={true} loop={true} autoplay={{ delay: 3000 }}>
            <SwiperSlide>
              <div className="w-full h-full bg-black bg-cover bg-center md:px-10 px-5 flex items-end pb-10" style={{ backgroundImage: 'url(/assets/images/banner/01.jpg)' }}>
                <div className="text-xl md:text-2xl font-mono leading-[1] font-black uppercase text-white heading mix-blend-difference">
                  <h1>Elevate Your</h1>
                  <h1>Tech Experience</h1>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full h-full bg-black bg-cover bg-center md:px-10 px-5 flex items-end pb-10" style={{ backgroundImage: 'url(/assets/images/banner/02.jpg)' }}>
                <div className="text-xl md:text-2xl font-mono leading-[1] font-black uppercase text-white heading">
                  <h1>Innovate Beyond</h1>
                  <h1>Limits</h1>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full h-full bg-black bg-cover bg-top md:px-10 px-5 flex items-end pb-10" style={{ backgroundImage: 'url(/assets/images/banner/03.jpg)' }}>
                <div className="text-xl md:text-2xl font-mono leading-[1] font-black uppercase text-white heading">
                  <h1>Revolutionizing Your</h1>
                  <h1>Digital World</h1>
                </div>
              </div>
            </SwiperSlide>
          </Slider>
        </div>
        <div className="flex items-center justify-between flex-col gap-3">
          <div>
            <h1 className="font-mono font-bold text-2xl text-justify [text-align-last:justify]">Navigating the Tech Universe - Discover, Dive, and Decide on the Coolest Tech Trends!</h1>
            <p className="mt-2 md:mt-6 max-md:mb-8 text-sm text-justify [text-align-last:justify]">
              Submit your product, unlock reviews. Your tech, our insights. Join the community shaping the future of innovation.
            </p>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full relative">
              <div className="w-full">
                <input
                  className="w-full py-4 dark:bg-transparent outline-none border-b-2 border-white placeholder:text-white placeholder:font-mono font-mono"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="w-full mt-6">
                <button className="bg-rose-main w-full py-2.5 font-mono md:px-24 px-0 text-white font-bold rounded active:scale-[.99] transition-transform text-sm">Subscribe</button>
              </div>
              {isSubbed && <div className="absolute inset-0 bg-rose-main font-mono flex justify-center items-center font-bold">Thanks for Subscribing.</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
