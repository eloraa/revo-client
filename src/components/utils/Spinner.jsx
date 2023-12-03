import PropTypes from 'prop-types';

export const Spinner = ({ className }) => {
  return (
    <div
      className={`absolute w-5 h-5 inset-0 border-t-transparent animate-spin rounded-full ${
        className ? className : 'w-5 h-5 border-[currentColor] border-4 top-[calc(50%-10px)] left-[calc(50%-10px)]'
      }`}
    ></div>
  );
};

Spinner.propTypes = {
  className: PropTypes.string,
};
