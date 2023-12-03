import { Swiper } from 'swiper/react';
import PropTypes, { object } from 'prop-types';
import 'swiper/css';
import { register } from 'swiper/element/bundle';
import { useEffect } from 'react';
import '../../assests/css/slider.css';

export const Slider = ({ children, ...prop }) => {
  useEffect(() => {
    register();
  }, []);
  return (
    <div className="relative h-full w-full">
      {children.length > 1 && <h4 className="text-xs absolute right-5 md:right-10 bottom-10 z-10 text-white font-mono">drag/scroll</h4>}
      <Swiper className="h-full w-full" {...prop}>
        {children}
      </Swiper>
    </div>
  );
};

Slider.propTypes = {
  children: PropTypes.node,
  prop: object,
};
