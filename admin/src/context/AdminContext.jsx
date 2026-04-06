import { createContext } from "react";
import { useState } from "react";
export const AdminContext=createContext();
import axios from 'axios'
import {toast} from 'react-toastify'
const AdminContextProvider=(props)=>{
    const[aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const[doctors,setDoctors]=useState([])
    const[appointments,setAppointments]=useState([])
    const[dashData,setDashData]=useState(false)
     


    const backendUrl=import.meta.env.VITE_BACKEND_URL


    const getAllDoctors=async()=>{
    try {
        // send token as header 'atoken' to match backend middleware
        const {data}=await axios.post(backendUrl+'/api/admin/all-doctors',{}, { headers: { atoken: aToken } })
        if(data.success)
        {
            setDoctors(data.doctors)
            console.log(data.doctors)
        }
        else
        { 
            toast.error(data.message)

        }
    } 
    catch (error) {
        // better error display
        console.error('getAllDoctors error:', error)
        toast.error(error.response?.data?.message || error.message)
    }
    }

    const changeAvailablity=async (docId) => {
        try {
            const{data}=await axios.post(backendUrl+'/api/admin/change-availability',{docId}, { headers: { atoken: aToken } })
            if(data.success)
            {
                toast.success(data.message)
                getAllDoctors()
            }
            else
            {
             toast.error(data.message)
            }

        } catch (error) {
            console.error('changeAvailablity error:', error)
            toast.error(error.response?.data?.message || error.message)
        }
        
    }

    const updateDoctor=async ({ doctorId, name, speciality, experience, fees, about, address1, address2, available, image }) => {
        try {
            const formData = new FormData()
            formData.append('doctorId', doctorId)
            formData.append('name', name)
            formData.append('speciality', speciality)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            formData.append('available', available)

            if (image) formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/admin/update-doctor', formData, {
                headers: { atoken: aToken }
            })

            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                return { success: true }
            }

            toast.error(data.message)
            return { success: false }
        } catch (error) {
            console.error('updateDoctor error:', error)
            toast.error(error.response?.data?.message || error.message)
            return { success: false }
        }
    }

    const deleteDoctor=async (doctorId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/delete-doctor',
                { doctorId },
                { headers: { atoken: aToken } }
            )

            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                return { success: true }
            }

            toast.error(data.message)
            return { success: false }
        } catch (error) {
            console.error('deleteDoctor error:', error)
            toast.error(error.response?.data?.message || error.message)
            return { success: false }
        }
    }

    const getAllAppointments=async () => {
        try {
            const{data}=await axios.get(backendUrl+'/api/admin/appointments',{headers:{atoken: aToken}})
            if(data.success)
            {
                setAppointments(data.appointments)
                console.log(data.appointments)
            }
            else
            {
                toast.error(data.message)
            }
        } 
        catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment=async (appointmentId) => {
        try {
          const{data}=await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{atoken: aToken}})
          if(data.success)
            {
                toast.success(data.message)
                getAllAppointments()
            }  
            else
            {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }
 
    const getDashData=async (params) => {
       try {
    const {data}=await axios.get(backendUrl+'/api/admin/dashboard',{headers:{atoken: aToken}})
        if(data.success)
        {
            setDashData(data.dashData)
            console.log(data)
        }
        else
        {
            toast.error(data.message)
        }
       } catch (error) {
        toast.error(error.message)
       } 
    }
    

    const value={
       aToken,setAToken,
       backendUrl,doctors,getAllDoctors,changeAvailablity,appointments,setAppointments,getAllAppointments,
         cancelAppointment,dashData,getDashData,updateDoctor,deleteDoctor
  }
    return (
        <AdminContext.Provider value={value}>
        {props.children}
        </AdminContext.Provider>
    )


}

export default AdminContextProvider;