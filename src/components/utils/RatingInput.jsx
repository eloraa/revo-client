import { string } from 'prop-types';
import '../../assests/css/rating.css';

export const RatingsInput = ({ className, iconClass }) => {
  return (
    <div className={`rating pointer-events-auto ${className}`}>
      <input type="radio" name="rating" value="1" className={`mask mask-star-2 ${iconClass ? iconClass : 'bg-red'}`} />
      <input type="radio" name="rating" value="2" className={`mask mask-star-2 ${iconClass ? iconClass : 'bg-red'}`} />
      <input type="radio" name="rating" value="3" className={`mask mask-star-2 ${iconClass ? iconClass : 'bg-red'}`} />
      <input type="radio" name="rating" value="4" className={`mask mask-star-2 ${iconClass ? iconClass : 'bg-red'}`} />
      <input defaultChecked type="radio" name="rating" value="5" className={`mask mask-star-2 ${iconClass ? iconClass : 'bg-red'}`} />
    </div>
  );
};

RatingsInput.propTypes = {
  className: string,
  iconClass: string,
};
