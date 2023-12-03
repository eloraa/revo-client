import { Grid } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import { Slider } from './Slider';
import { useCoupons } from '../hooks/useCoupons';
import { getShade } from '../utils/utils';
import moment from 'moment';

export const Coupons = () => {
  const { coupons, isLoading } = useCoupons();

  if (isLoading) return <></>;
  return (
    <div className="md:px-10 px-5 py-28">
      <div className="bg-white py-20 rounded-3xl px-8">
        <div className="text-center">
          <h1 className="font-mono font-bold text-xl">Exclusive Coupons</h1>
          <p className="text-sm text-neutral-400 max-w-lg mt-2 mx-auto">
            Unlock savings! Subscribe for exclusive tech deals. Elevate your experience without breaking the bank. Subscribe now for unbeatable offers!
          </p>
        </div>

        <div className="mt-8 overflow-hidden">
          {coupons && coupons.length ? (
            <Slider
              breakpoints={{
                576: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                  grid: {
                    rows: 2,
                    fill: 'row',
                  },
                },
              }}
              freeMode={true}
              grid={{
                rows: 2,
                fill: 'row',
              }}
              spaceBetween={30}
              pagination={{
                type: 'progressbar',
              }}
              modules={[Grid]}
              className="mySwiper"
            >
              {coupons.map(coupon => (
                <SwiperSlide
                  className="w-full h-full bg-red relative after:content-[''] before:content-[''] after:absolute after:top-0 after:-translate-y-2/4 after:bg-amber-50 after:rounded-full after:w-5 after:h-5 after:right-3.5 before:absolute before:bottom-0 before:translate-y-2/4 before:bg-amber-50 before:rounded-full before:w-5 before:h-5 before:right-3.5 rounded-l-lg rounded-r"
                  style={{ backgroundColor: coupon.accent, color: getShade(coupon.accent) }}
                  key={coupon.id}
                >
                  <div className="absolute right-14 border-dashed border-white inset-y-0 border-l-2"></div>
                  <div className="flex items-center relative pt-10 pb-8 px-10 pr-16 h-full">
                    <h2 className="absolute right-4 font-bold rotate-90 mt-2">${coupon.discount}</h2>
                    <div className="flex flex-col h-full">
                      <h1 className="font-mono font-bold">{coupon.code}</h1>
                      <p className="mt-2 text-sm mb-8">{coupon.description}</p>
                      <p className="text-xs mt-auto">Expires {moment(coupon.expires).fromNow()}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Slider>
          ) : (
            <div className="font-mono text-lg text-red text-center col-span-full">
              <h1 className="py-4 px-8 bg-red/10 rounded inline-block">No Coupons Found</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
