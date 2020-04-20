/**
 * Library for storing and editing data
 * 
 */



//Dependencies
const fs = require('fs');
const path = require('path');  //path is used to normalize the paths to different directories


//Container for this module (to be exported)
let lib = {};


//define base directory of the data folder on the lib object so that all the fxns can use it
lib.baseDir = path.join(__dirname, '/../.data/');



//------------------------------ CRUD ---------------------------------------//

//Create a function for writing data to a file
lib.create = (dir, file, data, callback) => {

    //open the file for writing
    fs.open(lib.baseDir + dir + '/' + file +'.json','wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {

            //convert data to a strings
            const stringData = JSON.stringify(data);

            //write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err)=> {
                if (!err) {
                   fs.close(fileDescriptor, (err) => {
                       if(!err) {
                           callback(false);
                       } else {
                           callback('Error closing new file');
                       }
                   });
                } else {
                    callback('Error writing to new file');
                }
            });
            
        } else {
            callback('Could not create new file. It may already exists ')
        };
    });

};

//Read data from a file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (err,data)=>{
        callback(err,data)
    })

};

//Update data in an existing file
lib.update = (dir, file, data, callback) => {

    //open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+' ,(err, fileDescriptor) => {
        if(!err && fileDescriptor){

            //convert the data we receive into a string
            const stringData = JSON.stringify(data);

            //Truncate the details in the file
            fs.truncate(fileDescriptor, (err) => {
                if(!err){

                    //write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,(err) => {
                        if(!err){
                            fs.close(fileDescriptor, (err) => {
                                if(!err){
                                    callback(false)
                                }else{
                                    callback('Error closing existing file!')
                                }
                            });

                        }else{
                            callback('Error writing to existing file!')
                        }

                    });

                } else {
                    callback('Error truncating file');
                }
            });

        }else{
            callback('could not open the file for updating, it may not exist yet');
        }
    });

};


//Delete a file
lib.delete = (dir,file,callback) => {
    
    //unlink the file and remove it from the file system
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if(!err){
            callback(false)
        }else{
            callback('Error deleting the file')
        }
    });

}



//export the module
module.exports = lib;


































