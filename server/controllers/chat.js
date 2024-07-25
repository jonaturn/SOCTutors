import Chat from "../models/Chat.js";
import User from "../models/User.js";

// @description     Create or fetch One-to-One Chat
// @route           POST /api/chat/
// @access          Protected
export const accessChat = async (req, res) => {
    const { userId, initiatingUserId } = req.body;
    console.log(userId);
    console.log(initiatingUserId);
    if (!userId || !initiatingUserId) {
      return res.status(400).json({ message: "Missing parameters" });
    }
  
    try {
      let chat = await Chat.findOne({
        users: { $all: [initiatingUserId, userId] },
      })
        .populate("users", "-password")
        .populate("latestMessage");
  
      if (!chat) {
        const newChat = new Chat({
          users: [initiatingUserId, userId],
          latestMessage: null,
        });
  
        const createdChat = await newChat.save();
        const fullChat = await Chat.findById(createdChat._id).populate("users", "-password");
        return res.status(200).json(fullChat);
      }
  
      chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "firstName lastName email userPicturePath",
      });
  
      res.status(200).json(chat);
    } catch (error) {
      console.error("Error in accessChat:", error);
      res.status(400).json({ message: error.message });
    }
  };  

// @description     Fetch all chats for a user
// @route           GET /api/chat/
// @access          Protected
export const fetchChats = async (req, res) => {
    const { userId } = req.query;
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      const chats = await Chat.find({ users: userId })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
  
      const populatedChats = await User.populate(chats, {
        path: "latestMessage.sender",
        select: "firstName lastName email userPicturePath",
      });
  
      res.status(200).json(populatedChats);
    } catch (error) {
      console.error("Error in fetchChats:", error);
      res.status(400).json({ message: error.message });
    }
  };