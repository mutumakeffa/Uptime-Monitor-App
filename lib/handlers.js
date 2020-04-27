/**
 * Request handlers - This is the paths that are requested by the users
 * 
 */


 //Dependencies
const _data = require('./data');
const helpers = require('./helpers'); 


//Define the handlers
const handlers = {};

//Users handler
handlers.users = (data, callback) => {
    const acceptableMethods = ['post','get','put','delete']; 
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data,callback)
    }else{
        callback(405);
    }
};

//Container for the users submethods
handlers._users = {};


//Users - post
//Required data: firstName, lastName, phone, password, tosAgreement
//Optional data: none
handlers._users.post = (data, callback) => {
    //check that all required fields are filled out as required
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length == 10 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true: false;

    if(firstName && lastName && phone && password && tosAgreement) {
        //make sure the user does not exist. We are uniquely identifying the user using the phone number
        _data.read('users', phone, (err, data)=>{
            if(err){
 
                //Hash the password using built in library called crypto
                const hashedPassword = helpers.hash(password);

                if(hashedPassword){
                    
                    //Create the user object
                    let userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    }

                    //Store the user and persist it to disk
                    _data.create('users',phone,userObject, (err)=>{
                        if(!err){
                            callback(200)
                        }else{
                            console.log(err);
                            callback(500, {'Error':'Could not create a new user'})
                        }
                    });
                } else {
                    callback(500, {'Error' : 'Could not hash the user\'s password'})
                }

                

            }else{
                callback(400, {'Error':'A user with that phone number already exists!'});
            }
        });

    }else{
        callback(400, {'Error':'Missing required fields'});
    }
}

//Users - get
handlers._users.get = (data, callback) => {

}
//Users - put
handlers._users.put = (data, callback) => {

}
//Users - delete
handlers._users.delete = (data, callback) => {

}



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

