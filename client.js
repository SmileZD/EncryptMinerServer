var NodeRSA = require('node-rsa');
var net = require('net');
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
var port=80;
var port2=8888;
var serverip='127.0.0.1';
var serverport=8899
function loadconfig(){
    let readconfig;
try{
    let jsondata = fs.readFileSync('./config.json');
    readconfig = JSON.parse(jsondata);
}catch(err){
    console.log('加载配置文件出错:',err)
}
if(readconfig&&readconfig.length!=0){
    if(!isEmpty(readconfig.port2))port2=readconfig.port2;
    if(!isEmpty(readconfig.serverip))serverip=readconfig.serverip;
    if(!isEmpty(readconfig.serverport))serverport=readconfig.serverport;
}
}
loadconfig()
var app = express();
function isEmpty(value) {return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);}
function errorHandler(err, req, res, next) {}

app.use(errorHandler);
app.all("*", function (req, res, next) {res.header("Access-Control-Allow-Origin", '*');res.header("Access-Control-Allow-Headers", 'content-type');next();})
app.get('/s', function (req, res) {var getip = req.query.ip;var getport=req.query.port;var getport2=req.query.port2;
	if(getip&&getport&&getport2){serverip=getip;serverport=getport;port2=getport2}
	res.send('修改成功！当前服务器IP：'+serverip+':'+serverport+';当前本地挖矿地址为：127.0.0.1:'+port2)
	let data={port2:getport2,serverport:getport,serverip:getip}
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
	<title>配置服务器IP和端口</title>
</head>
<body>
	<form action="/s" method="get">
<p>服务器ip： <input type="text" name="ip" value="127.0.0.1"></p>
<p>服务器端口： <input type="text" name="port" value="8899"></p>
<p>本地挖矿端口： <input type="text" name="port2" value="8888"></p>
<input type="submit" value="确认修改" />
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
		var ser = net.connect({port: serverport,host: serverip},function() {
            		ser.on('data',function(data) {
            			console.log(data.toString())
            			data.toString().split('912104410').forEach(jsonDataStr => {if (trim(jsonDataStr).length) {
            				let buff;
            				try{
            					buff=key.decryptPublic(trim(jsonDataStr), 'utf8');
            					buff=buff.slice(0,buff.length-1)
            					try{client.write(Buffer.from(buff))}catch(err){}
            			}
            				catch(err){}
            		}})})

	    	})
		ser.on('error',function(){
            		client.end();
            		client.destroy();
            	})
	client.on('data',function(data) {
		console.log(data.toString())
	    	try{ser.write(Buffer.from(key.encryptPrivate(data.toString()+Math.floor(Math.random()*10), 'base64')+'912104410'))}catch(err){}
        })
})
server.on('error', function (err) {setTimeout(function(){serverfun(port2+1)},1000)});
var ser2=http.createServer(app);
ser2.on('error', function (err) {setTimeout(function(){listenfun(port+1)},1000)});
function listenfun(p){
	try{ser2.close();}catch(err){}
	ser2.listen(p, '0.0.0.0', function () {console.log('当前使用http://127.0.0.1:'+p+'作为设置页面')});
}
listenfun(port)
function serverfun(p){
	try{server.close();}catch(err){}
    server.listen(p, '0.0.0.0', function () {console.log('当前使用127.0.0.1:'+p+'作为挖矿地址');});
}
serverfun(port2)
