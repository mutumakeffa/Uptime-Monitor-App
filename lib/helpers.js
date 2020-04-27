/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('../config ')



//Container for all the helpers
const helpers = {};


//Create a SHA256 hash algorithm that is inbuilt within Node
helpers.hash = (str) => {  //does not take a callback as it returns the value instead of calling t back 
    //validate the string that coming in
    if(typeof(str) == 'string' && str.length > 0){
        const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false
    }
}











//Export module
module.exports = helpers;

