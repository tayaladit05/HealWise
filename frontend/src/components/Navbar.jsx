import React, { useContext, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/HealWise.png'
import '../index.css'
import drop from '../assets/drop.svg'
import menu_icon from "../assets/menu_icon.svg"
import cross_icon from "../assets/cross_icon.png"
import { AppContext } from '../context/AppContext'
const Navbar = () => {
 
   const navigate = useNavigate();
  const [showMenu,setShowMenu]=useState(false);
  const [userDropdownOpen,setUserDropdownOpen]=useState(false);
  const dropdownTimer = useRef(null);
   const ADMIN_PANEL_URL=import.meta.env.VITE_ADMIN_URL || '/admin';
  const { token, setToken,userData } = useContext(AppContext);
  
  const goToAdmin=()=>{
    window.location.href = ADMIN_PANEL_URL;
  };
  
  const logout=()=>{
    setToken(false)
    localStorage.removeItem('token')
   }

  return (
    <div className='flex items-center justify-between text-sm py-5 mb-6 border-b border-slate-200'>
  <img onClick={()=>{navigate('/');scrollTo(0,0);}} className="w-28 sm:w-36 md:w-44 max-w-full h-auto object-contain cursor-pointer" src={logo} alt="logo" />
      <ul className='hidden md:flex items-start gap-6 font-medium text-slate-700'>
        <NavLink to="/" className="hover:text-slate-900 transition"><li className='py-1'>HOME</li><hr className='border-none outline-none h-0.5 bg-[#334155] w-3/5 m-auto hidden' /></NavLink>
        <NavLink to="/doctors" className="hover:text-slate-900 transition"><li className='py-1'>ALL DOCTORS</li><hr className='border-none outline-none h-0.5 bg-[#334155] w-3/5 m-auto hidden'/></NavLink>
        <NavLink to="/about" className="hover:text-slate-900 transition"><li className='py-1'>ABOUT</li><hr className='border-none outline-none h-0.5 bg-[#334155] w-3/5 m-auto hidden'/></NavLink>
        <NavLink to="/contact" className="hover:text-slate-900 transition"><li className='py-1'>CONTACT</li><hr className='border-none outline-none h-0.5 bg-[#334155] w-3/5 m-auto hidden'/></NavLink>
        <NavLink to="/symptom-checker" className="hover:text-slate-900 transition"><li className='py-1'>SYMPTOM CHECKER</li><hr className='border-none outline-none h-0.5 bg-[#334155] w-3/5 m-auto hidden'/></NavLink>
        <li
          onClick={goToAdmin}
          className="cursor-pointer select-none rounded-full bg-slate-800 px-4 py-2 text-white shadow-sm hover:bg-slate-700 transition-all duration-200"
        >
          ADMIN PANEL
        </li>
      </ul>
      <div className='flex items-center gap-4'>
        {
            token && userData
            ? <div
                className='flex items-center gap-2 cursor-pointer relative'
                onMouseEnter={() => {
                  if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
                  setUserDropdownOpen(true)
                }}
                onMouseLeave={() => {
                
                  dropdownTimer.current = setTimeout(() => setUserDropdownOpen(false), 120)
                }}
              >
              <img className='w-8 rounded-full' src={userData.image} alt=""/>
              <img className={`w-2.5 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} src={drop} alt=""/>

              <div
                className={`absolute right-0 top-full mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50 transition-all duration-200 ease-out ${userDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <div className="py-1 text-sm">
                  <p
                    onClick={() => navigate('/my-profile')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate('/my-appointments')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logout}
                    className="block px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
        
        :<button
            onClick={()=>navigate('/login')}
            className='hidden md:inline-flex items-center justify-center cursor-pointer select-none rounded-full bg-slate-800 px-7 py-2.5 text-white font-medium shadow-sm hover:bg-slate-700 active:scale-95 transition-all duration-200'
          >Create Account</button>
        }
  <img onClick={()=>setShowMenu(true)} className="w-6 md:hidden" src={menu_icon} alt=""/>

        {/*----Mobile Menu----*/}
        <div
          className={`${showMenu ? 'fixed top-0 right-0 h-full w-64 shadow-lg' : 'fixed top-0 right-0 h-full w-0'} md:hidden z-20 overflow-hidden bg-slate-50 transition-all duration-300`}
          style={{transitionProperty:'width'}}
        >
          <div className='flex items-center justify-between px-5 py-6'>
            <img className="w-36 "src={logo} alt=""/>
            <img className='w-7' onClick={()=>setShowMenu(false)}src={cross_icon} alt=""/>
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium text-slate-700'>
            <NavLink  onClick={()=>setShowMenu(false)} to='/'><p  className='px-4 py-2 rounded inline-block hover:bg-slate-100'>Home</p></NavLink>
            <NavLink  onClick={()=>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block hover:bg-slate-100'>All Doctors</p></NavLink>
            <NavLink  onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block hover:bg-slate-100'>About</p></NavLink>
            <NavLink  onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block hover:bg-slate-100'>Contact</p></NavLink>
            <NavLink onClick={()=>setShowMenu(false)} to='/symptom-checker'><p className='px-4 py-2 rounded inline-block hover:bg-slate-100'>Symptom Checker</p></NavLink>
            <p
              onClick={()=>{setShowMenu(false); goToAdmin();}}
              className="w-full text-center cursor-pointer select-none rounded-xl bg-slate-800 px-5 py-2.5 text-white shadow-sm hover:bg-slate-700 active:scale-95 transition-all duration-150"
            >
              Admin Panel
            </p>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
