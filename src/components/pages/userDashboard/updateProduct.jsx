import '../../../assests/css/react-tags.css';
import { Helmet } from 'react-helmet-async';
import { ProductForm } from '../../shared/ProductForm';
import { useProduct } from '../../hooks/useProduct';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Error } from '../../shared/Error';

export const UpdateProduct = () => {
  const params = useParams();
  const { product, refetch } = useProduct(params.id, true);
  const { user } = useAuth();

  return (
    <main className="py-6 md:px-10 px-5">
      {product && product?.user?.email === user?.email ? (
        <>
          <Helmet>
            <title>Update Product - {product?.productName || ''} | REVO</title>
          </Helmet>
          <h1 className="text-2xl font-mono uppercase">Update Product - {product?.productName}</h1>
          <ProductForm refetch={refetch} product={product}></ProductForm>
        </>
      ) : (
        <Error alt={true}></Error>
      )}
    </main>
  );
};
