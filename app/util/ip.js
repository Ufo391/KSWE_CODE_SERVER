
var os = require('os');
var ifaces = os.networkInterfaces();

function showServerIP(){
    
    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;
    
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }
    
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          console.log("ServerIP: " + ifname + ':' + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          console.log("ServerIP: " + ifname, iface.address);
        }
        ++alias;
      });
    
    });
  }

function initialize(server){
  
  var host = server.address().address
  var port = server.address().port

  console.log("Server listening at Port %s", port)
  showServerIP();
}

module.exports.initialize = initialize;