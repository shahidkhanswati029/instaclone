import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";





const Signup = () => {
    const [input,setInput]=useState({
        username:"",
        email:"",
        password:""
    })
    const [louding,setLouding]=useState(false)
    const navigate =useNavigate()
    const {user}=useSelector(store=>store.auth)
    const handleAddEvent=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(input)
        try {
            setLouding(true)
            const res=await axios.post("http://localhost:4000/api/v1/user/register",input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            });
            if(res.data.success){
                navigate("/login")
                toast.success(res.data.message)
                setInput({
                    username:"",
                    email:"",
                    password:""
                })

            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }finally {
            setLouding(false)
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
              <p className="text-sm ">Signup to see photos and videos from your friends</p>
            </div>
            <div>
                <Label className="font-bold">Username:</Label>
                <Input 
                type="text"
                name="username"
                value={input.username}
                onChange={handleAddEvent}
                className="focus-visible:ring-transparent my-2"
                />
            </div>
            <div>
                <Label className="font-bold">Email:</Label>
                <Input 
                type="email"
                name="email"
                value={input.email}
                onChange={handleAddEvent}
                className="focus-visible:ring-transparent my-2"
                />
            </div>
            <div>
                <Label className="font-bold">Password:</Label>
                <Input 
                type="password"
                name="password"
                value={input.password}
                onChange={handleAddEvent}
                className="focus-visible:ring-transparent my-2"
                />
            </div>
            {
                louding?(
                    <Button>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        please wait
                    </Button>
                ):(
                    <Button type="submit">Signup</Button>
                )
            }
            
           <span>Already have an account ?<Link className="text-blue-800 font-bold" to="/login">Login</Link></span>
        </form>
      
    </div>
    </>
  )
}

export default Signup
