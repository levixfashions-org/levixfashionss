import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isMobileNavOpen } = useCartStore();

  // Hide on checkout page, product details, or when mobile navigation drawer is open
  if (location.pathname.startsWith('/checkout') || location.pathname.startsWith('/products/') || isMobileNavOpen) {
    return null;
  }

  const isExploreActive = location.pathname.includes('/collections') || location.pathname === '/';
  const isAccountActive = location.pathname.startsWith('/account') || location.pathname === '/login';
  const isSearchActive = location.pathname.startsWith('/search');

  return (
    <nav
      className="new-mob-bottom-main fixed z-40 lg:hidden flex items-center justify-between pointer-events-auto"
      style={{
        bottom: 'calc(10px + env(safe-area-inset-bottom, 8px))',
        left: '5%',
        width: '76%',
        height: '46px',
        flexDirection: 'row-reverse',
        background: 'transparent',
        gap: '2vw'
      }}
      aria-label="Mobile Bottom Navigation"
    >
      {/* 1. Translucent Frosted Glass 3-Icon Pill Dock */}
      <ul
        className="relative grid grid-cols-3 items-center justify-center h-full overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14),inset_0_1px_rgba(255,255,255,0.9),inset_0_-1px_rgba(255,255,255,0.2),inset_0_0_8px_4px_rgba(255,255,255,0.35)]"
        style={{
          width: '84%',
          padding: '4px',
          background: 'rgba(255, 255, 255, 0.28)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.45)'
        }}
      >
        {/* Top/Left Specular Glare Highlights */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)' }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.85), transparent, rgba(255,255,255,0.3))' }}
        />

        {/* Tab 1: Explore Collections (Compass) */}
        <li
          className={`h-full flex items-center justify-center rounded-full transition-all relative ${
            isExploreActive ? 'bg-[#efefef]/90 shadow-sm' : ''
          }`}
        >
          <Link
            to="/collections/all-products"
            className="w-full h-full flex items-center justify-center p-2 text-black hover:opacity-75 transition-opacity"
            aria-label="Explore Catalog"
          >
            <span className="flex items-center justify-center w-full h-full">
              <svg
                className="w-[19px] h-[19px]"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                fill={isExploreActive ? '#000000' : '#4a4a4a'}
                stroke={isExploreActive ? '#000000' : '#4a4a4a'}
                strokeWidth="0.00048"
              >
                <path d="M24,6A18,18,0,1,1,6,24,18.1,18.1,0,0,1,24,6m0-4A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Z" />
                <path d="M33.3,13.3,20,20,13.3,33.3a1.1,1.1,0,0,0,1.4,1.4L28,28l6.7-13.3A1.1,1.1,0,0,0,33.3,13.3ZM24,26a2,2,0,1,1,2-2A2,2,0,0,1,24,26Z" />
              </svg>
            </span>
          </Link>
        </li>

        {/* Tab 2: Profile / Account (Person SVG) */}
        <li
          className={`h-full flex items-center justify-center rounded-full transition-all relative ${
            isAccountActive ? 'bg-[#efefef]/90 shadow-sm' : ''
          }`}
        >
          <Link
            to="/account"
            className="w-full h-full flex items-center justify-center p-2 text-black hover:opacity-75 transition-opacity"
            aria-label="Account"
          >
            <span className="flex items-center justify-center w-full h-full">
              <svg
                className="w-[15px] h-[18px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 19"
                fill={isAccountActive ? '#000000' : '#4a4a4a'}
              >
                <path
                  d="M1806.5-874a8,8,0,0,1,8-8,8,8,0,0,1,8,8Zm3-14a5,5,0,0,1,5-5,5,5,0,0,1,5,5,5,5,0,0,1-5,5A5,5,0,0,1,1809.5-888Z"
                  transform="translate(-1806.5 893)"
                />
              </svg>
            </span>
          </Link>
        </li>

        {/* Tab 3: Search (Magnifying Glass) */}
        <li
          className={`h-full flex items-center justify-center rounded-full transition-all relative ${
            isSearchActive ? 'bg-[#efefef]/90 shadow-sm' : ''
          }`}
        >
          <Link
            to="/search"
            className="w-full h-full flex items-center justify-center p-2 text-black hover:opacity-75 transition-opacity"
            aria-label="Search catalog"
          >
            <span className="flex items-center justify-center w-full h-full">
              <svg
                className="w-[15px] h-[15px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isSearchActive ? '#000000' : '#4a4a4a'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </Link>
        </li>
      </ul>

      {/* 2. Atelier Story Bubble with Cyan/Blue Animated Gradient Ring & Camera Graphic */}
      <div
        className="levix-stories-wrap relative flex items-center justify-center flex-shrink-0 cursor-pointer"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Link
          to="/pages/about"
          className="relative z-10 w-full h-full bg-white rounded-full flex items-center justify-center p-2.5 transition-transform active:scale-95 shadow-sm"
          aria-label="Atelier Stories"
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 21.437 19.03"
            fill="#000000"
          >
            <path
              d="M51.669,81.8a5.889,5.889,0,0,0-.139-.654,4.05,4.05,0,0,0-.288-.713,3.348,3.348,0,0,0-1.412-1.381c-.1-.05-.205-.106-.311-.152a3.276,3.276,0,0,0-.429-.169c-.281-.076-.565-.146-.852-.2-.236-.043-.478-.052-.716-.081a8.827,8.827,0,0,0-2.211.057,4.8,4.8,0,0,0-1.195.3c-.182.074-.363.149-.539.238a3.021,3.021,0,0,0-.675.464c-.1.092-.191.2-.289.292-.019.019-.052.043-.073.038s-.041-.04-.049-.066a.339.339,0,0,1-.009-.1c0-.193.006-.387,0-.58a6.415,6.415,0,0,0-.1-1.308,3.544,3.544,0,0,0-.125-.5c-.054-.144-.1-.293-.166-.43a2.275,2.275,0,0,0-.336-.5,1.976,1.976,0,0,0-.783-.546,2.094,2.094,0,0,0-.687-.155,3.46,3.46,0,0,0-1.274.109,2.276,2.276,0,0,0-.572.282,2.314,2.314,0,0,0-.729.853,3.041,3.041,0,0,0-.28.73.472.472,0,0,1-.159.291.368.368,0,0,1-.045-.095,1.712,1.712,0,0,0-.124-.4,2.536,2.536,0,0,0-.3-.563,1.818,1.818,0,0,0-.6-.554,1.238,1.238,0,0,0-.413-.171,1.688,1.688,0,0,1-.176-.041,2.4,2.4,0,0,0-1.308.082,1.618,1.618,0,0,0-.559.307,2.188,2.188,0,0,0-.632.861,2.766,2.766,0,0,0-.148.437q-.043.181-.084.363c-.024.1-.042.21-.066.314a1.537,1.537,0,0,0-.05.2c-.009.111-.006.223-.007.335v4.061c0,.163,0,.327,0,.49a.132.132,0,0,1-.085.14c-.2.095-.4.191-.592.3a4.243,4.243,0,0,0-.456.31,2.576,2.576,0,0,0-.556.586,5.236,5.236,0,0,0-.283.458,3.27,3.27,0,0,0-.166.375,3.138,3.138,0,0,0-.2.69c-.015.106-.043.21-.066.314a.989.989,0,0,0-.045.2c0,.427,0,.851,0,1.276a.366.366,0,0,0,.02.152,2.045,2.045,0,0,1,.1.438c.046.2.1.4.16.6a4.1,4.1,0,0,0,.176.4,2.8,2.8,0,0,0,.422.658,3.371,3.371,0,0,0,1.3.958c.1.042.2.088.31.123a5.878,5.878,0,0,0,.613.19,8.136,8.136,0,0,0,1.056.158,9.319,9.319,0,0,0,1.711,0,5.19,5.19,0,0,0,.818-.1c.2-.054.409-.095.612-.15.123-.033.245-.076.364-.121a3.28,3.28,0,0,0,.4-.164,4.165,4.165,0,0,0,.536-.327c.175-.13.329-.288.491-.435.038-.035.05-.118.121-.089s.043.095.049.15a.237.237,0,0,1,0,.026c0,.223,0,.447-.005.67a6.789,6.789,0,0,0,.132,1.409.493.493,0,0,0,.028.112c.073.16.1.334.177.5a2.528,2.528,0,0,0,.322.537,1.946,1.946,0,0,0,.721.566,2.351,2.351,0,0,0,.762.213,5.872,5.872,0,0,0,.888,0,2.067,2.067,0,0,0,.607-.16,1.834,1.834,0,0,0,.526-.316,2.471,2.471,0,0,0,.613-.771,2.868,2.868,0,0,0,.277-.73.7.7,0,0,1,.065-.168,1.277,1.277,0,0,1,.095-.139c.026.082.044.132.058.184a1.227,1.227,0,0,0,.041.175,4.534,4.534,0,0,0,.3.611,1.892,1.892,0,0,0,.969.806,2.3,2.3,0,0,0,.592.118,2.445,2.445,0,0,0,1.145-.183,1.867,1.867,0,0,0,.338-.181,1.822,1.822,0,0,0,.433-.419A2.237,2.237,0,0,0,48.927,93a2.407,2.407,0,0,0,.159-.461c.026-.13.06-.258.088-.387.021-.1.039-.193.061-.289a1.385,1.385,0,0,0,.053-.208c.009-.142.007-.284.007-.425V86.87c0-.039,0-.077,0-.116a.107.107,0,0,1,.074-.118c.1-.04.2-.081.294-.13a3.491,3.491,0,0,0,.312-.178c.154-.1.308-.2.455-.312a2.571,2.571,0,0,0,.556-.586,5.231,5.231,0,0,0,.283-.458,4.271,4.271,0,0,0,.364-1.065c.016-.11.046-.218.071-.326a.853.853,0,0,0,.04-.173q0-.651,0-1.3a.855.855,0,0,0-.041-.186C51.692,81.881,51.676,81.84,51.669,81.8ZM33.586,79.909a1.05,1.05,0,0,1,.582-.883,1.715,1.715,0,0,1,.775-.2c.2,0,.4,0,.592,0a1.613,1.613,0,0,1,.469.075,2.009,2.009,0,0,1,.4.14,1.09,1.09,0,0,1,.5.518,1.075,1.075,0,0,1,.091.437q0,.361,0,.722a.49.49,0,0,1-.006.077c-.016.1-.043.123-.145.123l-.747,0h-.812v0H33.75c-.134,0-.169-.027-.17-.166a8.359,8.359,0,0,1,.007-.837Zm5.908,8.058a1.04,1.04,0,0,1-.5.561,2.653,2.653,0,0,1-.419.157.97.97,0,0,1-.137.037c-.139.027-.278.054-.417.076-.114.018-.23.027-.345.046a11.076,11.076,0,0,1-1.517.081c-.275.007-.55,0-.824,0v.012c-.554-.011-1.108-.017-1.662-.034-.227-.007-.453-.039-.679-.062q-.211-.021-.422-.049c-.071-.009-.144-.024-.215-.039a3.377,3.377,0,0,1-.337-.085,1.282,1.282,0,0,1-.75-.528.969.969,0,0,1-.151-.459,1.212,1.212,0,0,1,.122-.636.95.95,0,0,1,.325-.359,2.031,2.031,0,0,1,.674-.27,9.875,9.875,0,0,1,1.827-.2c.924-.026,1.847-.027,2.769.007.308.012.615.067.924.082a3.919,3.919,0,0,1,.848.15,1.283,1.283,0,0,1,.8.524.934.934,0,0,1,.125.294,1.23,1.23,0,0,1-.036.7Zm.376-5.6c-.176,0-.352-.008-.528-.008a1.45,1.45,0,0,1-1.052-.471,1.839,1.839,0,0,1-.471-.8,1.612,1.612,0,0,1-.047-.433c0-.237.012-.473.03-.708a1.389,1.389,0,0,1,.61-1.1,1.706,1.706,0,0,1,.687-.272,3.609,3.609,0,0,1,.831-.082c.162.011.324.035.485.055a1.562,1.562,0,0,1,.177.036,1.3,1.3,0,0,1,.874.619,1.593,1.593,0,0,1,.212.811c0,.159,0,.318,0,.477h.007c0,.215.012.43,0,.644a1.287,1.287,0,0,1-.905,1.138,3.424,3.424,0,0,1-.907.094Zm4.408,7.42c-.014.171-.016.343-.024.515a1.407,1.407,0,0,1-.6,1.155,1.715,1.715,0,0,1-.684.28,3.355,3.355,0,0,1-.921.079,3.732,3.732,0,0,1-.71-.118,1.238,1.238,0,0,1-.685-.476,2.293,2.293,0,0,1-.173-.341,1.867,1.867,0,0,1-.11-.8c0-.279-.015-.559-.006-.838a1.271,1.271,0,0,1,.539-1.022,1.344,1.344,0,0,1,.683-.247c.213-.021.428-.028.643-.041v.012c.142,0,.284,0,.425,0a1.575,1.575,0,0,1,1.384.843,2.66,2.66,0,0,1,.123.24,1.405,1.405,0,0,1,.114.755Zm4.184.657a1.032,1.032,0,0,1-.567.836,1.728,1.728,0,0,1-.812.209c-.159,0-.318-.005-.476,0a2.19,2.19,0,0,1-.77-.132,1.094,1.094,0,0,1-.627-.487.839.839,0,0,1-.139-.41c0-.3-.008-.592-.011-.888a.324.324,0,0,1,.007-.064c.018-.092.045-.114.139-.114h1.558v0H48.31c.123,0,.161.026.163.146a7.7,7.7,0,0,1-.011.9Zm2.468-7.56a1.017,1.017,0,0,1-.479.767,2.967,2.967,0,0,1-.406.191,1.085,1.085,0,0,1-.213.047,10.055,10.055,0,0,1-2.148.216c-.713.007-1.426.007-2.139,0-.343-.006-.685-.046-1.027-.071-.073-.005-.145-.022-.218-.024a3.194,3.194,0,0,1-.86-.15,1.245,1.245,0,0,1-.771-.5,1.044,1.044,0,0,1-.144-.313,1.209,1.209,0,0,1,.033-.7,1.022,1.022,0,0,1,.5-.562,1.13,1.13,0,0,1,.417-.161c.063-.007.123-.038.187-.047.233-.038.467-.068.7-.107a10.8,10.8,0,0,1,1.542-.082c.275-.006.55,0,.824,0v-.017c.627.016,1.254.017,1.88.053.379.022.757.095,1.135.149a1.577,1.577,0,0,1,.287.069,1.294,1.294,0,0,1,.752.525.84.84,0,0,1,.151.445c0,.088.007.179,0,.268Z"
              transform="translate(-30.307 -75.636)"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
};
