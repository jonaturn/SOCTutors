import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* REGISTER USER */
export const register = async (req, res) => {
    console.log("HAII")
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            password,
            userPicturePath,
            connections,
            occupation
         } = req.body;

         const salt = await bcrypt.genSalt(); // create a salt provided by bcrypt, and this encrypts the password
         const passwordhash = await bcrypt.hash(password, salt); //hash the password with the salt

         const newUser = new User({
             firstName,
             lastName,
             email,
             password: passwordhash,
             userPicturePath,
             connections,
             occupation,
             //viewedProfile: Math.floor(Math.random() * 1000),
             //impressions: Math.floor(Math.random() * 1000),
         });
         const savedUser = await newUser.save();
         res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist "});

        const isMatch =  await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg:"Invalid credentials "});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};