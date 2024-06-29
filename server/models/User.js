import mongoose from "mongoose";

const UserSchema = new mongoose.Schema( 
    {
        firstName: {
            type: String,
            //required: true,
            default: "",
            min: 2, 
            max: 50
        },
        lastName: {
            type: String,
            //required: true,
            default: "",
            min: 2, 
            max: 50
        },
        email: {
            type: String,
            //required: true,
            default: "",
            max: 50,
            unique: true
        },    
        password: {
            type: String,
            //required: true,
            default: "",
            min: 5
        },
        userPicturePath: {
            type: String,
            default: ""
        },
        connections: {
            type: Array,
            default: []
        },
        occupation: String,
    }, {timestamps: true}
);

const User = mongoose.model("User", UserSchema);
export default User;