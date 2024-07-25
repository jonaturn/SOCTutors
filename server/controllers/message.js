import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// @description     Get all Messages
// @route           GET /api/message/:chatId
// @access          Protected
export const allMessages = async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "firstName lastName email userPicturePath")
        .populate({
          path: "chat",
          populate: {
            path: "users",
            select: "firstName lastName email userPicturePath",
          },
        });
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// @description     Create New Message
// @route           POST /api/message/
// @access          Protected
export const sendMessage = async (req, res) => {
    const { content, chatId, senderId } = req.body;

    if (!content || !chatId || !senderId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        // Create and save the new message
        const newMessage = new Message({
            sender: senderId,
            content,
            chat: chatId,
            readBy: [],
        });
        let message = await newMessage.save();

        // Populate the sender details
        message = await Message.findById(message._id)
            .populate("sender", "firstName lastName email userPicturePath")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "firstName lastName email userPicturePath"
                }
            })
            .exec();

        // Update the chat with the latest message
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

        res.status(200).json(message);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(400).json({ message: error.message });
    }
};

