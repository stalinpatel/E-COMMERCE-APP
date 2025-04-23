import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, LogIn, Lock, UserPlus, Factory } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';




const AdminNav = ({ handleLogout }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-pink-500">
        <Link to="/">E-Commerce</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <Link
          to="/secret-dashboard"
          className="text-white hover:text-pink-400"
        >
          <div className='flex '>
            <Lock className='scale-60 ' />
            Dashboard
          </div>
        </Link>
        <Link
          to="/"
          className="text-white hover:text-pink-400"
        >
          Home
        </Link>
        <button onClick={handleLogout} className="bg-pink-500 pl-3 pr-1 py-1 text-xs rounded-lg text-white hover:bg-pink-600 flex items-center">
          Logout
          <LogOut className='scale-80' />
        </button>
      </div>
    </nav>
  );
}

const UserNav = ({ handleLogout, cartItemCount }) => {


  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-pink-500">
        <Link to="/">E-Commerce</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <Link
          to="/cart"
          className="text-white hover:text-pink-400 flex gap-x-1"
        >
          <div className='relative'>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-pink-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            )}
            <ShoppingCart />
          </div>
          Cart
        </Link>

        <Link
          to="/"
          className="text-white hover:text-pink-400"
        >
          Home
        </Link>
        <button onClick={handleLogout} className="bg-pink-500 pl-3 pr-1 py-1 text-xs rounded-lg text-white hover:bg-pink-600 flex items-center">
          Logout
          <LogOut className='scale-80' />
        </button>
      </div>
    </nav>
  );
}

const GuestNav = () => {
  return (
    <nav className="flex justify-between items-center  p-4 bg-slate-900 shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-pink-500">
        <Link to="/">E-Commerce</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-white hover:text-pink-400"
        >
          Home
        </Link>
        <Link to="/signup" className="bg-pink-500 pl-3 pr-1 py-1 text-xs rounded-lg text-white hover:bg-pink-600 flex items-center">
          Sign Up
          <UserPlus className='scale-60' />
        </Link>
        <Link to="/login" className="bg-pink-500 pl-3 pr-1 py-1 text-xs rounded-lg text-white hover:bg-pink-600 flex items-center">
          Login
          <LogIn className='scale-60' />
        </Link>
      </div>
    </nav>
  );
}


const Navbar = () => {
  const { totalItems } = useCartStore();
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const handleLogout = () => {
    console.log('Handle logout clicked ');
    logout();
  }


  return isAdmin
    ? <AdminNav handleLogout={handleLogout} />
    : user
      ? <UserNav handleLogout={handleLogout} cartItemCount={totalItems} />
      : <GuestNav />;
  // if (isAdmin) return AdminNav;
  // else if (user) return UserNav;
  // else return GuestNav;

};

export default Navbar;
