import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, LogIn, Lock, UserPlus, Factory } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';


const AdminNav = ({ handleLogout, cartItemCount, orders }) => {
  return (
    <nav className="flex justify-between items-center p-3 sm:p-3 md:p-4 bg-slate-900 shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="text-md pl-2 md:pl-0 md:text-xl font-bold text-pink-500">
        <Link to="/" className='salsa-regular '>STYLIK</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-base ">
        <Link
          to="/cart"
          className="text-white hover:text-pink-400 flex md:gap-x-1 items-center justify-center"
        >
          <div className='relative '>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -left-1 z-20 md:-top-4 md:-left-4 bg-pink-400 text-black  font-bold px-1 py-0  rounded-full">
                {cartItemCount}
              </span>
            )}
            <ShoppingCart className='scale-70 md:scale-100' />
          </div>
          Cart
        </Link>
        {
          orders &&
          <Link
            to="/orders"
            className="text-white hover:text-pink-400"
          >
            Orders
          </Link>
        }
        <Link
          to="/secret-dashboard"
          className="text-white hover:text-pink-400 "
        >
          <div className='flex items-center justify-center '>
            <Lock className='scale-50 md:scale-60 -mr-1 text-green-800/ ' />
            <span>Dashboard</span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-white hover:text-pink-400"
        >
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="bg-pink-500  md:pl-3  md:py-1 text-xs rounded-full md:rounded-lg text-white hover:bg-pink-600 flex items-center transition-all duration-75">
          <span className='hidden md:block'>Logout</span>
          <LogOut className='scale-50 md:scale-80' />
        </button>
      </div>
    </nav>
  );
}

const UserNav = ({ handleLogout, cartItemCount, orders }) => {
  return (
    <nav className="flex justify-between items-center p-3 md:p-4 bg-slate-900 shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="text-md pl-2 md:pl-0 md:text-xl font-bold text-pink-500">
        <Link to="/" className='salsa-regular'>STYLIK</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-base ">
        <Link
          to="/cart"
          className="text-white hover:text-pink-400 flex md:gap-x-1 items-center justify-center"
        >
          <div className='relative'>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -left-1 z-20 md:-top-4 md:-left-4 bg-pink-400 text-black  font-bold px-1 py-0  rounded-full">
                {cartItemCount}
              </span>
            )}
            <ShoppingCart className='scale-70 md:scale-100' />
          </div>
          Cart
        </Link>
        {
          orders &&
          <Link
            to="/orders"
            className="text-white hover:text-pink-400 "
          >
            Orders
          </Link>
        }
        <Link
          to="/"
          className="text-white hover:text-pink-400"
        >
          Home
        </Link>
        <button onClick={handleLogout} className="bg-pink-500  md:pl-3  md:py-1 text-xs rounded-full md:rounded-lg text-white hover:bg-pink-600 flex items-center transition-all duration-75">
          <span className='hidden md:block'>Logout</span>
          <LogOut className='scale-50 md:scale-80' />
        </button>
      </div>
    </nav>
  );
}

const GuestNav = () => {
  return (
    <nav className="flex justify-between items-center p-3 md:p-4 bg-slate-900 shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="text-md pl-2 md:pl-0 md:text-xl font-bold text-pink-500">
        <Link to="/" className='salsa-regular'>STYLIK</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-x-1 md:gap-4 text-xs md:text-base ">
        <Link
          to="/"
          className="text-white hover:text-pink-400"
        >
          Home
        </Link>
        <Link to="/signup" className="bg-pink-500 gap-x-1 px-1 text-xs rounded-lg text-white hover:bg-pink-600 flex items-center w-18 md:w-auto justify-center scale-90 md:scale-100 transition-all duration-200">
          <span className='scale-90'>Sign Up</span>
          <UserPlus width={16} />
        </Link>
        <Link to="/login" className="bg-pink-500 gap-x-1 px-1 text-xs rounded-lg text-white hover:bg-pink-600 flex items-center w-18 md:w-auto justify-center scale-90 md:scale-100 transition-all duration-200">
          <span className='scale-90'>Login</span>
          <LogIn width={16} />
        </Link>
      </div>
    </nav>
  );
}


const Navbar = () => {
  const { totalItems } = useCartStore();
  const { user, logout, orders } = useUserStore();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
  }


  return isAdmin
    ? <AdminNav handleLogout={handleLogout} cartItemCount={totalItems} orders={orders} />
    : user
      ? <UserNav handleLogout={handleLogout} cartItemCount={totalItems} orders={orders} />
      : <GuestNav />;
  // if (isAdmin) return AdminNav;
  // else if (user) return UserNav;
  // else return GuestNav;

};

export default Navbar;
