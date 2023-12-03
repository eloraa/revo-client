import toast from 'react-hot-toast';

export const Toast = (children, { duration = 2000, isError = false, className = '' } = {}) => {
  return toast.custom(
    t => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'} z-[] max-w-xl w-full bg-white pointer-events-auto py-6 px-8 text-sm font-mono ${isError ? 'text-red' : ''} ${className}`}
        onClick={() => toast.dismiss(t.id)}
      >
        {children}
      </div>
    ),
    {
      id: Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33)).join(''),
      duration: duration,
    }
  );
};
