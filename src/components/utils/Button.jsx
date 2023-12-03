import { func, node, string } from 'prop-types';

export const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`text-rose-main text-center bg-pale py-1 px-8 block border-2 border-rose-main transition-[background-color,color,transform] hover:bg-rose-main hover:text-white ${
        className ? className : ''
      }`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: node,
  onClick: func,
  className: string,
};
