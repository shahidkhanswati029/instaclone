import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/Comment.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!image) {
            res.status(401).json({
                message: "image required"
            })
        }
        //image upload
        const optimizedImageBuffer = await
            sharp(image.buffer).resize({ width: 800, height: 800, fit: "inside" })
                .toFormat("jpeg", { quality: 80 })
                .toBuffer();
        //buffer to datauri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId

        })
        const user = await User.findById(authorId)
        if (user) {
            user.posts.push(post._id)
            await user.save()
        }
        await post.populate({ path: "author", select: "-password" })
        return res.status(201).json({
            message: "new post added",
            post,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}



export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profilePicture"
                }
            });
        return res.status(201).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const post = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username,profilePicture"
            })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username,profilePicture"
                }
            });
        return res.status(201).json({
            posts,
            success: true
        })
    } catch (error) {

    }
}


export const likePost = async (req, res) => {
    try {
        const likeKarneWalyUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({
                message: "post is not found",
                success: false
            })
        }
        //like logic started
        await post.updateOne({ $addToSet: { likes: likeKarneWalyUserKiId } })
        await post.save();

        //socekt io for real time notification
        const user=await User.findById(likeKarneWalyUserKiId).select("username profilePicture")
        const postownnerId=post.author.toString();
        if(postownnerId!=likeKarneWalyUserKiId){
            const notification={
                type:"Like",
                userId:likeKarneWalyUserKiId,
                userDetail:user,
                postId,
                message:"your post was liked"

            }
            const postOwnerSocketId=getRecieverSocketId(postownnerId)
            io.to(postOwnerSocketId).emit("notification",notification)
        }

        return res.status(201).json({
            message: "post liked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}



export const disLikePost = async (req, res) => {
    try {
        const likeKarneWalyUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({
                message: "post is not found",
                success: false
            })
        }
        //like logic started
        await post.updateOne({ $pull: { likes: likeKarneWalyUserKiId } })
        await post.save();

        //socekt io for real time notification
        const user=await User.findById(likeKarneWalyUserKiId).select("username profilePicture")
        const postownnerId=post.author.toString();
        if(postownnerId!=likeKarneWalyUserKiId){
            const notification={
                type:"disLike",
                userId:likeKarneWalyUserKiId,
                userDetail:user,
                postId,
                message:"your post was liked"

            }
            const postOwnerSocketId=getRecieverSocketId(postownnerId)
            io.to(postOwnerSocketId).emit("notification",notification)
        }

        return res.status(201).json({
            message: "post disliked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}



export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKarneWalyUserKiId = req.id;
        const { text } = req.body;
        const post = await Post.findById(postId)
        if (!text) {
            return res.status(401).json({
                message: "text is required",
                success: false
            })
        }
        const comment = await Comment.create({
            text,
            author: commentKarneWalyUserKiId,
            post: postId
        })
        await comment.populate({
            path: "author",
            select: "username profilePicture"
        })
        post.comments.push(comment._id)
        await post.save();

        return res.status(201).json({
            message: "comment added",
            comment,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId })
            .populate("username author profilePicture")
        if (!comments) {
            return res.status(401).json
                ({ message: "not found comments for this post", success: false })
        }
        return res.status(201).json({ success: true, comments })
    } catch (error) {
        console.log(error)
    }
}



export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id; // Assuming this comes from middleware
        
        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        // Check if the logged-in user is the owner of the post
        if (post.author.toString() !== authorId) {
            return res.status(401).json({
                message: "Unauthorized access",
                success: false,
            });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Remove the post ID from the user's post list
        const user = await User.findById(authorId);
        if (user) {
            user.posts = user.posts.filter((id) => id.toString() !== postId);
            await user.save();
        }

        // Delete associated comments
        await Comment.deleteMany({ post: postId });

        // Send a success response
        return res.status(200).json({
            message: "Post deleted",
            success: true,
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({
            message: "An error occurred while deleting the post",
            success: false,
            error: error.message, // For debugging
        });
    }
};



export const bookMarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "post not found",
                success: false
            })
        }
        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            //already bookmarked remove from the bookmarked
            await user.updateOne({ $pull: { bookmarks: post._id } })
            await user.save()
            return res.status(200).json({
                type: unsaved,
                message: " post removed from the bookmark",
                success: true
            })
        } else {
            if (user.bookmarks.includes(post._id)) {
                //already bookmarked remove from the bookmarked
                await user.updateOne({ $addToSet: { bookmarks: post._id } })
                await user.save()
                return res.status(200).json({
                    type: saved,
                    message: "post  bookmarked",
                    success: true
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}