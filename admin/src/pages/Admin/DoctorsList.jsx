import React, { useContext, useEffect, useState } from 'react'

import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailablity, updateDoctor, deleteDoctor } = useContext(AdminContext)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
   if(aToken)
   {
     getAllDoctors()
   }
  },[aToken])

  const openEdit = (doctor) => {
    setEditingDoctor({
      doctorId: doctor._id,
      name: doctor.name || '',
      speciality: doctor.speciality || 'General physician',
      experience: doctor.experience || '1 Year',
      fees: doctor.fees || '',
      about: doctor.about || '',
      address1: doctor.address?.line1 || '',
      address2: doctor.address?.line2 || '',
      available: Boolean(doctor.available),
      image: null,
      preview: doctor.image || ''
    })
  }

  const onSave = async (e) => {
    e.preventDefault()
    if (!editingDoctor) return

    setSaving(true)
    const result = await updateDoctor(editingDoctor)
    setSaving(false)

    if (result.success) {
      setEditingDoctor(null)
    }
  }

  const onDelete = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return
    await deleteDoctor(doctorId)
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
          <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer grow' key={index}>
          <img className='bg-indigo-50 group-hover:bg-[#0F766E] transiton-all duration-500' src={item.image} alt='' onError={(e)=>{e.currentTarget.src='https://via.placeholder.com/300x200?text=Doctor+Image'}}/>
          <div className='p-4'>
          <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
          <p className='text-zinc-600 text-sm'>{item.speciality}</p>
          <div className='mt-2 flex items-center gap-1 text-sm'>
            <input onChange={()=>changeAvailablity(item._id)}  type="checkbox" checked={item.available}/>
            <p>Availbale</p>
          </div>
          <div className='mt-3 flex gap-2'>
            <button type='button' onClick={() => openEdit(item)} className='text-xs bg-[#0F766E] text-white px-3 py-1 rounded'>Edit</button>
            <button type='button' onClick={() => onDelete(item._id)} className='text-xs bg-red-600 text-white px-3 py-1 rounded'>Delete</button>
          </div>
          </div>

          </div>
          ))
        }
      </div>

      {editingDoctor && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <form onSubmit={onSave} className='w-full max-w-2xl bg-white rounded-xl p-5 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold'>Edit Doctor</h2>
              <button type='button' onClick={() => setEditingDoctor(null)} className='text-sm text-gray-600'>Close</button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <input className='border rounded px-3 py-2' value={editingDoctor.name} onChange={(e)=>setEditingDoctor(prev=>({...prev,name:e.target.value}))} placeholder='Name' required />
              <select className='border rounded px-3 py-2' value={editingDoctor.speciality} onChange={(e)=>setEditingDoctor(prev=>({...prev,speciality:e.target.value}))}>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
              <input className='border rounded px-3 py-2' value={editingDoctor.experience} onChange={(e)=>setEditingDoctor(prev=>({...prev,experience:e.target.value}))} placeholder='Experience' required />
              <input className='border rounded px-3 py-2' type='number' value={editingDoctor.fees} onChange={(e)=>setEditingDoctor(prev=>({...prev,fees:e.target.value}))} placeholder='Fees' required />
              <input className='border rounded px-3 py-2' value={editingDoctor.address1} onChange={(e)=>setEditingDoctor(prev=>({...prev,address1:e.target.value}))} placeholder='Address line 1' required />
              <input className='border rounded px-3 py-2' value={editingDoctor.address2} onChange={(e)=>setEditingDoctor(prev=>({...prev,address2:e.target.value}))} placeholder='Address line 2' required />
              <label className='flex items-center gap-2 text-sm'>
                <input type='checkbox' checked={editingDoctor.available} onChange={(e)=>setEditingDoctor(prev=>({...prev,available:e.target.checked}))} />
                Available
              </label>
              <input className='border rounded px-3 py-2' type='file' accept='image/*' onChange={(e)=>{
                const file = e.target.files?.[0] || null
                setEditingDoctor(prev=>({...prev,image:file,preview:file ? URL.createObjectURL(file) : prev.preview}))
              }} />
            </div>

            <textarea className='w-full border rounded px-3 py-2 mt-3' rows={4} value={editingDoctor.about} onChange={(e)=>setEditingDoctor(prev=>({...prev,about:e.target.value}))} placeholder='About doctor' required />

            {editingDoctor.preview && (
              <img src={editingDoctor.preview} alt='preview' className='mt-3 w-20 h-20 rounded-full object-cover border' />
            )}

            <div className='mt-4 flex justify-end gap-2'>
              <button type='button' className='px-4 py-2 border rounded' onClick={() => setEditingDoctor(null)}>Cancel</button>
              <button type='submit' className='px-4 py-2 bg-[#0F766E] text-white rounded' disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default DoctorsList