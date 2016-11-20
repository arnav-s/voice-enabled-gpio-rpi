process.stdin.resume();
var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gpio = require('pi-gpio');

var onpin = require('./modules/on-pins.js');
var offpin = require('./modules/off-pins.js');

var on_pins = [];

gpio.open(11, 'output');
gpio.open(12, 'output');
gpio.open(13, 'output');
gpio.open(15, 'output');
gpio.open(16, 'output');

io.on('connection', function(socket) {
    console.log('Client Connected');
    for(var index = 0; index < on_pins.length; index++) {
	socket.emit('on-success', on_pins[index]);
    }

    socket.on('on', function(msg){
	console.log('on ' + msg); 
	onpin.onPin(msg, io, gpio);
	if (on_pins.indexOf(msg) == -1) {
	    on_pins.push(msg);
	}
    });

    socket.on('off', function(msg){
	console.log('off ' + msg);
	offpin.offPin(msg, io, gpio);
	var i = on_pins.indexOf(msg);
	if (i != -1) {
	    on_pins.splice(i, 1);
	}
    });
    
    socket.on('disconnect', function() {
	console.log('Client Disconnected');
    });
});


app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.use('/assets', express.static('assets'));

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function exitHandler(options, err) {
    gpio.close(11);
    gpio.close(12);
    gpio.close(13);
    gpio.close(15);
    gpio.close(16);

    if (options.cleanup)
	console.log('clean');
    if (err)
	console.log(err.stack);
    if (options.exit)
	process.exit();
};

process.on('exit', exitHandler.bind(null, {cleanup: true}));
process.on('SIGINT', exitHandler.bind(null, {exit: true}));
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));
