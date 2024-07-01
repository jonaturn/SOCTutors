import { createRequire } from "module";
const require = createRequire(import.meta.url);

import User from "../models/User.js";
const assert = require('assert'); 
  
//let user; 
// this will run before running every test 
beforeEach((done) => { 
    // Creating a new Instance of User Model 
    //user = new User({  _id: "668192327f454c162d55713e" }); 
    console.log("read_test running");
    done();
}); 
  
describe('Reading Details of User', () => { 
    it('Finds user with the name', (done) => { 
        //this.timeout(15000);
        User.findOne({ email: "jonathencheng86@gmail.com" }) 
            .then((user) => { 
                //console.log(user.lastName);
                assert(user.firstName === 'Jonathen '); 
                assert(user.lastName === 'Cheng'); 
                done(); 
            }); 
    }) 
})