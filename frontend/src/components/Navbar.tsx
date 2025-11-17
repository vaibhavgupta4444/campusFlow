import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="w-full flex justify-between items-center h-16 px-4 border-b shadow-sm">
        <Link to='/' className="text-lg font-black cursor-pointer hover:opacity-80">
          CampusFlow
        </Link>

        {!isLoggedIn ? (
          <div className="px-2 flex gap-8 items-center font-semibold">
            <Link to='/signin' className="py-1 px-4 rounded-md hover:bg-gray-100 transition-colors">
              Sign In
            </Link>
            <Link to='/signup' className="bg-black text-white py-2 px-4 rounded-md hover:opacity-85 transition-opacity">
              Get Started
            </Link>
          </div>
        ) : (
          <button 
            onClick={logout} 
            className="bg-black text-white hover:opacity-85 px-4 py-2 rounded-md font-semibold transition-opacity"
          >
            Logout
          </button>
        )}
    </nav>
  )
}

export default Navbar