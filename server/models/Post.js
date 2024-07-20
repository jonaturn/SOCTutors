import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
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
        comments: [{
            userId: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        answered: Boolean,
        solution: String
    },
    { timestamps: true }
)

const Post = mongoose.model("Post", postSchema);

export default Post;