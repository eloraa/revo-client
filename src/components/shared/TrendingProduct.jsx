import { useContext, useEffect } from 'react';
import { ProductCards } from './ProductCards';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { Error } from './Error';
import { ProductContext } from '../pages/Home';

export const TrendingProduct = () => {
  const { products, setFields, setSort, refetch, setDirection, isError, isLoading } = useProducts();

  const { setRefresh } = useContext(ProductContext);

  useEffect(() => {
    setFields([{ limit: 6 }]);
    setRefresh(prevRefetch => {
      if (prevRefetch !== refetch) {
        return refetch;
      }
      return prevRefetch;
    });
    setSort('upvote');
    setDirection('desc');
  }, [setFields, setSort, setDirection, setRefresh, refetch]);

  if (isLoading) return <></>;
  if (isError) return <Error alt={true}></Error>;
  return (
    <div className="md:px-10 px-5 py-28 relative overflow-hidden">
      <div className="absolute bg-white -left-[12rem] pointer-events-none -z-10 top-0 w-1/2 h-16 -skew-x-[60deg]"></div>
      <h1 className="text-center font-mono font-bold text-xl">Trending Products</h1>
      <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {products?.length ? (
          products.map(product => <ProductCards key={product.id} product={product} refetch={refetch}></ProductCards>)
        ) : (
          <div className="font-mono text-lg text-red text-center col-span-full">
            <h1 className="py-4 px-8 bg-red/10 rounded inline-block">No Trending Products Found</h1>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link to="/products">
          <button name="submit" className="bg-black py-2 max-md:w-full px-8 mx-auto mt-6 text-white font-bold rounded active:scale-[.99] transition-transform font-mono">
            Show All Products
          </button>
        </Link>
      </div>
    </div>
  );
};
