import { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { Helmet } from 'react-helmet-async';
import { ProductTable } from '../../shared/ProductTable';
import { Error } from '../../shared/Error';

export const ReportedProduct = () => {
  const { products, refetch, setFields, isError, isLoading } = useProducts();

  useEffect(() => {
    setFields([{ reported: '!=0&&>=1' }]);
  }, [setFields]);

  if (isLoading) return <></>;
  if (isError) return <Error alt={true}></Error>;
  return (
    <div className="md:px-10 px-5">
      <Helmet>
        <title>Reported | REVO</title>
      </Helmet>
      <h1 className="flex items-center justify-between">
        <span className="font-mono">Reported Products</span>
        <p>
          Reported Products: <span className="text-red font-semibold">{products.length}</span>
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
                <th className="font-normal py-4">Email</th>
                <th className="font-normal py-4">Date</th>
                <th className="font-normal py-4">Details</th>
                <th className="font-normal py-4">Total Report</th>
                <th className="text-right font-normal py-4">Action</th>
              </tr>
            </thead>
            {products?.map(product => (
              <ProductTable isMod={true} refetch={refetch} product={product} key={product.id}></ProductTable>
            ))}
          </table>
        )}
      </main>
    </div>
  );
};
