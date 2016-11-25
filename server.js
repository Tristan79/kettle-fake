'use strict';

var net = require('net');

var heating = false;
var keepwarm = false;
var t65 = false;
var t100 = false;
var t95 = false;
var t80 = false

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
        
        if (t65) {
          console.log('Sending temperature 65 status 0x65');
          socket.write("sys status 0x65\r");
        } else if (t80) {
          console.log('Sending temperature 80 status 0x80');
          socket.write("sys status 0x80\r");
        } else if (t95) {
          console.log('Sending temperature 95 status 0x95');
          socket.write("sys status 0x95\r");
        } else {
          console.log('Sending temperature 100 status 0x100');
          socket.write("sys status 0x100\r");
          t100 = true;
        }
        heating = true;
        break;
        
      case "set sys output 0x8":
        console.log('Received keep warm request');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending keep warm true status 0x11');
        socket.write("sys status 0x11\r");
        keepwarm = true;
        break;
        

      case "get sys status":
        console.log('Received status');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status' + (heating?" heating":"") + (keepwarm?" keepwarm":"") + (t65?" temperature 65":"") + (t80?" temperature 80":"")+ (t95?" temperature 95":"") + (t100?" temperature 100":""));
        var status = 0;
        
        if (heating) status += 1;
        if (keepwarm) status += 2;
        if (t65) status += 4;
        if (t80) status += 8;
        if (t95) status += 16;
        if (t100) status += 32;
        
        if (status == 0) socket.write("sys status key=\r");
        else socket.write("sys status key=" + String.fromCharCode(status) + "\r");
        break;


      case "set sys output 0x200":
        console.log('Received 65C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status temperature 65');
        socket.write("sys status 0x65\r");
        t65 = true;
        t80 = false;
        t95 = false;
        t100 = false;
        break;
        


      case "set sys output 0x4000":
        console.log('Received 80C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status temperature 80');
        socket.write("sys status 0x80\r");
        
        t65 = false;
        t80 = true;
        t95 = false;
        t100 = false;
        break;
        
        
        
      case "set sys output 0x2":
        console.log('Received 95C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status temperature 95');
        socket.write("sys status 0x95\r");
        t65 = false;
        t80 = false;
        t95 = true;
        t100 = false;
        break;
        
        
        
      case "set sys output 0x80":
        console.log('Received 100C');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status temperature 100');
        socket.write("sys status 0x100\r");
        t65 = false;
        t80 = true;
        t95 = false;
        t100 = false;
        break;
        
        

      case "set sys output 0x8005":
        console.log('Received Keepwarm 5 minutes');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status keepwarm 5 minutes');
        socket.write("sys status 0x8005\r");
        keepwarm = true;
        break;
        
        
    
        
      case "set sys output 0x8010":
        console.log('Received Keepwarm 10 minutes');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status keepwarm 10 minutes');
        socket.write("sys status 0x8010\r");
        keepwarm = true;
        break;
        
        
        
        
      case "set sys output 0x8020":
        console.log('Received Keepwarm 20 minutes');

        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending status keepwarm 20 minutes');
        socket.write("sys status 0x8020\r");
        keepwarm = true;
        break;
        
        
      case "set sys output 0x0":
        console.log('Received off request');
        
        if (!receivedHello) {
          console.log('WARNING: no HELLOKETTLE received.');
          return;
        }
        
        console.log('Sending off status');
        socket.write("sys status 0x0\r");
        heating = false;
        keepwarm = false;
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
