import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../utils/firebase.config';

let isUploading;

/**
* Saves a file.
*
* @param {File} file - The File blob to save.
* @param {String} uid - The User UID.
* @param {String} type - The type of the file. Example: 'pfp', 'roomsPhoto'.
* @returns {Promise} the URL of the uploaded file.
* @example Example usage - saveToStorage(myFile, 'user123', 'profile')
*/
export const saveToStorage = (file, uid, type) => {
  if (isUploading && !uid && !file && !file.type.startsWith('image/')) {
    return;
  }
  isUploading = true;

  return new Promise((resolve, reject) => {
    const blob = new Blob([file], { type: file.type });
    const storageRef = ref(storage, `/${type}/` + uid);
    uploadBytes(storageRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref)
          .then(url => {
            isUploading = false;
            return resolve(url);
          })
          .catch(() => {
            isUploading = false;
            reject();
          });
      })
      .catch(() => {
        isUploading = false;
        reject();
      });
  });
};
