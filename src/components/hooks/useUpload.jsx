import { useState } from 'react';
import { selectFile } from '../utils/utils';

export const useUpload = (isUpdating, formRef) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageUpload = () => {
    if (isUpdating) return;
    formRef.current.photo.click();
  };

  const handleFileSelect = async e => {
    if (isUpdating) return;
    const file = await selectFile(e);
    if (file) {
      if (formRef.current.photoURL) {
        formRef.current.photoURL.disabled = true;
        formRef.current.photoURL.placeholder = 'Will be selected from the file.';
        formRef.current.photoURL.value = '';
      }
      setSelectedImage(file);
    } else if (formRef.current.photoURL) formRef.current.photoURL.disabled = false;
  };

  const removeSelectedImage = def => {
    if (isUpdating) return;
    if (selectedImage || def) {
      setSelectedImage(def || null);
      formRef.current.photo.value = '';
      if (formRef.current.photoURL) {
        formRef.current.photoURL.disabled = false;
        formRef.current.photoURL.placeholder = 'Photo URL';
        formRef.current.photoURL.value = '';
      }
    }
  };

  return { handleImageUpload, handleFileSelect, removeSelectedImage, setSelectedImage, selectedImage };
};
