import moment from 'moment';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';

export const SearchCards = ({ product }) => {
  return (
    <tbody className="border border-red/10 text-sm">
      <tr className="outline outline-1 outline-red/10 max-md:flex max-md:flex-wrap max-md:px-4">
        <td className="py-4 font-semibold max-md:w-full max-md:pt-6">
          <Link to={'/product/' + product.id}>{product?.productName}</Link>
        </td>
        <td className="py-4 max-md:w-1/2 max-md:py-2 capitalize">
          <div className="flex items-center gap-4">
            {product.upvote}
            <div className="w-3 h-3 text-blue stroke-2 stroke-blue mt-0.5">
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
              </svg>
            </div>
          </div>
        </td>
        <td className="py-4 max-md:w-1/2 max-md:py-2 capitalize">
          <div className="flex items-center max-md:justify-end gap-4">
            {product.downvote}
            <div className="w-3 h-3 text-red stroke-2 stroke-red rotate-180 mt-0.5">
              <svg>
                <use xlinkHref="/assets/vector/symbols.svg#arrow-top"></use>
              </svg>
            </div>
          </div>
        </td>
        <td className="py-4 max-md:w-1/2 max-md:pt-6 capitalize">
          <div className="flex items-center gap-2">
            <figure className="w-6 h-6 rounded overflow-hidden">
              <img src={product?.user?.photoURL} alt="" />
            </figure>
            <h4>{product?.user?.name}</h4>
          </div>
        </td>
        <td className="text-right py-4 max-md:w-1/2 max-md:pt-6 max-md:text-center">{moment(product?.createdAt).fromNow()}</td>
      </tr>
    </tbody>
  );
};
SearchCards.propTypes = {
  product: object,
};
