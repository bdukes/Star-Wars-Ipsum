exports.getRandomInteger = function(min, count) {
	return min + Math.floor(Math.random() * (count - min));
};
