import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCoupons } from '../../hooks/useCoupons';
import { CouponsTable } from '../../shared/CouponsTable';
import { CouponForm } from '../../shared/CouponForm';

export const ManageCoupons = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPopup, setPopup] = useState(false);
  const { coupons, refetch } = useCoupons();
  const [coupon, setCoupon] = useState(null);


  useEffect(() => {
    if (coupon) setPopup(true);
  }, [coupon]);
  return (
    <div className={`md:px-10 px-5 ${isUpdating ? 'pointer-events-none cursor-not-allowed [&*]:cursor-not-allowed' : ''}`}>
      <Helmet>
        <title>Manage Coupons | REVO</title>
      </Helmet>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center transition-opacity ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <CouponForm setCoupon={setCoupon} coupon={coupon} refetch={refetch} setPopup={setPopup}></CouponForm>
      </div>
      <h1 className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-mono">Manage Coupons</span>
          <p className="-mt-1">
            Total Coupons: <span className="text-red font-semibold">{coupons.length}</span>
          </p>
        </div>
        <button onClick={() => setPopup(true)} name="submit" className="bg-black py-2 max-md:w-full px-12 text-white font-bold rounded active:scale-[.99] transition-transform font-mono relative">
          Add Coupon
        </button>
      </h1>

      <main>
        {!coupons.length ? (
          <h1 className="text-2xl mb-1 mt-8 text-red">There&apos;s no coupon.</h1>
        ) : (
          <table className="w-full mt-6 mb-16 border-spacing-4 border-separate max-md:flex max-md:flex-col gap-4">
            <thead className="text-left text-sm font-normal mb-2 text-neutral-500 max-md:hidden">
              <tr>
                <th className="font-normal py-4">Code</th>
                <th className="font-normal py-4">Description</th>
                <th className="font-normal py-4">Discount</th>
                <th className="font-normal py-4">Expires</th>
                <th className="text-right font-normal py-4">Action</th>
              </tr>
            </thead>
            {coupons?.map(coupon => (
              <CouponsTable isUpdating={isUpdating} refetch={refetch} setIsUpdating={setIsUpdating} setCoupon={setCoupon} coupon={coupon} key={coupon.id}></CouponsTable>
            ))}
          </table>
        )}
      </main>
    </div>
  );
};
