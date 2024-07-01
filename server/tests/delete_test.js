import { createRequire } from "module";
const require = createRequire(import.meta.url);

import User from '../models/User.js';
const assert = require('assert'); 

describe('Deleting a User', () => { 
  
        // beforeEach((done), () => { 
        //     // user is created in the above test
        //     done();
        // }); 
      
        it('Removes a user', (done) => { 
        User.findOneAndDelete({ firstName: 'Mocha' }) 
            .then(() => User.findOne({ firstName: 'Mocha' })) 
            .then((user) => { 
                assert(user === null); 
                done(); 
            }); 
        }); 
    
        // it('Creates a New User again', (done) => { 
        //     const newUser1 = new User({ _id: '1234' }); 
        //     newUser1.save() // returns a promise after some time 
        //         .then(() => { 
        //             //if the newUser is saved in db and it is not new 
        //             assert(!newUser1.isNew); 
        //             done(); 
        //         }); 
        // }); 
      
        // it('Removes a user using its id', (done) => { 
        // User.findOneAndDelete({ _id: "1234" }) 
        //     .then(() => User.findOne({ _id: '1234' })) 
        //     .then((user) => { 
        //         assert(user === null); 
        //         done(); 
        //     }); 
        // }) 
    });