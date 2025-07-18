import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { EyeOff, Mail, MessageSquare, User,Lock,Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  // Validasi form sebelum submit
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error('fullName is required')
    if (!formData.email.trim()) return toast.error('email is required')
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("invali email format")
    if (!formData.password) return toast.error('password is required')
    if (formData.password.length < 6) return toast.error('password must be up to 6')

    return true
  };

  const handleSubmit = async (e) => {
    if(userType =="Admin" && secretKey !== "perawat"){
      e.preventDefault();
      return toast.error("Invalid secret key")
    } 
    else if(userType === "karyawan" && secretKey !== "karyawan"){
      e.preventDefault();
      return toast.error("Invalid secret key")
    }
    else{
      
          e.preventDefault();
          const success = validateForm()
      
          if(success===true) signup(formData)
    }

  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
          <div>Register as:{" "}
           <input type="radio" name="UserType" value="User" required checked={userType === "User"} onChange={(e) => {
            setUserType(e.target.value);
            setFormData({ ...formData, userType: e.target.value });
            }}
          />Pasien
            <input
              type="radio"
              name="UserType"
              value="Admin"
              checked={userType === "Admin"}
              required
              onChange={(e) => {
                setUserType(e.target.value);
                setFormData({ ...formData, userType: e.target.value });
              }}
            /> Dokter
             <input type="radio" name="UserType" value="karyawan"
            checked={userType==="karyawan"} required
              onChange={(e)=>{
              setUserType(e.target.value);
              setFormData({...formData,userType:e.target.value});
              }}/> Karyawan

          </div>
          {userType == "Admin" || userType == "karyawan"? <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Secret Key</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Secret Key"
                 
                  onChange={(e) =>
                    setSecretKey(e.target.value)
                  }
                />
              </div>
            </div> :null }
            
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="email@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text":"password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="........."
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={()=> setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="size-5 text-base-content/40"/>
                ):(
                  <Eye className = "size-5 text-base-content/40"/>
                )
              }
            </button>
              </div>
            </div>
      <button
      type="submit"
      className="btn btn-primary w-full"
      disabled={isSigningUp}>
        {isSigningUp ? (
          <>
          <Loader2 className="size-5 animate-spin"/>
          Loading ....
          </>
        ):("Create Account")}
      </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
            already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right side */}
        <AuthImagePattern
        title="Selamat Datang di Klinik Weiku"
        subtitle = "silahkan konsultasikan keluhan anda kepada dokter kami yang sudah berpengalaman dalam bidangnya. Kami siap membantu anda dengan sepenuh hati."
        />

    </div>
  );
};

export default SignUpPage;
