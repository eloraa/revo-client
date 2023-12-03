import { object } from 'prop-types';
import { Ratings } from '../utils/Ratings';
import moment from 'moment';

export const Review = ({ review }) => {
  return (
    <div className="py-10 px-8 bg-red/10 rounded-lg flex flex-col gap-20">
      <div>
        <div className="flex items-center gap-4">
          <figure className="w-10 h-10 overflow-hidden rounded">
            <img className="object-cover" src={review?.user?.photoURL ? review?.user?.photoURL : '/assets/images/placeholder/profile.png'} alt="" />
          </figure>
          <div>
            <h1>{review?.user?.name}</h1>
            <h1>
              <Ratings className="text-red [&>div>.icon]:w-3 [&>div>.icon]:h-3 gap-2" iconClass="icon" count={parseInt(review?.ratings)}></Ratings>
            </h1>
          </div>
        </div>
        <p className="mt-10 text-[.95rem]">{review.review}</p>
      </div>
      <p className="mt-auto text-xs">{moment(review?.createdAt).fromNow()}</p>
    </div>
  );
};

Review.propTypes = {
  review: object,
};
