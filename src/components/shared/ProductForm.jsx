import { func, object } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSecureAxios } from '../hooks/useSecureAxios';
import { useNavigate } from 'react-router-dom';
import { useUpload } from '../hooks/useUpload';
import { WithContext as ReactTags } from 'react-tag-input';
import { Toast } from '../utils/Toast';
import toast from 'react-hot-toast';
import { validateProduct } from '../utils/utils';
import { saveToStorage } from '../providers/StorageProvider';
import { Spinner } from '../utils/Spinner';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
export const ProductForm = ({ product, refetch }) => {
  const formRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { handleFileSelect, handleImageUpload, removeSelectedImage, setSelectedImage, selectedImage } = useUpload(isUpdating, formRef);
  const [tags, setTags] = useState(product ? product.tags.map(item => ({ id: item, text: item })) : []);
  const { user } = useAuth();
  const secureAxios = useSecureAxios();
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setSelectedImage(product.productPhoto);
      setUploadedImage(product.productPhoto);
    }
  }, [product, setSelectedImage]);

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const saveProduct = async data => {
    try {
      let success;
      if (product) {
        success = { success } = (await secureAxios.patch('/product/update/' + product.id, data)).data;
      } else {
        success = { success } = (await secureAxios.post('/product/add', data)).data;
      }

      if (success) {
        Toast(`Successfully ${product ? 'updated' : 'added'} the product`);
        setIsUpdating(false);
        refetch && refetch();
        navigate('/dashboard/my-products');
      } else {
        Toast('Something went wrong', { isError: true });
        setIsUpdating(false);
      }
    } catch (err) {
      toast.dismiss();
      if (err?.response?.data?.message === 'User is not subscribed and can only add one product') Toast('User is not subscribed and can only add one product', { isError: true });
      else Toast(err.response?.data?.stack?.body[0]?.message || 'something went wrong', { isError: true });
      console.log(err);
      setIsUpdating(false);
    }
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    if (isUpdating) return;

    let toasts;
    const file = e.target?.photo?.files[0];

    if (e.target.photoURL.value && e.target.photoURL.value.trim() !== '' && !/((https?|www):\/\/)[-a-zA-Z0-9+&@#/%=~_|$?!:,.]*[-a-zA-Z0-9+&@#/%=~_|$]/g.test(e.target.photoURL.value)) {
      Toast('Enter a valid URL', { isError: true });
      return;
    } else if (!e.target.photoURL.value && e.target.photoURL.value.trim() === '' && !file) {
      Toast('Upload an image or provide an URL', { isError: true });
      return;
    }

    const data = {
      productName: e.target.productName.value,
      productPhoto: file ? '_' : e.target.photoURL.value.trim() === '' ? '_' : e.target.photoURL?.value,
      description: e.target.description?.value,
      productLink: e.target.productLink?.value,
      tags: tags.map(tag => tag.text),
      email: user?.email,
      uid: user?.uid,
    };

    if (validateProduct(data)) {
      Toast('Check your input data.');
      return;
    }

    // it gives cors error;. will work on later
    if (file) {
      toasts = Toast('Adding the product...');
      if (!file.type.startsWith('image/')) {
        toast.dismiss(toasts);
        setIsUpdating(false);
        Toast('Upload a valid image.');
        return;
      }
      setIsUpdating(true);

      if (uploadedImage) {
        saveProduct({ ...data, productPhoto: uploadedImage });
        return;
      }

      saveToStorage(file, user.uid + '-' + Math.floor(new Date().getTime() / 1000), 'product')
        .then(url => {
          setUploadedImage(url);
          saveProduct({ ...data, productPhoto: url });
        })
        .catch(() => {
          setIsUpdating(false);
          toast.dismiss(toasts);
          Toast('something went wrong');
        });

      return;
    } else {
      saveProduct(data);
    }
  };
  return (
    <div className="mb-20 mt-5 grid md:grid-cols-[auto_1fr] gap-10">
      <div className="flex flex-col gap-1 items-start mb-10">
        {selectedImage && (
          <figure className={`overflow-hidden rounded relative max-w-xs ${selectedImage ? '' : 'md:w-[20rem]'}`}>
            <img className="max-w-xs object-contain rounded max-md:w-full" src={selectedImage ? selectedImage : ''} alt="" />
          </figure>
        )}
        <button onClick={() => handleImageUpload() || setUploadedImage(null)} className="text-sm underline active:scale-[.98] transition-transform">
          {selectedImage ? 'Change the Image' : 'Upload an Image'}
        </button>
      </div>
      <form ref={formRef} onSubmit={handleFormSubmit} className="h-full flex flex-col justify-between">
        <ul className="grid gap-6">
          <li className="hidden">
            <input onChange={handleFileSelect} placeholder="Upload" name="photo" type="file" src="" alt="" accept="image/*" />
          </li>
          <li>
            <h1 className="font-mono font-medium text-lg">Product Info</h1>
          </li>
          <li>
            <h4 className="mb-4 text-sm">Product Name</h4>
            <div className="w-full">
              <input
                defaultValue={product?.productName}
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                type="text"
                name="productName"
                placeholder="Product Name"
              />
            </div>
          </li>
          <li>
            <h4 className="mb-4 text-sm">Image URL</h4>
            <div className="w-full">
              <input
                defaultValue={product?.productPhoto}
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors disabled:border-none"
                type="text"
                name="photoURL"
                placeholder="Image URL"
              />
            </div>
            {selectedImage ? (
              <div className="underline text-red cursor-pointer" onClick={() => removeSelectedImage() || setUploadedImage(null)}>
                Remove the uploaded image
              </div>
            ) : (
              <h4 className="mt-4 text-sm flex items-center gap-1">
                <span className="block w-2 h-2 text-red">
                  <svg viewBox="0 0 7 7">
                    <path
                      d="M2.75564 6.90922L2.89768 4.71036L1.05677 5.94332L0.29541 4.60241L2.27836 3.6365L0.29541 2.67059L1.05677 1.32968L2.89768 2.56263L2.75564 0.36377H4.28405L4.13632 2.56263L5.97723 1.32968L6.73859 2.67059L4.76132 3.6365L6.73859 4.60241L5.97723 5.94332L4.13632 4.71036L4.28405 6.90922H2.75564Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                You can upload your image anywhere and use it here. or you can upload it through our website.
              </h4>
            )}
          </li>
          <li>
            <h4 className="mb-4 text-sm">External Product Link</h4>
            <div className="w-full">
              <input
                defaultValue={product?.productLink}
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                type="text"
                name="productLink"
                placeholder="Product Link"
              />
            </div>
          </li>
          <li>
            <h4 className="mb-4 text-sm">Short Desciption</h4>
            <div className="w-full">
              <textarea
                defaultValue={product?.description}
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors resize-y"
                rows="4"
                type="text"
                name="description"
                placeholder="Short Description"
              />
            </div>
          </li>
          <li>
            <h4 className="mb-4 text-sm">Tags</h4>
            <div className="w-full">
              <ReactTags tags={tags} delimiters={delimiters} handleDelete={handleDelete} handleAddition={handleAddition} handleDrag={handleDrag} inputFieldPosition="bottom" autocomplete />
            </div>
          </li>
          <li>
            <h1 className="font-mono font-medium text-lg">Owner Info</h1>
          </li>

          <li>
            <h4 className="mb-4 text-sm">User Name</h4>
            <div className="w-full">
              <input
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                type="text"
                name="userName"
                placeholder="Name"
                value={user?.displayName || user?.email}
                readOnly
              />
            </div>
            {!user?.displayName && (
              <h4 className="mt-4 text-sm flex items-center gap-1">
                <span className="block w-2 h-2 text-red">
                  <svg viewBox="0 0 7 7">
                    <path
                      d="M2.75564 6.90922L2.89768 4.71036L1.05677 5.94332L0.29541 4.60241L2.27836 3.6365L0.29541 2.67059L1.05677 1.32968L2.89768 2.56263L2.75564 0.36377H4.28405L4.13632 2.56263L5.97723 1.32968L6.73859 2.67059L4.76132 3.6365L6.73859 4.60241L5.97723 5.94332L4.13632 4.71036L4.28405 6.90922H2.75564Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Display Name is empty. Your email address will be used as the name.
              </h4>
            )}
          </li>
          <li>
            <h4 className="mb-4 text-sm">User Email</h4>
            <div className="w-full">
              <input
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                type="email"
                name="userEmail"
                placeholder="Email"
                value={user?.email}
                readOnly
              />
            </div>
          </li>
          <li>
            <h4 className="mb-4 text-sm">User Photo</h4>
            <div className="w-full">
              <input
                className="w-full py-3 outline-none border-b-2 border-red/20 bg-transparent focus:border-red transition-colors"
                type="text"
                name="userPhoto"
                placeholder="User Photo"
                value={user?.photoURL ? user.photoURL : '/assets/images/placeholder/profile.png'}
                readOnly
                hidden
              />
              <figure className="w-16 h-16 rounded overflow-hidden">
                <img src={user?.photoURL ? user.photoURL : '/assets/images/placeholder/profile.png'} alt="" />
              </figure>
            </div>
          </li>
        </ul>

        <button name="submit" className="bg-black py-2 w-full px-0 mt-6 text-white font-bold rounded active:scale-[.99] transition-transform font-mono relative">
          {isUpdating ? (
            <>
              <Spinner></Spinner> <span className="opacity-0 invisible pointer-events-none">Add Product</span>
            </>
          ) : product ? (
            'Update Product'
          ) : (
            'Add Product'
          )}
        </button>
      </form>
    </div>
  );
};

ProductForm.propTypes = {
  product: object,
  refetch: func,
};
