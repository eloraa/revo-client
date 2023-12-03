import toast from 'react-hot-toast';

export const ConfirmToast = (children, color) => {
  return new Promise((resolve, reject) => {
    toast.custom(
      t => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-3xl w-full bg-white rounded pointer-events-auto py-4 px-8 flex items-center justify-between flex-wrap gap-4 border border-red/30`}>
          <div className='font-medium text-sm'>{children}</div>
          <div className="flex items-center">
            <button
              className={`${color ? '' : 'bg-red'} py-2 px-6 rounded font-mono font-semibold text-sm text-white`}
              style={{ backgroundColor: color }}
              onClick={() => {
                resolve();
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className="py-2 px-6 rounded-full font-mono font-semibold text-sm"
              onClick={() => {
                reject();
                toast.dismiss(t.id);
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
};
