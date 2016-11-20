module.exports = {};
module.exports.onPin = function (pin, io, gpio) {
    gpio.write(pin, 1, function(){
	io.emit('on-success', pin);
    });
}
