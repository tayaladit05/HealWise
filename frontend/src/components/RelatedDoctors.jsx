import React from 'react'
import { AppContext } from '../context/AppContext'
import { useContext, useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
const RelatedDoctors = ({speciality,docId}) => {

    const {doctors}=useContext(AppContext)
    const[relDoc,setRelDocs]=useState([])
    const navigate=useNavigate();

    useEffect(()=>{
    if(doctors.length>0 && speciality){
        const doctorsData=doctors.filter((doc)=>doc.speciality===speciality && doc._id!==docId)
        setRelDocs(doctorsData)
    }
    },[doctors,speciality,docId])
  return (
    <div className='my-16 flex flex-col items-center gap-4 text-gray-900 md:mx-10'>
    <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
    <p className='text-center text-sm text-slate-600 sm:w-1/3'>Simply browse through our extensive list of trusted doctors.</p>

    <div className='w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
    {relDoc.slice(0,5).map((item,index)=>(
     <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow' key={index}>
      <img className='h-48 w-full bg-slate-50 object-cover' src={item.image} alt=""/>
      <div className='p-4'>
        <div className={`flex items-center gap-2 text-sm ${item.available ?'text-green-600' :'text-gray-500'} `}>
            <span className={`inline-block h-2 w-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'} `}></span>
            <span>{item.available ?'Available' :'Not Available'}</span>
        </div>
        <p className='text-gray-900 text-lg font-medium mt-2'>{item.name}</p>
        <p className='text-gray-600 text-sm'>{item.speciality}</p>
      </div>
     </div>
    ))}
    </div>
    <button onClick={()=>{navigate('/doctors');scrollTo(0,0)}} className='mt-10 rounded-full border border-slate-300 bg-white px-12 py-3 text-slate-700 shadow-sm transition hover:bg-slate-50'>More</button>
    </div>
  )
}

export default RelatedDoctors