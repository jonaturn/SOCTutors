import mongoose from "mongoose";

const postsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        difficulty: String,
        description: String,
        userPicturePath: String,
        picturePath: String,
        likes: {
            type: Map,
            of: Boolean
        },
        comments: {
            type: Array,
            default: []
        },
        answered: Boolean,
        solution: String
    },
    { timestamps: true }
)

const Post = mongoose.model("Post", postsSchema);

export default Post;