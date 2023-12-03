import '../../../assests/css/react-tags.css';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import { ProductForm } from '../../shared/ProductForm';

export const AddProduct = () => {
  const { userclaims } = useAuth();

  return (
    <main className="py-6 md:px-10 px-5">
      <Helmet>
        <title>Add Product | REVO</title>
      </Helmet>
      <div className="flex items-start justify-between mb-16 max-md:flex-col gap-4">
        <h1 className="text-2xl font-mono uppercase">Add Product</h1>
        {!userclaims?.claims?.subscribed && (
          <h4 className="text-sm flex items-center gap-1">
            <span className="block w-2 h-2 text-red">
              <svg viewBox="0 0 7 7">
                <path
                  d="M2.75564 6.90922L2.89768 4.71036L1.05677 5.94332L0.29541 4.60241L2.27836 3.6365L0.29541 2.67059L1.05677 1.32968L2.89768 2.56263L2.75564 0.36377H4.28405L4.13632 2.56263L5.97723 1.32968L6.73859 2.67059L4.76132 3.6365L6.73859 4.60241L5.97723 5.94332L4.13632 4.71036L4.28405 6.90922H2.75564Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            You are not subscribed to our membership. You can only add one product for review.
          </h4>
        )}
      </div>
      <ProductForm></ProductForm>
    </main>
  );
};
