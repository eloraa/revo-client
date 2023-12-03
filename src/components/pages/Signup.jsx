import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Toast } from '../utils/Toast';
import { Helmet } from 'react-helmet-async';
import { useUpload } from '../hooks/useUpload';
import { Spinner } from '../utils/Spinner';
import { saveToStorage } from '../providers/StorageProvider';

export const Signup = () => {
  const { createUser, user, googleSignin, updateUser } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [useURL, setUseURL] = useState(false);
  const formRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { handleImageUpload, handleFileSelect, removeSelectedImage, selectedImage } = useUpload(isUpdating, formRef);

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
        else Toast('An error occurred. Please try again later.', { isError: true });
      });
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    let email, password, name, photoURL;

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.email.value)) email = e.target.email.value;
    if (e.target.name.value.length >= 3) name = e.target.name.value;
    else {
      Toast(
        <h4 className="text-sm">
          The name should be at least <strong>3 characters</strong> long.
        </h4>,
        5000
      );
      setIsUpdating(false);
      return;
    }

    if (/^(?=.*[A-Z]).{8,}$/.test(e.target.password.value)) password = e.target.password.value;
    else {
      Toast(
        <h4 className="text-sm">
          The password <strong>should be at least 6 characters</strong> and must contain <strong>a capital letter</strong> and <strong>a special character</strong>.
        </h4>,
        5000
      );
      setIsUpdating(false);
      return;
    }

    if (!useURL && !e.target.photo.files.length) {
      Toast('Select an image', 5000);
      setIsUpdating(false);
      return;
    } else if (useURL) {
      photoURL = e.target.photoURL.value;
      if (photoURL && !/((https?|www):\/\/)[-a-zA-Z0-9+&@#/%=~_|$?!:,.]*[-a-zA-Z0-9+&@#/%=~_|$]/g.test(photoURL)) {
        Toast('Enter a valid URL', { isError: true });
        setIsUpdating(false);
        return;
      }
    }

    if (email && password && name) {
      createUser(email, password, name, photoURL)
        .then(async res => {
          Toast('User Created Successfully');
          if (!useURL && e.target.photo.files.length) {
            try {
              photoURL = await saveToStorage(e.target?.photo?.files[0], res.user.uid, 'profile');
              if (photoURL) updateUser(name, photoURL);
            } catch {
              Toast(<h4 className="text-sm font-bold">We couldn&apos;t upload your photo. Please set it Manually. </h4>, { isError: true });
            }
          } else {
            updateUser(name, photoURL);
          }
        })
        .catch(err => {
          setIsUpdating(false)
          if (err.code === 'auth/email-already-in-use') Toast('This email address is already in use.');
          else Toast('An error occurred. Please try again later.', { isError: true });
        });
    }
  };
  return (
    <div className="md:fixed inset-0 flex items-center justify-center">
      <Helmet>
        <title>Login | REVO</title>
      </Helmet>
      <div className="flex flex-col justify-center items-center w-full md:px-10 px-5 md:w-[28rem] max-w-md max-md:py-16">
        <div className="px-10 py-10 bg-white text-center max-md:w-full w-full">
          <h1 className="font-semibold mb-10 font-mono">Signup for an account</h1>
          <form ref={formRef} onSubmit={handleFormSubmit} className="mt-6 grid gap-4">
            <div className="w-full">
              <input className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors" type="text" name="name" placeholder="Name" required />
            </div>
            <div className="w-full">
              <input className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors" type="email" name="email" placeholder="Email" required />
            </div>
            <div className="w-full">
              <input className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors" type="password" name="password" placeholder="Password" required />
            </div>
            <div className="w-full text-left">
              <input placeholder="Upload" onChange={handleFileSelect} name="photo" type="file" src="" alt="" accept="image/*" hidden />
              {!selectedImage && !useURL ? (
                <div onClick={handleImageUpload} className="py-3 text-sm border-off-white border-b-2 font-semibold flex items-center gap-2 cursor-pointer">
                  <div className="w-5 h-5 mt-0.5 text-red">
                    <svg>
                      <use xlinkHref="/assets/vector/symbols.svg#image"></use>
                    </svg>
                  </div>
                  Upload an image
                </div>
              ) : useURL ? (
                <input className="w-full py-3 outline-none border-b-2 border-off-white focus:border-red transition-colors" type="text" name="photoURL" placeholder="Photo URL" required={useURL} />
              ) : (
                <div>
                  <figure className="w-16 h-16">
                    <img src={selectedImage} alt="" />
                  </figure>
                </div>
              )}
              {selectedImage ? (
                <div onClick={removeSelectedImage} className="text-xs text-red my-3 font-mono underline cursor-pointer">
                  Remove Image
                </div>
              ) : useURL ? (
                <div onClick={() => setUseURL(false)} className="text-xs text-red my-3 font-mono underline cursor-pointer">
                  or upload via website
                </div>
              ) : (
                <div onClick={() => setUseURL(true)} className="text-xs text-red my-3 font-mono underline cursor-pointer">
                  or use an url
                </div>
              )}
            </div>
            <button className="bg-black font-mono w-full relative py-3 text-white font-bold active:scale-[.99] transition-transform text-sm">
              <span className={isUpdating ? 'opacity-0' : ''}>Signup</span>
              {isUpdating && <Spinner></Spinner>}
            </button>

            <div>
              <p>
                Already have an account?{' '}
                <Link className="font-medium text-red" to="/signin">
                  Signin
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
