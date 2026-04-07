import React from 'react'
import { specialityData } from '../assets/data'
import { Link } from 'react-router-dom'
const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='#speciality'>
        <h1 className='text-3xl font-medium'>Find by Speciality</h1>
      <p className='text-center text-sm text-slate-600 sm:w-1/3'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
         
       <div className='flex w-full gap-4 overflow-x-auto pt-5 sm:justify-center'>
            {specialityData.map((item,index)=>(
          <Link onClick={()=>scrollTo(0,0)} className='flex flex-shrink-0 flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow' key={index} to={`/doctors/${item.speciality}`}>
          <img className='mb-2 w-16 sm:w-20' src={item.image} alt=''/>
          <p className='text-slate-700'>{item.speciality}</p>
                </Link>
            ))}

        </div>
    </div>
  )
}

export default SpecialityMenu