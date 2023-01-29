var port = 6000;
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

var servers = [];



function getName(rinfo) {
    for (var server in servers) {
        server = JSON.parse(server);
        var ip = server[2];
        var name = server[0]
        if (ip == rinfo) {
            return name;
        }
        
    }
}


function getGamemode(rinfo) {
    for (var server in servers) {
        server = JSON.parse(server);
        var ip = server[2];
        var gamemode = server[1];
        if (ip == rinfo) {
            return gamemode;
        }
        
    }
}


tempName = "";
tempGamemode = "";


server.on("message",function(msg, rinfo)
{
    data = String(msg);
    
    console.log("data: " + String(msg)); 
    if (data.includes("NAME")) {
        tempName = data.replace("NAME:", "");
    } 
    if (data.includes("GAMEMODE")) {    
        tempGamemode = data.replace("GAMEMODE:", "");

        if (tempName.length > 32) {
            console.log(rinfo.address + " has a large name!");
            return;
        }

        if (tempGamemode.length > 16) {
            console.log(rinfo.address + " has a large gamemode!");
            return;
        }

        if (rinfo.address == "127.0.0.1") {
            console.log(rinfo.address + " is a localhost!");
            //return;
        }

        if (tempName.includes("#")) {
            console.log(rinfo.address + " has an invalid character!");
            return;
        }

        if (tempGamemode.includes("#")) {
            console.log(rinfo.address + " has an invalid character!");
            return;
        }


        if (tempName != "") {
            servers[JSON.stringify([tempName, tempGamemode, String(rinfo.address)])] = true;
            console.table(servers);
        } else {
            console.log("Unable to parse name for " + rinfo.address + " !");
        }
    } 
    if (data.includes("GET_LIST")) {
        var info = {
            "name": getName(rinfo.address),
            "gamemode": getGamemode(rinfo.address),
            "ip": String(rinfo.address) 

        };
        server.send(JSON.stringify(info), rinfo.port, rinfo.address);
    }
    
});



    server.on('listening', () => {
        const address = server.address();
        console.log(`started server: ${address.address}:${address.port}`);
      });


server.bind(port, "3.125.183.140");
