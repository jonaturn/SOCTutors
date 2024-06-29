import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path'; //from node
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js"; //path and routes for auth features
import userRoutes from "./routes/users.js"; //path and routes for user features
import postRoutes from "./routes/posts.js"; //path and routes for post features
import { register } from 'module';
import { verifyToken } from './middleware/auth.js';
import { createPost } from './controllers/posts.js';
import User from "./models/User.js";
import Post from "./models/Post.js";
//import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); //so we can grab file url for modules
const __dirname = path.dirname(__filename); //only for type modules
dotenv.config(); //to use .env file
const app = express(); //so we can use the middleware   
app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); //set directory of where we keep our assets(images in this case)
//this is normally done online like with amazon s3

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function(req, file, cb) {
        cb(null, req.body.name);
    }
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); 
app.post("/posts", verifyToken, upload.single("picture"), createPost);
// we cannot remove this into a seperate file because we need to upload this to db

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, 
    { 
       // useNewUrlParser: true,
       // useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

        //ADD FAKE DATA ONLY RUN ONCE SO NO DUPLICATES
        //User.insertMany(users);
        //Post.insertMany(posts);
    })
    .catch((error) => console.log(`${error} did not connect`));
