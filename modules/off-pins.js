module.exports = {};

module.exports.offPin = function(pin, io, gpio) {
    gpio.write(pin, 0, function(){
	io.emit('off-success', pin);
    });
}
