#!/usr/bin/env node
var argv  = require( 'minimist' )( process.argv.slice(2)),
	spawn = require('child_process').spawn,
	fs    = require( 'fs' ),
	path  = require( 'path' ),
	async = require('async');


var config = {
	extensions : [ 'jpg', 'jpeg' ],
	quality: 85
}



if( typeof argv[ 'i' ] == "undefined" || typeof argv[ 'o' ] == "undefined" ) {
	console.error( 'Parameter --folder missing.' );
	return 
}	

var input_folder = argv.i;
var output_folder = argv.o;

var quality = config.quality;

if( typeof argv[ 'q' ] != "undefined" ) {
	quality = argv[ 'q' ];
}


var files = get_files( input_folder );
var counter = 0;
var filepath;


convert( files[ 0 ], on_image_converted );


function on_image_converted() {
	counter++;
	console.log( 'Converting: ', counter + '/' + files.length )
	if( files.length == counter ){
		on_images_converted();
	} else {
		convert( files[ counter ], on_image_converted );		
	}
}


function on_images_converted() {
	readSizeRecursive( input_folder, function(err, total_input){
		readSizeRecursive( output_folder, function(err, total_output){
			var saved = (total_input - total_output) / 1000
			console.log( "Images Processed: " + files.length + " - Saved: " + saved.toFixed() + " KB.");
		} );
	} );
}



function convert( image, callback ) {
	// var cmd = "convert -strip -interlace Plane -gaussian-blur 0.05 -quality 50% " + input_folder + "/" + image + " " + output_folder + "/" + image
	var cmd = "convert"
	var params = "-strip -interlace Plane -gaussian-blur 0.05 -quality " + quality + " % " + input_folder + "/" + image + " " + output_folder + "/" + image
	var params = params.split( " " );

	var child = spawn( cmd, params );

	child.on('exit', function(chunk) {
		callback();
	});
}



function get_files( dir ) {
	var files = fs.readdirSync( dir );
	var output = []
	for( i in files ) {
		if( config.extensions.indexOf( path.extname( files[i] ).substring(1) ) >= 0 ){
			output.push( files[ i ] );
		} else {
			console.log( "File skipped: " + files[ i ] );
		}
	}
	return output;
}



function readSizeRecursive(item, cb) {
	fs.lstat(item, function(err, stats) {
		var total = stats.size;

		if (!err && stats.isDirectory()) {
			fs.readdir(item, function(err, list) {
				if (err) return cb(err);

				async.forEach(
					list,
					function(diritem, callback) {
						readSizeRecursive(path.join(item, diritem), function(err, size) {
							total += size;
							callback(err);
						}); 
					},  
					function(err) {
						cb(err, total);
					}   
				);  
			}); 
		}   
		else {
			cb(err, total);
		}   
	}); 
}