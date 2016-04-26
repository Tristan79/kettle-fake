'use strict';

var net = require('net');

var server = net.createServer(function (socket) {
  var receivedHello = false;
  
  socket.on('data', newLineStream(function (data) {
    switch (data) {
      case "HELLOKETTLE":
        console.log('Received HELLOKETTLE');

        if (receivedHello) {
          console.log('Already received HELLOKETTLE. Closing.');
          socket.end();
          return;
        }
        
        receivedHello = true;
        
        console.log('Sending HELLOAPP');
        socket.write('HELLOAPP\r');
        break;
        
      case "set sys output 0x4":
        console.log('Received boil request');

        if (!receivedHello) {
          console.log('No HELLOKETTLE received.  Closing.');
          socket.end();
          return;
        }
        
        console.log('Sending boiling status 0x5');
        socket.write("sys status 0x5\r");
        console.log('Sending temperature 100 status 0x100');
        socket.write("sys status 0x100\r");
        break;
        
      case "set sys output 0x0":
        console.log('Received off request');
        
        if (!receivedHello) {
          console.log('No HELLOKETTLE received.  Closing.');
          socket.end();
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

server.listen(2000);
console.log('Listening on port 2000');
