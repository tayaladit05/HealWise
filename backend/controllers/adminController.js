import validator from "validator";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

//API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    //hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // With multer + CloudinaryStorage, file is already uploaded and path is Cloudinary URL.
    const imageUrl = imageFile.path;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added" });
  } catch (error) {
    
    console.error("addDoctor error:", error);
    try {
      console.error("req.body:", req.body);
      console.error("req.file:", req.file);
    } catch (logErr) {
      console.error("Error logging request context:", logErr);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
//api for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" } 
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API to get add all doctors list for admin panel
const allDoctors=async(req,res)=>{
  try {
      const doctors=await doctorModel.find({}).select('-password')
      res.json({success:true,doctors})       

  } catch (error) {
    console.log(error)
    res.status({success:false,message:error.message})
  }
}


//API TO GET ALL APPOINTMENTS LIST
const appointmentsAdmin=async (req,res) => {
   try {
    const appointments=await appointmentModel.find({})
    res.json({success:true,appointments})
   


   } catch (error) {
     onsole.log(error)
    res.status({success:false,message:error.message})
   }
}

//API FOR APPOINTMENT CANCELLATION
const appointmentCancel=async (req,res) => {
    try {
        const {appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
      
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        //making slot available for others
        const {docId,slotDate,slotTime}=appointmentData
        const doctorData=await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!=slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Cancelled'})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API FOR DASHBOARD DATA FOR ADMIN
const adminDashboard=async (req,res) => {
  try {
    const doctors=await doctorModel.find({})
    const users=await userModel.find({})
    const appointments=await appointmentModel.find({})
    const dashData={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }
      res.json({success:true,dashData})
    
  } catch (error) {
     console.log(error);
        res.json({ success: false, message: error.message });
  }
  
}

// API TO UPDATE DOCTOR FROM ADMIN PANEL
const updateDoctor = async (req, res) => {
  try {
    const { doctorId, name, speciality, experience, about, fees, address, available } = req.body;
    const imageFile = req.file;

    if (!doctorId || !name || !speciality || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const payload = {
      name,
      speciality,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address),
    };

    if (typeof available !== "undefined") {
      payload.available = available === true || available === "true";
    }

    if (imageFile) {
      // With CloudinaryStorage, multer gives Cloudinary URL in file.path
      payload.image = imageFile.path;
    }

    const updatedDoctor = await doctorModel
      .findByIdAndUpdate(doctorId, payload, { new: true, runValidators: true })
      .select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.json({ success: true, message: "Doctor updated", doctor: updatedDoctor });
  } catch (error) {
    console.log("updateDoctor error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API TO DELETE DOCTOR FROM ADMIN PANEL
const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ success: false, message: "Doctor id is required" });
    }

    const deletedDoctor = await doctorModel.findByIdAndDelete(doctorId);
    if (!deletedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.json({ success: true, message: "Doctor deleted" });
  } catch (error) {
    console.log("deleteDoctor error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard,updateDoctor,deleteDoctor };

