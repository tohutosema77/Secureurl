import * as React from 'react';
import { Link,useLocation } from 'react-router-dom';

interface IHeaderProps {}

// const Header: React.FunctionComponent<IHeaderProps> = () => {
//   return(
//     <div className='bg-slate-900'>

//         <div className='container p-2 mx-auto'>
//             <nav className='py-5'>
//                 <div className="text-base text-white">URLShortner</div>
//             </nav>
//         </div>
//     </div>
//   ) ;
// };

// export default Header;

const Header: React.FunctionComponent<IHeaderProps> = () => {

  //useLocation() is used only to make React re-render the Header when the page route changes, so it reads the updated token from localStorage.->------> so we can see the login or logout after the render happen based on the locaation
  useLocation();  // forces re-render on route change  
  const token= localStorage.getItem("token");
  //Also->useEffect lets React run extra code after rendering a component.

  return(
    <header className='bg-slate-900 shadow-md'>
        {/* <div className='bg-slate-900'> */}
          <div className=' max-w-6xl mx-auto px-4 py-4  flex justify-between items-center'>
            <div className='text-xl font-semibold text-white tracking-wide'>URL Shortner</div>
              <nav className='flex items-center space-x-4'>
                {token ? (
                  <Link to="/logout" className='px-3 py-1 rounded-md text-sm font-medium  text-red-400 hover:text-white  hover:bg-red-500 transition'>
                  Logout
                  </Link>
                ): (
                  <>
                    <Link to="/login" className='px-3 py-1 rounded-md text-sm font-medium text-white hover:bg-slate-700 transition'>
                    Login
                    </Link>

                    <Link to="/register" className='px-3 py-1 rounded-md text-sm font-medium text-white hover:bg-slate-700 transition'>
                    Register
                    </Link>
                  </>
                )}
                
              </nav>
          </div>
        {/* </div> */}
    </header>
    
  ) ;
};

export default Header;
