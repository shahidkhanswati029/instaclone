
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";





const Login = () => {
    const [input,setInput]=useState({
        
        email:"",
        password:""
    })
    const navigate =useNavigate();
    const dispatch=useDispatch()
    const {user}=useSelector(store=>store.auth)
    const handleAddEvent=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(input)
        try {
            const res=await axios.post("http://localhost:4000/api/v1/user/login",input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            });
            if(res.data.success){
                dispatch(setAuthUser(res.data.user))
                toast.success(res.data.message)
                navigate ("/")
                setInput({
                    username:"",
                    email:"",
                    password:""
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
       
    }
    useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[])
  return (
    <>
    <div className="flex items-center w-screen h-screen justify-center">
        <form onSubmit={handleSubmit} className="shadow-lg flex flex-col gap-5 p-8">
            <div className="my-4">
              <h1 className="text-center font-bold">LOGO</h1>
              <p className="text-sm ">Login to see photos and videos from your friends</p>
            </div>
          
            <div>
              <label htmlFor="Email"  className="font-bold">Email:</label>
                <input 
                type="email"
                name="email"
                value={input.email}
                onChange={handleAddEvent}
                className="focus-visible:ring-transparent my-2 w-full py-2 px-2 border"
                />
            </div>
            <div>
                <label className="font-bold">Password:</label>
                <input 
                type="password"
                name="password"
                value={input.password}
                onChange={handleAddEvent}
                className="focus-visible:ring-transparent my-2 w-full py-2 px-2 border"
                />
            </div>
            <button type="submit" className=" border bg-black text-white w-full border rounded-md px-2 py-3 font-bold">Login</button>

<span>Does not  have an account ?<Link className="text-blue-800 font-bold" to="/signup">Signup</Link></span>

        </form>
      
    </div>
    </>
  )
}

export default Login
