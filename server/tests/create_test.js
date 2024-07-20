import { createRequire } from "module";
const require = createRequire(import.meta.url);

import User from '../models/User.js';
const assert = require('assert'); 
  
describe('Creating documents in MongoDB', () => { 
    it('Creates a New User', (done) => { 
        const newUser = new User({ firstName: 'Mocha'}); 
        newUser.save() // returns a promise after some time 
            .then(() => { 
                //if the newUser is saved in db and it is not new 
                assert(!newUser.isNew); 
                done(); 
            }); 
    }); 
});

