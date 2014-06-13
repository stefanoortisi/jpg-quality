# JPG Quality

JPG Quality is an Imagemagick wrapper which convert all the jpg of a directory with a certain quality.

## Requirements

Requires [ImageMagick](http://www.imagemagick.org), available via HomeBrew (`$ sudo brew install ImageMagick`) or MacPorts: (`$ sudo port install ImageMagick`).

## Installation

	npm install jpg-quality

## Usage
	
	bin/jpg-quality -i <input_directory> -o <output_directory> -q <quality>


## Paramaters

	-i <input_directory> : Required
	-o <output_directory> : Required
	-q <quality> : Optional (default value: 85)
