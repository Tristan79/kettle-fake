'use strict';

var net = require('net');

var server = net.createServer(function (socket) {
  var receivedHello = false;
  
  socket.on('data', newLineStream(function (data) {
    switch (data) {
      case "HELLOKETTLE":
        console.log('Received HELLOKETTLE');

        if (receivedHello) {
          console.log('WARNING: received duplicate HELLOKETTLE.');
          return;
        }
        
        receivedHello = true;
        
        console.log('Sending HELLOAPP');
        socket.write('HELLOAPP\r');
        break;
        
      case "set sys output 0x4":
        console.log('Received boil request');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending boiling status 0x5');
        socket.write("sys status 0x5\r");
        console.log('Sending temperature 100 status 0x100');
        socket.write("sys status 0x100\r");
        break;
        
      case "set sys output 0x8":
        console.log('Received keep warm request');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending keep warm true status 0x11');
        socket.write("sys status 0x11\r");
        break;
        

      case "get sys status":
        console.log('Received status');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status key=!\r");
        break;


      case "set sys output 0x200":
        console.log('Received 65C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status 0x65\r");
        break;
        


      case "set sys output 0x4000":
        console.log('Received 80C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status 0x80\r");
        break;
        
        
        
      case "set sys output 0x2":
        console.log('Received 95C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status 0x95\r");
        break;
        
        
        
      case "set sys output 0x80":
        console.log('Received 100C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status 0x100\r");
        break;
        
        

      case "set sys output 0x8005":
        console.log('Received Keepwarm 5 minutes');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status 0x8005\r");
        break;
        
        
    
        
      case "set sys output 0x8010":
        console.log('Received Keepwarm 10 minutes');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status 0x8010\r");
        break;
        
        
        
        
      case "set sys output 0x8020":
        console.log('Received Keepwarm 20 minutes');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status !');
        socket.write("sys status 0x8020\r");
        break;
        
        
      case "set sys output 0x0":
        console.log('Received off request');
        
        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending off status 0x0');
        socket.write("sys status 0x0\r");
        break;
        
      default:
        console.log('Received unknown data: ' + data);
        break;
    }
  }));
  
  function newLineStream(callback) {
    var buffer = '';
    return (function (chunk) {
      var i = 0, piece = '', offset = 0, nl = '';
      buffer += chunk;
      while ( (i = buffer.indexOf((nl = '\r\n'), offset)) !== -1 ||
              (i = buffer.indexOf((nl = '\n'), offset)) !== -1 ||
              (i = buffer.indexOf((nl = '\r'), offset)) !== -1 ) {
        piece = buffer.substr(offset, i - offset);
        offset = i + nl.length;
        callback(piece);
      }
      buffer = buffer.substr(offset);
    });
  }
});

var port = process.env['KETTLEPORT'] || 2000;
server.listen(port);
console.log('Listening on port ' + port);
