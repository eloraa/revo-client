import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { saveToStorage } from '../../providers/StorageProvider';
import { Toast } from '../../utils/Toast';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { Spinner } from '../../utils/Spinner';
import { useUpload } from '../../hooks/useUpload';
import { Payment } from '../../shared/Payment';

export const Profile = () => {
  const formRef = useRef(null);
  const [editState, setEditState] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPopup, setPopup] = useState(false);
  const { user, userclaims, updateUser, verifyEmail } = useContext(AuthContext);
  const [displayNameValue, setdisplayNameValue] = useState(user?.displayName ? user?.displayName : '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL ? user?.photoURL : '');

  const navigate = useNavigate();

  const { handleFileSelect, handleImageUpload, removeSelectedImage, selectedImage } = useUpload(isUpdating, formRef);

  let isVerifying;
  const handleFormSubmit = e => {
    let toasts;
    e.preventDefault();
    if (isUpdating) return;
    let name, photoURL;
    name = e.target.displayName.value || null;
    photoURL = e.target.photoURL.value || null;

    if (name && name.length > 30) {
      Toast('Name cannot exceeds 30 characters');
      return;
    }

    if (photoURL && !/((https?|www):\/\/)[-a-zA-Z0-9+&@#/%=~_|$?!:,.]*[-a-zA-Z0-9+&@#/%=~_|$]/g.test(photoURL)) {
      Toast('Enter a valid URL');
      return;
    }

    // it gives cors error;. will work on later
    const file = e.target?.photo?.files[0];
    if (file) {
      toasts = Toast('Updating profile...');
      if (!file.type.startsWith('image/')) {
        toast.dismiss(toasts);
        Toast('Upload a valid image.');
        return;
      }
      setIsUpdating(true);

      saveToStorage(file, user.uid, 'profile')
        .then(url => {
          updateUser(name, url)
            .then(() => {
              toast.dismiss(toasts);
              Toast('User Updated Successfully');
              navigate('/');
            })
            .catch(() => {
              setIsUpdating(false);
              toast.dismiss(toasts);
              Toast('Something went wrong');
            });
        })
        .catch(() => {
          setIsUpdating(false);
          toast.dismiss(toasts);
          Toast('something went wrong');
        });

      return;
    } else if (selectedImage) {
      toasts = Toast('Updating profile...');
      setIsUpdating(true);
      if (name === null) name = '';
      updateUser(name, selectedImage)
        .then(() => {
          toast.dismiss(toasts);
          Toast('User Updated Successfully');
          navigate('/');
        })
        .catch(() => {
          setIsUpdating(false);
          toast.dismiss(toasts);
          Toast('Something went wrong');
        });
      return;
    } else {
      if (name !== user.displayName || photoURL !== user.photoURL) {
        toasts = Toast('Updating profile...');
        setIsUpdating(true);
        if (name === null) name = '';
        if (photoURL === null) photoURL = '';
        updateUser(name, photoURL)
          .then(() => {
            toast.dismiss(toasts);
            Toast('User Updated Successfully');
            navigate('/');
          })
          .catch(() => {
            setIsUpdating(false);
            toast.dismiss(toasts);
            Toast('Something went wrong');
          });
        return;
      }
      toast.dismiss(toasts);
      toasts = Toast('Nothing to update.');
    }
  };

  return (
    <main className="py-6 md:px-10 px-5 animate-dissolve-in">
      <Helmet>
        <title>Profile | REVO</title>
      </Helmet>

      {!userclaims?.claims?.subscribed && (
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center transition-opacity ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Payment setPopup={setPopup}></Payment>
        </div>
      )}

      <div className="flex justify-between items-center mb-16">
        <h1 className="font-semibold text-xl font-mono">{editState && 'Update '}Your Profile</h1>
        <button
          onClick={() => {
            if (isUpdating) return;
            setEditState(!editState);
            setdisplayNameValue(user?.displayName ? user?.displayName : '');
            setPhotoURL(user?.photoURL ? user?.photoURL : '');
            removeSelectedImage();
            formRef.current.photo.value = '';
          }}
          className="active:scale-[.99] transition-transform underline font-mono text-sm"
        >
          {editState ? 'Discard Editing' : 'Edit Profile'}
        </button>
      </div>

      {!user.emailVerified && (
        <div className="bg-red/10 py-6 rounded-md px-8 font-semibold flex justify-between items-center">
          <h1>Your Account Isn&apos;t verified.</h1>
          <button
            onClick={() => {
              if (isUpdating) return;
              if (isVerifying) Toast('Check your email to verify your Account');
              verifyEmail()
                .then(() => {
                  isVerifying = true;
                  Toast('Check your email to verify your Account');
                })
                .catch(err => {
                  isVerifying = false;
                  err.code === 'auth/too-many-requests' ? Toast('Try verifying after a little while.') : Toast('Something went wrong.');
                });
            }}
            className="underline active:scale-[.98] transition-transform text-sm"
          >
            Verify
          </button>
        </div>
      )}

      {!user?.displayName?.length && (
        <div className="py-4 px-6 bg-red/10 mt-4 text-xs font-medium text-red rounded-lg flex items-center gap-2">
          <div className="w-4 h-4">
            <svg>
              <use xlinkHref="/assets/vector/symbols.svg#info"></use>
            </svg>
          </div>
          Display Name is empty. Your email address will be used as the name.
        </div>
      )}

      <div className="mb-20 mt-8">
        <div className="flex flex-col gap-1 items-start mb-10">
          <div className="flex md:items-end max-md:flex-col-reverse md:gap-10 gap-4 w-full">
            <div>
              {user?.displayName && (
                <h1 className="mb-5">
                  Hi, <span className="font-semibold">{user?.displayName}</span>
                </h1>
              )}
              <figure className="overflow-hidden rounded relative max-w-xs min-h-[2rem] min-w-[2rem]">
                {editState && (
                  <div onClick={handleImageUpload} className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg cursor-pointer">
                    Edit
                  </div>
                )}
                <img
                  onLoad={() => {
                    if (user.photoURL !== selectedImage) formRef.current.photoURL.disabled = true;
                  }}
                  className="max-w-xs object-contain rounded max-md:w-full"
                  src={selectedImage ? selectedImage : user?.photoURL ? user.photoURL : '/assets/images/placeholder/profile.png'}
                  alt=""
                />
              </figure>
            </div>
            {userclaims?.claims?.subscribed ? (
              <div className="py-4 px-6 rounded-lg bg-blue/5 text-sm flex items-center gap-2 max-md:w-full">
                <div className="w-5">
                  <img src="/assets/vector/people.svg" alt="" />
                </div>
                Membership Vefied
              </div>
            ) : (
              <div className="py-8 px-6 rounded-lg bg-blue/5 text-sm max-md:w-full text-center">
                <div className="w-20 h-20 mx-auto p-5 rounded-full bg-red/5">
                  <img src="/assets/vector/people.svg" alt="" />
                </div>
                <p className="md:max-w-[200px] mx-auto mt-4">Subscribe to our membership to get extended product reviews.</p>
                <button onClick={() => setPopup(true)} className="bg-black w-full py-2 px-3 rounded text-white font-mono mt-8">
                  $20 - Subscribe
                </button>
              </div>
            )}
          </div>
          {editState && user.providerData[0].photoURL && user.photoURL !== user.providerData[0].photoURL && selectedImage !== user.providerData[0].photoURL && (
            <button onClick={() => removeSelectedImage(user.providerData[0].photoURL)} className="text-sm underline active:scale-[.98] transition-transform">
              Restore Default Profile Picture
            </button>
          )}
        </div>
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <ul className="grid gap-6">
            <li className="hidden">
              <input onChange={handleFileSelect} placeholder="Upload" name="photo" type="file" src="" alt="" accept="image/*" />
            </li>
            <li>
              <h4>Name</h4>
              <div className="md:w-80 w-full">
                <input
                  className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors disabled:border-none"
                  type="text"
                  name="displayName"
                  placeholder="Display Name"
                  value={displayNameValue}
                  onChange={e => setdisplayNameValue(e.target.value)}
                  disabled={!editState}
                />
              </div>
            </li>
            <li>
              <h4>Email</h4>
              <h2 className="font-medium py-4">{user?.email}</h2>
            </li>
            <li>
              <h4>Photo URL</h4>
              <div className="md:w-80 w-full">
                <input
                  className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors disabled:border-none"
                  type="text"
                  name="photoURL"
                  placeholder="Photo URL"
                  value={photoURL}
                  onChange={e => setPhotoURL(e.target.value)}
                  disabled={!editState}
                />
              </div>
            </li>
          </ul>

          {editState && (
            <button name="submit" className="bg-black relative font-mono py-2 md:px-24 w-full md:w-auto px-0 mt-6 text-white font-bold">
              <span className={isUpdating ? 'opacity-0' : ''}>Update</span>
              {isUpdating && <Spinner></Spinner>}
            </button>
          )}
        </form>
        {editState && (
          <h4 className="mt-8 text-sm flex items-center gap-1">
            <span className="block w-2 h-2">
              <svg viewBox="0 0 7 7">
                <path
                  d="M2.75564 6.90922L2.89768 4.71036L1.05677 5.94332L0.29541 4.60241L2.27836 3.6365L0.29541 2.67059L1.05677 1.32968L2.89768 2.56263L2.75564 0.36377H4.28405L4.13632 2.56263L5.97723 1.32968L6.73859 2.67059L4.76132 3.6365L6.73859 4.60241L5.97723 5.94332L4.13632 4.71036L4.28405 6.90922H2.75564Z"
                  fill="currentColor"
                />
              </svg>
            </span>{' '}
            You can add Empty value to remove name and photo
          </h4>
        )}
      </div>
    </main>
  );
};
