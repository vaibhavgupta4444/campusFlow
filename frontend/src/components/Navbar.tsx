import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center h-16 px-4 border-b shadow-sm">
        <Link to = '/' className="text-lg font-black cursor-default">CampusFLow</Link>

        <div className="px-2 flex gap-8 items-center font-semibold">
            <Link to = '/signin' className="py-1 px-4 rounded-md hover:bg-gray-100">Sign In</Link>
            <Link to = '/signup' className="bg-black text-white py-1 px-2 rounded-md hover:opacity-85" >Get Started</Link>
        </div>
    </nav>
  )
}

export default Navbar