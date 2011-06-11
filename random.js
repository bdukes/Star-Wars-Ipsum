/**
 * osrandom node package
 * Provides simple access to os sources of randomness
 */
var fs=require('fs');
 
var randomFileName='/dev/urandom';
	
function dummyRandom(byteCount, callback) {
	var err=new Error('No OS source of randomness found');
	if (callback) return callback(err);
	else throw err;
}

/**
 * By definition reads from /dev/urandom do not block.  Since they are just
 * a cpu-bound dip below the kernel barrier, we use sync functions.
 */
function openRandomDevice(deviceFileName) {
	var fd=fs.openSync(deviceFileName, 'r');
	return function(byteCount, callback) {
		var buffer=new Buffer(byteCount),
			offset=0,
			r;
		if (callback) {
			// Do it async
			return asyncRead();
		} else {
			// Synchronous
			while (offset<byteCount) {
				offset+=fs.readSync(fd, buffer, offset, byteCount-offset, null);
			}
			return buffer;
		}
		
		// -- helpers
		function asyncRead() {
			fs.read(fd, buffer, offset, byteCount-offset, null, function(err, bytesRead) {
				if (err) return callback(err);
				offset+=bytesRead;
				
				if (offset>=byteCount) return callback(null, buffer);
				
				asyncRead();
			});
		}
	};
}

function detect() {
	// Check for presence of randomDevice
	var randomStat;
	try {
		randomStat=fs.statSync(randomFileName);
	} catch (e) {
		randomStat=null;
	}
	
	if (randomStat&&randomStat.isCharacterDevice()) {
		return openRandomDevice(randomFileName);
	} 
	
	return dummyRandom;
}

module.exports=detect();



