import { createContext, useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Banner } from '../shared/Banner';
import { Footer } from '../shared/Footer';
import { Helmet } from 'react-helmet-async';
import { TrendingProduct } from '../shared/TrendingProduct';
import { ProductCards } from '../shared/ProductCards';
import { Error } from '../shared/Error';
import { Coupons } from '../shared/Coupons';

export const ProductContext = createContext();

export const Home = () => {
  const { products, setFields, setSort, refetch, isError, isLoading } = useProducts();
  const [refresh, setRefresh] = useState(() => () => {});

  useEffect(() => {
    setFields([{ featured: true }, { limit: 4 }]);
    setSort('createdAt');
  }, [setFields, setSort]);

  if (isLoading) return <></>;
  if (isError) return <Error alt={true}></Error>;

  return (
    <div>
      <Helmet>
        <title>Home | REVO</title>
      </Helmet>
      <Banner></Banner>
      <ProductContext.Provider value={{ refresh, setRefresh }}>
        <div className="md:px-10 px-5 py-28 bg-white relative overflow-hidden">
          <div className="absolute bg-red -right-[12rem] pointer-events-none top-0 w-1/2 h-16 skew-x-[60deg]"></div>
          <h1 className="text-center font-mono font-bold text-xl">Featured Products</h1>
          <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {products?.length ? (
              products.map(product => <ProductCards key={product.id} product={product} refetch={refetch}></ProductCards>)
            ) : (
              <div className="font-mono text-lg text-red text-center col-span-full">
                <h1 className="py-4 px-8 bg-red/10 rounded inline-block">No Featured Products Found</h1>
              </div>
            )}
          </div>
        </div>

        <TrendingProduct></TrendingProduct>
      </ProductContext.Provider>
      <Coupons></Coupons>

      <Footer></Footer>
    </div>
  );
};
