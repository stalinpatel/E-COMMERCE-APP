import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CategoryPage from "./pages/CategoryPage";
import NotFound from './pages/NotFound';
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import ToasterComponent from "./components/ToasterComponent"
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./components/PaymentFailedPage";


function App() {

  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
    console.log('User details :', user);

  }, [checkAuth])

  if (checkingAuth) {
    return <LoadingSpinner />
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]">
        </div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]">
        </div>
        <div className="relative z-50 ">
          <ToasterComponent />
          <Navbar />
          <div className="content min-h-screen w-full   mt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
              <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/secret-dashboard" element={user?.role == "admin" && user ? <AdminPage /> : <Navigate to="/login" />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
              <Route path="/payment-success" element={user ? <PaymentSuccessPage /> : <Navigate to="/" />} />
              <Route path="/payment-failed" element={user ? <PaymentFailedPage /> : <Navigate to="/" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
