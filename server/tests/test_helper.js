import { createRequire } from "module";
const require = createRequire(import.meta.url);

const mongoose = require('mongoose'); 
  
// tells mongoose to use ES6 implementation of promises 
mongoose.Promise = global.Promise; 
const MONGODB_URI = 'mongodb+srv://dummyuser:A0273210W@cluster0.9iw1qdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
mongoose.connect(MONGODB_URI); 
  
mongoose.connection 
    .once('open', () => console.log('Connected!')) 
    .on('error', (error) => { 
        console.warn('Error : ', error); 
    }); 
      
    // runs before each test 
    beforeEach((done) => { 
    //     mongoose.connection.collections.users.drop(() => { 
    //     done(); 
    //    }); 
    console.log("test_helper running");
    done();
    });