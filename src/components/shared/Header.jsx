import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { scroll } from '../utils/utils';

export const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [userPanel, setPanel] = useState(false);
  const { user, signOutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === '/contact') {
      setTimeout(() => {
        scroll(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      });
      location.state = '/';
    }
    setNavOpen(false);
    setPanel(false);
  }, [location]);

  const showContact = () => {
    setNavOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: '/contact' });
      return;
    }
    scroll(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
  };
  return (
    <header className={`py-[.85rem] md:px-10 px-5 flex items-center justify-between top-0 z-[999] font-mono ${location.pathname.includes('/dashboard') ? 'relative' : 'sticky'}`}>
      <div className="absolute inset-0 bg-pale -z-10"></div>
      <Link to="/">
        <h1>
          <div className="w-16 text-red">
            <svg viewBox="0 0 29 9">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.599609 0.600098V9H1.7998V5.3999H3.61133L5.39941 7.2002V9H6.59961V6.94824C6.59961 6.9292 6.59082 6.89697 6.57422 6.85107C6.5625 6.81836 6.54688 6.77881 6.52734 6.73193C6.4873 6.62012 6.45605 6.55225 6.43164 6.52832L5.17188 5.26807C5.38184 5.18359 5.57129 5.08594 5.74023 4.9751C5.81934 4.92285 5.89355 4.86816 5.96387 4.81006C6.02734 4.75732 6.08789 4.70166 6.14355 4.64404C6.44727 4.31592 6.59961 3.96826 6.59961 3.6001V2.3999C6.59961 2.21094 6.56934 2.02979 6.50781 1.85645C6.47461 1.76318 6.43262 1.67236 6.38184 1.5835C6.2959 1.43311 6.18457 1.28955 6.04785 1.15234C5.67969 0.78418 5.26367 0.600098 4.7998 0.600098H0.599609ZM7.79492 0.600098V9H13.7949V7.80029H8.99512V5.3999H12.5947V4.2002H8.99512V1.80029H13.7949V0.600098H7.79492ZM14.9902 4.80029V0.600098H16.1904V4.65625L17.7627 7.80029H18.2178L19.79 4.65625V0.600098H20.9902V4.80029C20.9902 4.87988 20.9707 4.96826 20.9307 5.06396L19.1299 8.66406C19.1064 8.72803 19.0264 8.80029 18.8906 8.87988C18.8135 8.92822 18.7461 8.9624 18.6885 8.98145C18.6514 8.99365 18.6182 9 18.5898 9H17.3906C17.3564 9 17.3154 8.99072 17.2676 8.97266C17.2314 8.9585 17.1914 8.93896 17.1475 8.91455L17.0898 8.87988C16.9619 8.80029 16.8867 8.72803 16.8623 8.66406L15.0625 5.06396C15.0146 4.95215 14.9902 4.86426 14.9902 4.80029ZM22.1855 2.3999V7.2002C22.1855 7.66406 22.3652 8.08008 22.7256 8.44824C23.0938 8.81592 23.5137 9 23.9854 9H26.3857C26.8574 9 27.2734 8.81592 27.6338 8.44824C28.002 8.08008 28.1855 7.66406 28.1855 7.2002V2.3999C28.1855 1.93604 28.002 1.52002 27.6338 1.15234C27.2656 0.78418 26.8496 0.600098 26.3857 0.600098H23.9854C23.5293 0.600098 23.1133 0.788086 22.7373 1.16406C22.3691 1.53223 22.1855 1.94434 22.1855 2.3999Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </h1>
      </Link>
      <button onClick={() => setNavOpen(!navOpen)} className="text-white py-1 px-8 block rounded bg-black md:hidden">
        Menu
      </button>
      <ul
        className={`uppercase font-bold flex gap-2 max-md:absolute z-[999999] max-md:flex-col top-full inset-x-0 max-md:px-5 max-md:py-4 max-md:bg-pale transition-transform max-md:-z-20 md:items-center ${
          navOpen ? 'max-md:translate-y-0' : 'max-md:-translate-y-full max-md:pointer-events-none'
        }`}
      >
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-white py-1 px-8 block pointer-events-none rounded bg-black' : 'py-1 px-8 block')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'text-white py-1 px-8 block pointer-events-none rounded bg-black' : 'py-1 px-8 block')}>
            Products
          </NavLink>
        </li>
        <li>
          <button onClick={showContact} className="py-1 px-8 block max-md:w-full text-left">
            Contact
          </button>
        </li>
        {user ? (
          <li className="flex items-center gap-2 flex-wrap relative max-md:-mt-2">
            <div className="flex items-center gap-2 -mr-2">
              <figure onClick={() => setPanel(!userPanel)} className="w-[35px] h-[35px] rounded overflow-hidden cursor-pointer max-md:mt-6 max-md:order-2 max-md:hidden">
                <img src={user.photoURL ? user.photoURL : '/assets/images/placeholder/profile.png'} alt="" />
              </figure>
              <p
                className="max-md:order-2 max-md:mt-6 max-md:hidden whitespace-nowrap transition-[width] overflow-hidden"
                style={{ width: userPanel ? (user?.displayName?.length || user?.email.length) + 'ch' : '0' }}
              >
                {user?.displayName || user?.email}
              </p>
            </div>
            <ul className={`flex items-center gap-2 flex-wrap md:absolute right-0 top-full md:py-6 overflow-hidden ${userPanel ? '' : 'md:pointer-events-none'}`}>
              <figure className="w-[35px] h-[35px] rounded overflow-hidden cursor-pointer max-md:mt-6 max-md:order-2 md:hidden">
                <img src={user.photoURL ? user.photoURL : '/assets/images/placeholder/profile.png'} alt="" />
              </figure>
              <p className="max-md:order-2 max-md:mt-6 md:hidden whitespace-nowrap overflow-hidden text-ellipsis max-w-[40%]">{user?.displayName || user?.email}</p>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'w-full text-white py-1 px-8 block pointer-events-none rounded bg-black'
                      : 'w-full text-black rounded py-1 px-8 block bg-pale md:border-2 md:border-black hover:bg-black hover:text-white'
                  } transition-[background-color,color,transform] md:text-center ${userPanel ? 'md:translate-x-0' : 'md:translate-x-full md:pointer-events-none'}`
                }
                to="/dashboard"
              >
                Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'w-full text-white py-1 px-8 block pointer-events-none rounded bg-black'
                      : 'w-full text-black rounded py-1 px-8 block bg-pale md:border-2 md:border-black hover:bg-black hover:text-white'
                  } md:text-center delay-100 ${userPanel ? 'md:translate-x-0' : 'md:translate-x-full md:pointer-events-none'}`
                }
                to="/dashboard/profile"
              >
                Profile
              </NavLink>
              <button
                onClick={signOutUser}
                className={`text-black rounded py-1 px-8 block bg-pale md:border-2 max-md:bg-black max-md:text-white md:border-black hover:bg-black hover:text-white max-md:order-2 max-md:mt-6 max-md:ml-auto md:w-full transition-[background-color,color,transform] delay-100 ${
                  userPanel ? 'md:translate-x-0' : 'md:translate-x-full md:pointer-events-none'
                }`}
              >
                Signout
              </button>
            </ul>
          </li>
        ) : (
          <li>
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                isActive
                  ? 'text-white py-1 px-8 block pointer-events-none rounded bg-black'
                  : 'text-black py-1 px-8 block bg-pale md:border-2 md:border-black rounded transition-colors hover:bg-black hover:text-white'
              }
            >
              Signin
            </NavLink>
          </li>
        )}
      </ul>
    </header>
  );
};
