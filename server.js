var NodeRSA = require('node-rsa');
var net = require('net');
var tls = require('tls');
var http = require('http');
const trim = require('lodash/trim');
var express = require('express');
var fs = require("fs");
var key = new NodeRSA();
key.importKey(`
-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKuX4zI7HG3MgZo18ml4AwW+1gUq0ji+neYYvqfrdLnmtK8qWq0j
48t1/hmaMmxzkcZj7I3eV7GEOuJw93qJO6UCAwEAAQJBAJ9C4wktGe7C4AtcRLkl
PVDo1cWIAAPQz8bPcq1x+S3MbmNlOAgDvmdOOxmAmEUdBHf3hPxuxqQJg2hFiLKq
UiECIQDr174LbU86pEHkLSHEINLWgJGYjnLFzfFXOGCnuldnKQIhALpCXM2WidVR
jokCFUrsQitBuxeiFwr7MkLI+xMkG6wdAiB3EyF34YPMJtzB2Ouge7YX6SgZr2pR
Zq6AjA15AgNZKQIgKndC7WSrHEWx967P5/shwvcDjwnXsxs+hFeKVvzeikkCIDda
rPPbSfKg6YW69Y+TLUxQ1lM2gi+E+AMRSGcoi/5z
-----END RSA PRIVATE KEY-----
	`, 'private');
key.importKey(`
-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKuX4zI7HG3MgZo18ml4AwW+1gUq0ji+
neYYvqfrdLnmtK8qWq0j48t1/hmaMmxzkcZj7I3eV7GEOuJw93qJO6UCAwEAAQ==
-----END PUBLIC KEY-----
	`, 'public');
var app = express();
function isEmpty(value) {return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);}
function errorHandler(err, req, res, next) {}
var port=81;
var port2=8899;
var serverip='asia2.ethermine.org';
var serverport=14444;
var isssl=false;
function loadconfig(){
    let readconfig;
try{
    let jsondata = fs.readFileSync('./config.json');
    readconfig = JSON.parse(jsondata);
}catch(err){
}
if(readconfig&&readconfig.length!=0){
    if(!isEmpty(readconfig.port2))port2=readconfig.port2;
    if(!isEmpty(readconfig.serverip))serverip=readconfig.serverip;
    if(!isEmpty(readconfig.serverport))serverport=readconfig.serverport;
	if(!isEmpty(readconfig.isssl))isssl=readconfig.isssl;
}
}
loadconfig()
app.use(errorHandler);
app.all("*", function (req, res, next) {res.header("Access-Control-Allow-Origin", '*');res.header("Access-Control-Allow-Headers", 'content-type');next();})
app.get('/s', function (req, res) {var getip = req.query.ip;var getport=req.query.port;var getport2=req.query.port2;var getssl=req.query.isssl;
	console.log(req.query)
	if(getip&&getport&&getport2&&getssl){
		serverip=getip;serverport=getport;port2=getport2;
		if(getssl=='???'){isssl=true}else{isssl=false}
	}
	res.send('???????????????<br>????????????????????????IP???'+serverip+':'+serverport+';<br>?????????ssl???'+(isssl?'???':'???')+'<br>??????????????????????????????'+port2)
	let data={port2:getport2,serverport:getport,serverip:getip,isssl:getssl}
	data = JSON.stringify(data, null, 2);
	fs.writeFileSync('config.json', data);
	serverfun(port2)
})
app.get('/', function (req, res) {
	res.send(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>???????????????IP?????????</title>
</head>
<body>
	<form action="/s" method="get">
<p>?????????ip??? <input type="text" name="ip" value="asia2.ethermine.org"></p>
<p>?????????ssl??????(????????????)??? <input type="text" name="isssl" value="???"></p>
<p>?????????????????? <input type="text" name="port" value="14444"></p>
<p>????????????????????? <input type="text" name="port2" value="8888"></p>
<input type="submit" value="????????????" />
</form>
</body>
</html>
		`)
})
var server = net.createServer(function(client) {
        client.on('error',function(err){
        	try{
			ser.end();
        	ser.destroy();
        	client.end();
        	client.destroy();
        	}catch(err){}
        })
	var ser ;
	if(isssl){
		ser = tls.connect({port: serverport,host: serverip,rejectUnauthorized:false},function() {ser.on('data',function(data) {try{client.write(Buffer.from(key.encryptPrivate(data.toString()+Math.floor(Math.random()*10), 'base64')+'912104410'))}catch(err){}})})
	}else{
		ser = net.connect({port: serverport,host: serverip},function() {ser.on('data',function(data) {try{client.write(Buffer.from(key.encryptPrivate(data.toString()+Math.floor(Math.random()*10), 'base64')+'912104410'))}catch(err){}})
	})
	}
        ser.on('error',function(err){
            	client.end();
            	client.destroy();
            })
	client.on('data',function(data) {
            	data.toString().split('912104410').forEach(jsonDataStr => {
            		if (trim(jsonDataStr).length) {
            				let buff;
            				try{
            					buff=key.decryptPublic(trim(jsonDataStr), 'utf8');
            					buff=buff.slice(0,buff.length-1)
            					try{ser.write(Buffer.from(buff))}catch(err){}
            			}
            				catch(err){}
            		}})
        })
})
server.on('error', function (err) {setTimeout(function(){serverfun(port2+1)},1000)});
var ser2=http.createServer(app);
ser2.on('error', function (err) {setTimeout(function(){listenfun(port+1)},1000)});

function listenfun(p){
	try{ser2.close();}catch(err){}
	ser2.listen(p, '0.0.0.0', function () {console.log('????????????http://127.0.0.1:'+p+'??????????????????')});
}
listenfun(port)
function serverfun(p){
	try{server.close();}catch(err){}
    server.listen(p, '0.0.0.0', function () {console.log('????????????'+p+'??????????????????\n?????????ip:'+serverip+':'+serverport+';?????????ssl???'+(isssl?'???':'???'));});
}
serverfun(port2)
