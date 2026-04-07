import React from 'react'
import About from './pages/About.jsx'
import Appointment from './pages/Appointment.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Doctors from './pages/Doctors.jsx'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SymptomChecker from './pages/SymptomChecker.jsx'


const App = () => {
  return (
    <div className='mx-auto min-h-screen w-full max-w-[1240px] px-4 sm:px-6 lg:px-8'>
      <ToastContainer/>
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/symptom-checker' element={<SymptomChecker/>}/>
      </Routes>

      <Footer/>
      
    </div>
  )
}

export default App
