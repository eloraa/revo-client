import { useNavigate } from 'react-router-dom';
import { Button } from '../utils/Button';
import { Header } from './Header';
import { bool } from 'prop-types';

export const Error = ({ alt }) => {
  const naviage = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {!alt ? <Header></Header> : <div></div>}
      <div className="text-rose-main font-mono flex justify-center items-center h-full">
        <div>
          <div className="max-w-xs mx-auto">
            <svg viewBox="0 0 65 29">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1602 0.99996L20.7202 0.959961V28.96H15.1202V18.68H6.72023C5.97357 18.68 5.33357 18.4133 4.80023 17.88L1.08023 14.12C0.520234 13.5866 0.240234 12.9466 0.240234 12.2V0.99996H5.84023V11.04L7.92024 13.12H15.1602V0.99996ZM36.2041 1C38.0174 1 39.5641 1.64 40.8441 2.92C42.1241 4.2 42.7641 5.73333 42.7641 7.52V22.48C42.7641 24.2666 42.1241 25.8 40.8441 27.08C39.5641 28.36 38.0307 29 36.2441 29H28.7641C26.9774 29 25.4441 28.36 24.1641 27.08C22.8841 25.8 22.2441 24.2666 22.2441 22.48V7.52C22.2441 5.73333 22.8841 4.2 24.1641 2.92C25.4441 1.64 26.9774 1 28.7641 1H36.2041ZM36.2041 6.6H28.6841C28.4707 6.6 28.2974 6.65333 28.1641 6.76L37.0841 15.72V7.52C37.0841 7.28 37.0041 7.06667 36.8441 6.88C36.6841 6.69334 36.4707 6.6 36.2041 6.6ZM28.6841 23.4H36.1641C36.3774 23.4 36.5507 23.3466 36.6841 23.24L27.7641 14.28V22.48C27.7641 22.72 27.8574 22.9333 28.0441 23.12C28.2307 23.3066 28.4441 23.4 28.6841 23.4ZM64.2359 0.959961L58.6759 0.99996V13.12H51.4359L49.3559 11.04V0.99996H43.7559V12.2C43.7559 12.9466 44.0359 13.5866 44.5959 14.12L48.3159 17.88C48.8492 18.4133 49.4892 18.68 50.2359 18.68H58.6359V28.96H64.2359V0.959961Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <Button className="mx-auto mt-8 font-bold" onClick={() => naviage(-1)}>
            Go back
          </Button>
        </div>
      </div>
      <div></div>
    </div>
  );
};
Error.propTypes = {
  alt: bool,
};
