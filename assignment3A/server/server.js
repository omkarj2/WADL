let http = require('http');

http.createServer(function (req,res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if( req.method === 'OPTIONS' ){
        res.writeHead(200);
        res.end();
        return;
    }
    
    if( req.method === 'POST' && req.url === '/login' ){
        let data = '';

        req.on('data' , chunk => {
            data += chunk.toString();
        });

        req.on('end', () => {
            console.log('Raw data :' , data);

            const structured = JSON.parse(data);

            console.log('username' , structured.username);
            console.log('password' , structured.password);

            res.writeHead(200, {'Content-Type' : 'text/plain'});
            res.end('Login received');
        })


        return;
    }

    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('Hello world');


}).listen(3000 , ()=>{
    console.log('Server running on port 3000');
});

