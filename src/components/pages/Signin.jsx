import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Toast } from '../utils/Toast';
import { Helmet } from 'react-helmet-async';
import { Spinner } from '../utils/Spinner';

export const Signin = () => {
  const { signIn, user, googleSignin, resetPassword } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    googleSignin()
      .then(() => {
        Toast('Signed in successfully.');
        navigate(location?.state ? location.state : '/');
      })
      .catch(err => {
        if (err.code === 'auth/user-not-found') Toast('The user not found.');
        if (err.code === 'auth/invalid-login-credentials') Toast('Your password or email might be wrong.');
        else Toast('An error occurred. Please try again later.', { isError: true, className: 'font-bold' });
      });
  };

  const handleResetPassword = () => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formRef.current.email.value)) Toast('Enter an Email to the field to reset the password.');
    else
      resetPassword(formRef.current.email.value)
        .then(() => Toast('Check your email to reset your Password.'))
        .catch(err => (err.code === 'auth/too-many-requests' ? Toast('Try verifying after a little while.') : Toast('Something went wrong.')));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    let email,
      password = e.target.password.value;

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.email.value)) email = e.target.email.value;
    else setIsUpdating(false);

    if (email) {
      signIn(email, password)
        .then(() => {
          Toast('Signed in successfully.');
          setIsUpdating(false);
          navigate(location?.state ? location.state : '/');
        })
        .catch(err => {
          setIsUpdating(false);
          if (err.code === 'auth/user-not-found') Toast('The user not found.');
          if (err.code === 'auth/invalid-login-credentials') Toast('Your password or email might be wrong.');
          else Toast('An error occurred. Please try again later.', { isError: true });
        });
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center max-md:pt-20">
      <Helmet>
        <title>Signin | REVO</title>
      </Helmet>
      <div className="flex flex-col justify-center items-center w-full md:px-10 px-5 md:w-[28rem] max-w-md">
        <div className="px-10 py-10 bg-white text-center max-md:w-full w-full">
          <h1 className="font-semibold mb-10 font-mono">Signin to Continue</h1>
          <form ref={formRef} onSubmit={handleFormSubmit} className="mt-6 grid gap-4">
            <div className="w-full">
              <input className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors" type="email" name="email" placeholder="Email" required />
            </div>
            <div className="w-full">
              <input className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors" type="password" name="password" placeholder="Password" required />
            </div>
            <button className="bg-black font-mono w-full relative py-3 text-white font-bold active:scale-[.99] transition-transform text-sm">
              <span className={isUpdating ? 'opacity-0' : ''}>Signin</span>
              {isUpdating && <Spinner></Spinner>}
            </button>

            <div className="mt-6">
              <div className="cursor-pointer text-red font-medium" onClick={handleResetPassword}>
                Reset Password
              </div>
            </div>

            <div>
              <p>
                Don&apos;t have an have an account?{' '}
                <Link className="font-medium text-red" to="/signup">
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
        <button onClick={handleGoogleLogin} className="bg-white py-4 w-full mt-4 flex items-center gap-3 px-10 font-bold font-mono leading-3">
          <div className="w-5 h-5 -mt-0.5 text-red">
            <svg>
              <use xlinkHref="/assets/vector/symbols.svg#google"></use>
            </svg>
          </div>
          Continue with Google
        </button>
      </div>
    </div>
  );
};
