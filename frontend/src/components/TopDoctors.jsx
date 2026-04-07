import React,{useContext} from 'react'

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

const navigate=useNavigate();
const {doctors} = useContext(AppContext)

  return (
    <div className='my-16 flex flex-col items-center gap-4 text-gray-900 md:mx-10'>
    <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
    <p className='text-center text-sm text-slate-600 sm:w-1/3'>Simply browse through our extensive list of trusted doctors.</p>

    <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 pt-5 px-3 sm:px-0'>
    {doctors.slice(0,10).map((item,index)=>(
     <div
       onClick={()=>{navigate(`/appointment/${item._id}`); window.scrollTo({top:0, behavior:'smooth'})}}
      className='group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow'
       key={index}
     >
      <img className='bg-slate-50 w-full h-48 object-cover' src={item.image} alt={item.name}/>
      <div className='p-4 flex-1'>
        <div className={`mt-1 flex items-center gap-2 text-sm ${item.available ?'text-green-600' :'text-gray-500'} `}>
            <span className={`inline-block w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'} `}></span>
            <span>{item.available ?'Available' :'Not Available'}</span>
        </div>
        <p className='text-gray-900 text-base md:text-lg font-medium mt-2'>{item.name}</p>
        <p className='text-gray-600 text-sm'>{item.speciality}</p>
      </div>
     </div>
    ))}
    </div>
    <button onClick={()=>{navigate('/doctors'); window.scrollTo({top:0, behavior:'smooth'})}} className='mt-10 rounded-full border border-slate-300 bg-white px-10 py-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50'>More</button>
    </div>
  )
}

export default TopDoctors