import Login from './pages/Login.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  useContext } from 'react';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorsList from './pages/Admin/DoctorsList.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';

const App = () => {

  const{aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)
  return aToken || dToken?(
    <div className='min-h-screen bg-linear-to-b from-[#f6fbfa] to-[#f4f7f8]'>
      
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/*Admin Route*/}
          <Route path='/' element={ aToken
      ? <Navigate to='/admin-dashboard' replace />
      : <Navigate to='/doctor-dashboard' replace />
  }/>
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctor-list' element={<DoctorsList/>} />

          {/*Doctor Route*/}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
          <Route path='/doctor-profile' element={<DoctorProfile/>} />

        </Routes>
      </div>
    </div>
  ) :(
    <>
    <Login/>
      <ToastContainer/>
    </>
  )
}

export default App