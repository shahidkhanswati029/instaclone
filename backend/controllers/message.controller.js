import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getRecieverSocketId } from "../socket/socket.js";
import  {io}  from '../socket/socket.js'



export const sendMessage = async (req, res) => {
    try {
      const senderId = req.id; // Extract sender ID from authenticated user
      const recieverId = req.params.id;
      const { textMessage:message } = req.body;
      console.log(message)
      
  
      // Validate the `message` field
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message content is required",
        });
      }
  
      // Find or create a conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recieverId] },
      });
  
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, recieverId],
          messages: [],
        });
      }
  
      // Create and save the new message
      const newMessage = await Message.create({
        senderId,
        recieverId,
        message,
      });
  
      // Add the new message to the conversation
      conversation.messages.push(newMessage._id);
      await conversation.save();
  
      // Socket.io logic (optional)
      const recieverSocketId = getRecieverSocketId(recieverId);
      if (recieverSocketId) {
        io.to(recieverSocketId).emit("newMessage", newMessage);
      }
  
      // Respond with the new message
      res.status(200).json({
        success: true,
        newMessage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  


export const getMessage= async(req,res)=>{
try {
    const senderId=req.id;
    const recieverId=req.params.id;
    const converation=await Conversation.findOne({
        participants:{$all:[senderId,recieverId]}
    }).populate("messages")
    if(!converation){
        return res.status(200).json({
            success:true,
            messages:[]
        })
    }
    return res.status(200).json({
        success:true,
        messages:converation?.messages
    })
} catch (error) {
    console.log(error)
}
}