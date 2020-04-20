/**
 * Primary file for the API
 */


//Dependencies
const http = require('http');
const https = require('https')
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');


//Testing to write, read, update
//@TODO delete this

//Create
// _data.create('test1','newFile2', {'foo':'bar'}, (err) => {
//     console.log('this is the error: ', err);
// });

//read
// _data.read('test','newFile', (err,data) => {
//     console.log('this is the error: ', err, 'and this was the data: ', data);
// });

//update
// _data.update('test', 'newFile', {'fizz' : 'buzz'}, (err) => {
//     console.log('this is the error: ', err);
// });

//delete
_data.delete('test', newFile, (err)=>{
    console.log('This was the error',err);
})


//Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)

});

//Start the HTTP server and dynamically assign the port
httpServer.listen(config.httpPort, () => {
    console.log(`server is up and running on port, ${config.httpPort} `);
});


//Instantiate the HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pm'),
    'cert': fs.readFileSync('./https/cert.pm')
};
const httpsServer = https.createServer(httpsServerOptions,(req, res) => {
    unifiedServer(req, res)

});

//Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log(`server is up and running on port, ${config.httpsPort} `);
});

//All the server logic for both https and http server
const unifiedServer = (req, res) => {

    //Get the url and parse it. (true calls the queryString module)
    const parsedUrl = url.parse(req.url,true);

    //Get the path (pathname is the object set on the parseUrl)
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //Get query string as an object - helps us know what the user wants to modify
    const queryStringObject = parsedUrl.query;

    //Get HTTP method
    const method = req.method.toLowerCase();

    //Get the headers as an object
    const headers = req.headers;

    //Get the payload if Any. 
    //Emit data stream from req object and bind it to the buffer variable as a string
    const decoder =new StringDecoder('utf-8');
    let buffer ='';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    //this is going to be called on every request despite if it has a payload or not
    req.on('end', () => {
        buffer += decoder.end();
    });

    //Choose a handler that this request will go to. If one is not found, use the notFound handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    //construct the data object to send to the chosen handler
    const data = {
        'trimmedPath': trimmedPath,
        'queryStringObject': queryStringObject,
        'method': method,
        'headers': headers,
        'payload': buffer
    }

    //Route the request to the chosen handler specified on the route
    chosenHandler(data, (statusCode, payload) => {
        //use the status code called back by the handler or default back to 200
        typeof(statusCode) == 'number' ? statusCode : 200;

        //use the payload called back by the handler or default back to an empty object
        typeof(payload) == 'object' ? payload : {};

        //Convert the payload to a string
        const payloadString = JSON.stringify(payload);

        //return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);

        //send the response
        res.end(payloadString);

        //Log the request path
        console.log('Returning this response: ',statusCode,payloadString);

    });
}


//Define the handlers
const handlers = {};

//Ping handler
handlers.ping = (data, callback) => {
    callback('200')
}

//Not found handler
handlers.notFound = (data, callback) => {
    callback('404')
}

//Define a request router
const router = {
    'ping': handlers.ping,
}
