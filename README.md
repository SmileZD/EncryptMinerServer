# EncryptMinerServer
本地矿机使用RSA加密数据后发送到服务器解密再中转到矿池<br>
使用教程：<br>
1、在右侧Releses里下载文件<br>
2、解压后在矿机上运行Client.exe,会显示设置页面地址，然后在浏览器输入该地址进行设置，默认的设置页面为<http://127.0.0.1:80>，如果80端口被占用会自动往上加，访问这个地址进行服务器ip、端口和本地挖矿端口设置；可以在每台矿机上都运行，这样每台矿机的挖矿地址都为127.0.0.1:挖矿端口；如果局域网有os系统或者数量太多不想重复运行，则只需要局域网内有一台win系统电脑运行Client.exe就行了，但是别的矿机的挖矿地址要改成这台电脑的局域网地址(通常是192.168开头):挖矿端口；<br>
3、在中转服务器上运行Server.exe，和client.exe类似，默认的设置页面为<http://127.0.0.1:81>,如果81端口被占用会自动往上加，或者使用公网ip:81的方式外网访问；如果是Linu系统可以上传Server文件后nohup ./Server & exit是程序在后台运行；设置页面填的服务器ip为矿池ip，端口为矿池端口，比如e池：服务器ip：asia2.ethermine.org,服务器端口：14444；同时要将这里设置的本地挖矿端口填到矿机设置页面的端口里，矿机设置页面的服务器ip则填中转服务器公网ip地址，本地挖矿端口则是本地矿机挖矿软件里需要填的挖矿地址里的端口；<br>
4、源码已开源，源码里的密钥和公钥并非成品程序里使用的密钥公钥；<br>
5、该程序可以100%避免被运营商发现挖矿<br>
