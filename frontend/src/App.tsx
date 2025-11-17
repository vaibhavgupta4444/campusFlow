import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import { Toaster } from './components/ui/sonner'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

const App = () => {
  return (
    <div>
      <Navbar />
    
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
   
      <Toaster />
    </div>
  )
}

export default App