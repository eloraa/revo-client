import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCards } from '../shared/ProductCards';
import { SearchCards } from '../shared/SearchCards';
import { Helmet } from 'react-helmet-async';
import { Error } from '../shared/Error';

export const Products = () => {
  const [search, setSearchValue] = useState(null);
  const [focus, setFocus] = useState(false);
  const { products: data, setFields, refetch, isError, isPending } = useProducts();
  const { products, setFields: setSearch, refetch: refresh, isError: errors } = useProducts(false, [{ tags: '_' }, { limit: 4 }]);

  const [valid, setValid] = useState(false);

  const handleChange = e => {
    if (e.target.value.trim() !== '') {
      setValid(true);
      refresh();
      setSearch([{ tags: e.target.value.split(',') }, { limit: 4 }]);
    } else {
      setValid(false);
      products.length = 0;
      setSearchValue(e.target?.value.trim() === '' ? null : e.target.value);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSearchValue(e.target.search.value.trim() === '' ? null : e.target.search.value);
    if (!e.target.search.value.trim() === '') e.target.search.blur();
  };

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setFields([{ limit: 20 }, { pagination: true }, { page: search ? 1 : queryParams.get('page') || 1 }, search ? { tags: search.split(',') } : '']);
  }, [setFields, location, search]);

  if (isError || errors) return <Error alt={true}></Error>;
  return (
    <div className="md:px-10 px-5 py-28 relative overflow-hidden">
      <Helmet>
        <title>Products | REVO</title>
      </Helmet>
      <h1 className="text-center font-mono font-bold text-xl">All Products</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex mt-8 items-center relative md:max-w-5xl mx-auto z-20">
          <div className="w-full">
            <input
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 200)}
              onChange={handleChange}
              className="w-full py-4 bg-transparent border-b-2 transition-colors focus:border-red border-red/20 outline-none"
              placeholder="Search"
              type="text"
              name="search"
            />
          </div>
          <button className={`transition-transform text-red stroke-1 stroke-red absolute right-0 ${valid ? 'scale-100' : 'scale-0 pointer-events-none duration-500'}`}>
            <div className="w-5 h-5">
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#arrow-right"></use>
              </svg>
            </div>
          </button>
          <div className={`absolute inset-x-0 top-full bg-pale rounded-b-md border border-red/20 transition-opacity ${focus ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <table className="w-full border-spacing-4 border-separate">
              {products?.map(product => (
                <SearchCards product={product} key={product.id}></SearchCards>
              ))}
            </table>
          </div>
        </div>

        <h4 className="text-sm flex items-center gap-1 mb-16 mt-4 md:max-w-5xl mx-auto">
          <span className="block w-2 h-2 text-red">
            <svg viewBox="0 0 7 7">
              <path
                d="M2.75564 6.90922L2.89768 4.71036L1.05677 5.94332L0.29541 4.60241L2.27836 3.6365L0.29541 2.67059L1.05677 1.32968L2.89768 2.56263L2.75564 0.36377H4.28405L4.13632 2.56263L5.97723 1.32968L6.73859 2.67059L4.76132 3.6365L6.73859 4.60241L5.97723 5.94332L4.13632 4.71036L4.28405 6.90922H2.75564Z"
                fill="currentColor"
              />
            </svg>
          </span>
          You can search with tags and separate them with comma.
        </h4>
      </form>
      <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data?.products?.length ? (
          data?.products?.map(product => <ProductCards isPending={isPending} key={product.id} product={product} refetch={refetch}></ProductCards>)
        ) : (
          <span className="text-red mt-6 font-semibold">No products found.</span>
        )}
      </div>

      {data?.pagination?.totalPages ? (
        <div className="w-full mt-16 grid place-content-center grid-flow-col gap-5">
          {Array.from({ length: data?.pagination?.totalPages }, (_, index) => (
            <div key={index}>
              {index + 1 === data?.pagination?.page ? (
                <div className="font-bold cursor-pointer bg-black py-1 px-3 rounded h-full text-white">{index + 1}</div>
              ) : (
                <Link to={`/products?page=${index + 1}`} className="cursor-pointer block py-1 h-full rounded px-3">
                  {index + 1}
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
