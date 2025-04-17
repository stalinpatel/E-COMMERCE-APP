import React from 'react';
import { useUserStore } from '../store/useUserStore';

const HomePage = () => {
  const { user } = useUserStore();
  console.log('User Info:', user);

  return (
    <div className='w-screen h-screen mt-36  text-white text-9xl text-center'>
      Homepage
    </div>
  );
};

export default HomePage;