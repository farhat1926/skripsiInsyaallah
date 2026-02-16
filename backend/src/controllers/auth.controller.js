import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
  const { fullName, email, password, userType, secretKey } = req.body;

  try {
    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    if (
      (userType === "Admin" && secretKey !== process.env.ADMIN_SECRET) ||
      (userType === "karyawan" && secretKey !== process.env.KARYAWAN_SECRET)
    ) {
      return res.status(403).json({ message: "Secret key salah" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      userType,
    });

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      userType: newUser.userType,
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"email tidak ditemukan!!"})
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"password salah!!"})
        }
        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            userType:user.userType
        })
    } catch (error) {
        console.log("error in login controller", error.message)
        res.status(500).json({message:"internal server error"})
    }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};


export const updateProfile = async(req,res) =>{
    res.setHeader("Access-Control-Allow-Credentials", "true");
    try {
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message:"profile pic is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updateUser)
    } catch (error) {
        console.log("error in update profile",error)
        res.status(500).json({message:"internal server error"})
    }
}


export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error in auth profile",error.message)
        res.status(500).json({message:"internal server error"})
    }
}