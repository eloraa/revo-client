import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { app } from '../utils/firebase.config';
import { useNormalAxios } from '../hooks/useNormalAxios';
import { clearStorage, saveToLocale } from '../utils/localstorage';
import { Toast } from '../utils/Toast';
import { useSecureAxiosAlt } from '../hooks/useSecureAxiosAlt';
import { QueryClient } from '@tanstack/react-query';

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [custom, setuserclaims] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalAxios = useNormalAxios();
  const secureAxios = useSecureAxiosAlt();
  const queryClient = new QueryClient();

  const getToken = user => {
    setLoading(true);
    normalAxios
      .post('/auth/signin', { email: user?.email, uid: user?.uid })
      .then(res => {
        setLoading(false);
        saveToLocale(res.data.token, 'token');
      })
      .catch(() => {
        setLoading(false);
        signOutUser();
        Toast('Something went wrong');
      });
  };
  const saveToCloud = user => {
    normalAxios
      .post('/auth/add-user', { email: user.email, name: user?.displayName || null, uid: user.uid, photoURL: user.photoURL })
      .then(res => {
        setLoading(false);
        saveToLocale(res.data.token, 'token');
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        // saveToCloud(user);
        Toast('Something went wrong');
      });
  };

  const updateCloudUser = user => {
    secureAxios
      .patch('/auth/update-user', { email: user.email, name: user?.displayName || null, uid: user.uid, photoURL: user.photoURL })
      .then(() => setLoading(false))
      .catch(err => {
        console.log(err);
        if (err === 'signout') signOutUser();
        // saveToCloud(user);
        Toast('Something went wrong');
      });
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).then(res => {
      getToken(res.user);
      return res;
    });
  };
  const googleSignin = () => {
    setLoading(true);
    return signInWithPopup(auth, new GoogleAuthProvider()).then(res => {
      const { isNewUser } = getAdditionalUserInfo(res);
      if (isNewUser) {
        saveToCloud(res.user);
      } else {
        getToken(res.user);
      }
      saveToLocale({ email: res.user.email, uid: res.user.uid }, 'user');
    });
  };
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then(res => {
      saveToCloud(res.user);
      saveToLocale({ email: res.user.email, uid: res.user.uid }, 'user');
      return res;
    });
  };

  const signOutUser = () => {
    queryClient.invalidateQueries();
    clearStorage('token');
    clearStorage('user');
    setUser(null);
    setuserclaims(null);
    setLoading(true);
    return signOut(auth);
  };

  const updateUser = (displayName, photoURL) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    }).then(() => {
      updateCloudUser(auth.currentUser);
    });
  };

  const verifyEmail = () => sendEmailVerification(auth.currentUser);
  const resetPassword = email => sendPasswordResetEmail(auth, email);

  const refreshToken = force =>
    auth.currentUser.getIdToken(true).then(() => {
      auth.currentUser?.getIdTokenResult(true).then(res => {
        if (force) setuserclaims({ ...res, claims: { ...res.claims, subscribed: true } });
        else setuserclaims(res);
        setLoading(false);
      });
    });

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        refreshToken();
      } else {
        setLoading(false);
      }
    });
    return () => unSubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userclaims: custom, setuserclaims, signIn, createUser, updateUser, verifyEmail, resetPassword, googleSignin, refreshToken, signOutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
