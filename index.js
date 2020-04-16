/**
 * Primary file for the API
 */


//Dependencies
const http = require('http');
const PORT = '3000';
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;


//The server should respond to all requests with a string
const server = http.createServer((req, res) => {

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

});


//Start the server and have it listen to port 3000
server.listen(PORT, () => {
    console.log(`server is up and running on port, ${PORT} `);
});


//Define the handlers
const handlers = {};

//sample handler
handlers.sample = (data, callback) => {
    //call back a HTTP status code and a payload object
    callback('406', {'name': 'sample handler'})
}

//Not found handler
handlers.notFound = (data, callback) => {
    callback('404')
}

//Define a request router
const router = {
    'sample': handlers.sample,
}
