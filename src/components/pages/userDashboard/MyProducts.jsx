import { Helmet } from 'react-helmet-async';
import { useUserProduct } from '../../hooks/useUserProduct';
import { ProductTable } from '../../shared/ProductTable';

export const MyProducts = () => {
  const { products, refetch } = useUserProduct();
  return (
    <div className="md:px-10 px-5">
      <Helmet>
        <title>My Products | REVO</title>
      </Helmet>
      <h1 className="flex items-center justify-between">
        <span className="font-mono">Your Products</span>
        <p>
          Total Products: <span className="text-red font-semibold">{products.length}</span>
        </p>
      </h1>

      <main>
        {!products.length ? (
          <h1 className="text-2xl mb-1 mt-8 text-red">There&apos;s no product.</h1>
        ) : (
          <table className="w-full mt-6 mb-16 border-spacing-4 border-separate max-md:flex max-md:flex-col gap-4">
            <thead className="text-left text-sm font-normal mb-2 text-neutral-500 max-md:hidden">
              <tr>
                <th className="font-normal py-4">Name</th>
                <th className="font-normal py-4">Up Votes</th>
                <th className="font-normal py-4">Down Votes</th>
                <th className="font-normal py-4">Status</th>
                <th className="text-right font-normal py-4">Action</th>
              </tr>
            </thead>
            {products?.map(product => (
              <ProductTable refetch={refetch} product={product} key={product.id}></ProductTable>
            ))}
          </table>
        )}
      </main>
    </div>
  );
};
