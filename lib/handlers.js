/**
 * Request handlers
 * 
 */


 //Dependencies



//Define the handlers
const handlers = {};

//Ping handler
handlers.ping = (data, callback) => {
    callback('200')
};

//Not found handler
handlers.notFound = (data, callback) => {
    callback('404')
};


//export the module
module.exports = handlers;

