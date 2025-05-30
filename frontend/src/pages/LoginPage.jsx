import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader } from "lucide-react"
import { motion } from "framer-motion"
import { useUserStore } from '../store/useUserStore';


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { login, loading } = useUserStore()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData)

    if (res?.success) {
      navigate("/")
    }
  };

  return (
    <>
      <div className="flex pt-20 flex-col items-center min-h-screen bg-slate-950 text-white ">
        <motion.h2
          initial={{ opacity: 0, y: -20 }} // Start state
          animate={{ opacity: 1, y: 0 }} // End state
          transition={{ duration: 0.8, delay: 0.2 }} // Duration of animation
          className=" text-2xl md:text-3xl font-bold text-center text-pink-500 py-6"
        >
          Login to your account
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 2, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-slate-900 p-4 md:p-8 rounded-lg shadow-lg w-[90%]  sm:w-96"
        >
          <form onSubmit={handleSubmit} className="mt-4">

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
                type="password"
                name="password"
                value={formData.password}
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
                  <Loader className='animate-spin' />
                ) : (
                  <div className="flex tems-center justify-center gap-x-2">
                    Log In<ArrowRight className='scale-80' />
                  </div>
                )
              }
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Don't have an account? <Link to="/signup" className="text-pink-400 hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;