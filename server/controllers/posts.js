import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            userPicturePath: user.userPicturePath,
            picturePath,
            likes: {},
            comments: [],
            answered: false,
            solution: "",
        });
        await newPost.save();

        const post = await Post.find(); // grabs all posts for updated feed      
        res.status(201).json(post); //201 is successfuly created something
    } catch (error) {
        res.status(409).json({ message: error.message }); //409 is error creating
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post); //200 is successful
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post); //200 is successful
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/* UPDATE */
// handling the logic for liking a post
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // if this userId can be found that means this post is liked by that person

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        //finding the specific post and updating it: either unliking or liking it
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}