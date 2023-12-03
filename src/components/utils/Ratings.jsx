import { number, string } from 'prop-types';

export const Ratings = ({ count, type, className, iconClass }) => {
  if (type === 'diamond')
    return (
      <div className={`flex items-center ${className ? className : 'gap-3'}`}>
        {[...Array(5).keys()].map(index => (
          <div key={index} className={index < count ? 'text-current' : 'text-dark-white'}>
            <div className={`w-5 h-5 ${iconClass}`}>
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#diamond"></use>
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  return (
    <div className={`flex items-center ${className ? className : 'gap-3'}`}>
      {[...Array(5).keys()].map(index => (
        <div key={index} className={index < count ? 'text-current' : 'text-dark-white'}>
          <div className={`w-5 h-5 ${iconClass}`}>
            <svg>
              <use xlinkHref="/assets/vector/symbols.svg#star"></use>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

Ratings.propTypes = {
  count: number,
  type: string,
  iconClass: string,
  className: string,
};
