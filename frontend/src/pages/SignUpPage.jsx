import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../components/skeletonsAndLoders/ButtonLoader"


const SignUpPage = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });


  const { signup, loading } = useUserStore()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await signup(formData)

    if (resp?.success) {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="flex pt-10 flex-col items-center min-h-screen bg-slate-950 text-white ">
        <motion.h2
          initial={{ opacity: 0, y: -20 }} // Start state
          animate={{ opacity: 1, y: 0 }} // End state
          transition={{ duration: 0.8, delay: 0.2 }} // Duration of animation
          className="text-3xl font-bold text-center text-pink-500 py-6"
        >
          Create an account
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 2, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96"
        >
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4 relative">
              <label className="block mb-1">Name</label>
              <User className='absolute bottom-2 left-2 opacity-50 scale-80' />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder='John Deo'
                className="pl-9 w-full px-3 py-2 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block mb-1 ">Email</label>
              <Mail className='absolute bottom-2 left-2 opacity-50 scale-80' />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='your@example.com'

                className="w-full pl-9 px-3 py-2 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block mb-1">Password</label>
              <Lock className='absolute bottom-2 left-2 opacity-50 scale-80' />
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder='**********'
                className="w-full px-3 pl-9 py-2 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block mb-1">Confirm Password</label>
              <Lock className='absolute bottom-2 left-2 opacity-50 scale-80' />
              <input
                type="text"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='**********'
                className="w-full px-3 pl-9 py-2 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-3 py-2 rounded-lg text-white flex items-center justify-center gap-x-2
    ${loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"}`}
            >
              {
                loading ? (
                  <ButtonLoader />
                ) : (
                  <div className="flex tems-center justify-center gap-x-2">
                    Sign Up <UserPlus className='scale-80' />
                  </div>
                )
              }

            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account? <Link to="/login" className="text-pink-400 hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SignUpPage;
