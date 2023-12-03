import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import { addScroll } from '../utils/utils';

export const UserDashboardBar = () => {
  const { userclaims } = useAuth();
  const barRef = useRef(null);

  const elementRef = useRef(null);
  const [isSticky, setSticky] = useState(false);

  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    if (barRef.current) setScroll(addScroll(barRef.current));
  }, []);

  useEffect(() => {
    let element;

    function checkSticky() {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }

    if (elementRef.current) {
      element = elementRef.current;
      window.addEventListener('scroll', checkSticky);

      return () => {
        window.removeEventListener('scroll', checkSticky);
      };
    }
  }, [setSticky]);

  return (
    <>
      <h1 className="text-2xl font-mono mb-10 md:px-10 px-5 mt-10">Dashboard</h1>
      <div ref={elementRef} className="md:px-10 px-5 my-10 bg-pale z-50 sticky top-0">
        <div className="absolute bottom-0 inset-x-0 border-b-2 border-red/20 md:mx-10 mx-5"></div>
        <div className="absolute flex items-center inset-x-0 bottom-0 justify-between md:mx-10 mx-5 z-10 pointer-events-none" style={{ height: scroll, display: scroll ? 'flex' : 'none' }}>
          <button className="bg-gradient-to-r from-pale to-transparent h-full flex items-center justify-center w-8 left transition-opacity opacity-0 pointer-events-none">
            <div className="w-3 h-3 text-red stroke-2 stroke-red mt-0.5 -rotate-90">
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
              </svg>
            </div>
          </button>
          <button className="bg-gradient-to-l from-pale to-transparent h-full flex items-center justify-center w-8 pointer-events-auto right transition-opacity">
            <div className="w-3 h-3 text-red stroke-2 stroke-red mt-0.5 rotate-90">
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
              </svg>
            </div>
          </button>
        </div>
        <ul ref={barRef} className="leading-[1] relative flex gap-10 whitespace-nowrap overflow-x-auto no-scroll">
          <h1 className={`flex items-center transition-[margin] ${isSticky ? 'w-12' : 'w-0 opacity-0 -mx-4'}`}>
            <Link to="/">
              <div className="w-12 min-w-[3rem] text-red">
                <svg viewBox="0 0 29 9">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.599609 0.600098V9H1.7998V5.3999H3.61133L5.39941 7.2002V9H6.59961V6.94824C6.59961 6.9292 6.59082 6.89697 6.57422 6.85107C6.5625 6.81836 6.54688 6.77881 6.52734 6.73193C6.4873 6.62012 6.45605 6.55225 6.43164 6.52832L5.17188 5.26807C5.38184 5.18359 5.57129 5.08594 5.74023 4.9751C5.81934 4.92285 5.89355 4.86816 5.96387 4.81006C6.02734 4.75732 6.08789 4.70166 6.14355 4.64404C6.44727 4.31592 6.59961 3.96826 6.59961 3.6001V2.3999C6.59961 2.21094 6.56934 2.02979 6.50781 1.85645C6.47461 1.76318 6.43262 1.67236 6.38184 1.5835C6.2959 1.43311 6.18457 1.28955 6.04785 1.15234C5.67969 0.78418 5.26367 0.600098 4.7998 0.600098H0.599609ZM7.79492 0.600098V9H13.7949V7.80029H8.99512V5.3999H12.5947V4.2002H8.99512V1.80029H13.7949V0.600098H7.79492ZM14.9902 4.80029V0.600098H16.1904V4.65625L17.7627 7.80029H18.2178L19.79 4.65625V0.600098H20.9902V4.80029C20.9902 4.87988 20.9707 4.96826 20.9307 5.06396L19.1299 8.66406C19.1064 8.72803 19.0264 8.80029 18.8906 8.87988C18.8135 8.92822 18.7461 8.9624 18.6885 8.98145C18.6514 8.99365 18.6182 9 18.5898 9H17.3906C17.3564 9 17.3154 8.99072 17.2676 8.97266C17.2314 8.9585 17.1914 8.93896 17.1475 8.91455L17.0898 8.87988C16.9619 8.80029 16.8867 8.72803 16.8623 8.66406L15.0625 5.06396C15.0146 4.95215 14.9902 4.86426 14.9902 4.80029ZM22.1855 2.3999V7.2002C22.1855 7.66406 22.3652 8.08008 22.7256 8.44824C23.0938 8.81592 23.5137 9 23.9854 9H26.3857C26.8574 9 27.2734 8.81592 27.6338 8.44824C28.002 8.08008 28.1855 7.66406 28.1855 7.2002V2.3999C28.1855 1.93604 28.002 1.52002 27.6338 1.15234C27.2656 0.78418 26.8496 0.600098 26.3857 0.600098H23.9854C23.5293 0.600098 23.1133 0.788086 22.7373 1.16406C22.3691 1.53223 22.1855 1.94434 22.1855 2.3999Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </Link>
          </h1>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive && location.pathname === '/dashboard'
                  ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                  : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
              }
              to="/dashboard"
            >
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                  : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
              }
              to="/dashboard/profile"
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                  : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
              }
              to="/dashboard/add-product"
            >
              Add Product
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                  : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
              }
              to="/dashboard/my-products"
            >
              My Products
            </NavLink>
          </li>
          {(userclaims?.claims?.admin || userclaims?.claims?.moderator) && (
            <>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                      : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
                  }
                  to="/dashboard/queue"
                >
                  Product Review Queue
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                      : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
                  }
                  to="/dashboard/reported"
                >
                  Reported Contents
                </NavLink>
              </li>
            </>
          )}
          {userclaims?.claims?.admin && (
            <>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                      : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
                  }
                  to="/dashboard/manage-users"
                >
                  Manage Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                      : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
                  }
                  to="/dashboard/manage-coupons"
                >
                  Manage Coupons
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'py-4 inline-block border-b-2 border-red pr-1 font-medium text-red transition-colors pointer-events-none'
                      : 'py-4 inline-block border-b-2 border-transparent pr-1 font-medium transition-colors'
                  }
                  to="/dashboard/statistics"
                >
                  Statistics
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};
