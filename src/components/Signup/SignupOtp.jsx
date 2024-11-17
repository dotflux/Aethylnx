import React from 'react'
import { useEffect , useState} from 'react';
import { useNavigate , useLocation } from "react-router-dom";
import errorIcon from "../../assets/error.svg";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import SignUpBG from './SignUpBG';

const SignupOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search)
  const email = decodeURIComponent(queryParams.get("email"))
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const verifyToken = async () => {
      if (!email){
        navigate('/signup',{state:{noPara:true}})
      }
      const r = await fetch("http://localhost:3000/verifytk",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include"
      })
      const result = await r.json()
      if (result.valid && email != result.email){
        navigate('/signup',{state:{noPara:true}})
        
      }
      if (!r.ok){
        navigate('/signup',{state:{noPara:true}})
      }
  }
  useEffect(()=>{
    verifyToken();
  },[])


  const delay = (d) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };
  const onSubmit = async (data) => {
    try {
    await delay(5);
    const r = await fetch("http://localhost:3000/signup/otp",{method:"POST",credentials:"include",headers:{
      "Content-Type":"application/json"
    },body:JSON.stringify({otp:data.otp,email})})
    
    const result = await r.json();

    if (r.status === 500){
      navigate('/signup',{state:{noPara:true}})
    }
    if (!r.ok){
      result.errors.forEach((error)=>{
        setError(error.type,{type:"server",message:error.error})
      })
      return
    }
    if (r.ok){
      navigate(`/login`,{state:{registerFinish:true}})
      return
    }

  }
  catch(err){
    console.log("Network error:" ,err)
  }
};

  return (
    <div>
      <SignUpBG />
      <div className='relative'>
      <h1 className='flex justify-center mt-20 mb-20 text-white text-4xl text-center'>Enter your OTP</h1>
      <div className="max-w-md mx-auto relative overflow-hidden z-10 bg-gray-800 p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-blue-700 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-blue-900 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12">
        <h2 className="text-2xl font-bold text-white mb-6">Register Now</h2>

        <form method="post" action="" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-300"
              htmlFor="otp"
            >
              Otp
            </label>
            <input
              className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
              {...register("otp", {
                
              })}
              placeholder="Enter OTP"
              type="text"
            />
            {errors.otp && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">{errors.otp.message}</h3>
              </div>
            )}
          </div>

         
          <div>
          {isSubmitting && <Loader/>}
          </div>
          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r from-black via-gray-800 to-gray-700 text-white px-4 py-2 font-bold rounded-md hover:opacity-80"
              type="submit"
              disabled={isDisabled}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default SignupOtp
