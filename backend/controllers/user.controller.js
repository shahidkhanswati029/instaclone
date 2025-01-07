
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import dotenv from "dotenv"
import Post from "../models/post.model.js"
dotenv.config()
export const register = async (req, res) => {
  
    try {
        const { username, email, password } = req.body;
    //    console.log(req.body)
      // Check if all required fields are provided
        if (!username || !email || !password) {
        // console.log(username,email,password)
        return res.status(400).json({
            message: "All fields are required. Please check your input.",
            success: false,
        });
         }
      

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists. Please use a different email.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: newUser, // Optional: Include created user info
        });
    } catch (error) {
        console.error("Error during registration:", error.message);
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
            success: false,
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ message: "something is missing ,please check", success: false })

    }
    let user = await User.findOne({ email })
    if (!user) {

        return res.status(401).json({ message: "incorrect email or password", success: false })
    }
    const token = await jwt.sign(
        { userId: user._id }, // Payload
        process.env.SECRET_KEY, // Secret Key
        { expiresIn: "1d" } // Options
    );
    

    //populate each post if in the post array
    const populatedPosts = (await Promise.all(
        user.posts.map(async (postId) => {
            const post = await Post.findById(postId);
            if (post && post.author.equals(user._id)) {
                return post;
            }
            return null;
        })
    ))
    console.log(populatedPosts)
   
    user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        password:user.password,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: populatedPosts
    }
    const isMatchPassword = await bcrypt.compare(password,user.password)
    if (!isMatchPassword) {
        return res.status(401).json({ message: "incorrect email or password", success: false })
    }


    return res
    .cookie("token", token, {
        httpOnly: true, // Cookie is only accessible by the server
        sameSite: "strict", // CSRF protection
        maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
    })
    .json({
        message: `Welcome back, ${user.username}`,
        success: true,
        user,
    });
   

   
 

}


export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }

}


export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate({path:"posts",createdAt:-1}).populate("bookmarks")
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const editProfile = async (req, res) => {
    try {
     const userId=req.id;
     const {bio,gender}=req.body;
     const profilePicture=req.file;
     let cloudResponse;
     if(profilePicture){
      const fileUri=getDataUri(profilePicture)
     cloudResponse= await cloudinary.uploader.upload(fileUri)
     }
     const user= await User.findById(userId).select("-password")
     if(!user){
        return res.status(404).json({
            message:"user is not found",
            success:false
        })
     };
     if(bio)user.bio=bio;
     if(gender)user.gender=gender;
     if(profilePicture)user.profilePicture=cloudResponse.secure_url;

     await user.save();
     return res.status(200).json({
        message:"user updated successfully",
        success:true,
        user
    })
    } catch (error) {
   console.log(error)
    }
}

export const getSuggestedUser= async(req,res)=>{
try {
    const suggestedUser=await User.find({_id:{$ne:req.id}}).select("-password")
    if(!suggestedUser){
        return res.status(401).json({
            message:"currently donot have any users",
            success:false
            
        })
    }
    return res.status(200).json({
    
        success:true,
        users:suggestedUser
        
    })
} catch (error) {
    console.log(error)
}
}


export const followOrUnfollow = async (req, res) => {
    try {
        const followKarneWala = req.id; // Assuming this comes from middleware
        const jisKoFollowKroonga = req.params.id; // The ID from the request params

        // Check for invalid self-follow attempt
        if (followKarneWala === jisKoFollowKroonga) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself",
                success: false
            });
        }

        // Fetch users properly using their ObjectIds
        const user = await User.findById(followKarneWala); // Correct: Use just the ID
        const targetUser = await User.findById(jisKoFollowKroonga); // Correct: Use just the ID

        // Handle cases where users are not found
        if (!user || !targetUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const isFollowing = user.following.includes(jisKoFollowKroonga);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $pull: { following: jisKoFollowKroonga } }),
                User.updateOne({ _id: jisKoFollowKroonga }, { $pull: { followers: followKarneWala } })
            ]);
            return res.status(200).json({ message: "Unfollowed successfully", success: true });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $push: { following: jisKoFollowKroonga } }),
                User.updateOne({ _id: jisKoFollowKroonga }, { $push: { followers: followKarneWala } })
            ]);
            return res.status(200).json({ message: "Followed successfully", success: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};
