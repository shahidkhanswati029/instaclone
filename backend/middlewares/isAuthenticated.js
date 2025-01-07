import jwt from "jsonwebtoken";

export const isAuthenticated=async (req,res,next)=>{
    try {
        const token=req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                message:"user is not authenticated",
                success:false
            })
        }
        const decode=await jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({
                message:"invalid",
                success:false
            })
        }
        req.id=decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}