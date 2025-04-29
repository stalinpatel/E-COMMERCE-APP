import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    toast.error("Page Not Found", { id: 2 })
    navigate("/")
  }, [])
  return (
    <div>
      NotFound
    </div>
  );
};

export default NotFound;