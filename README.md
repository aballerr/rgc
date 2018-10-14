## React Client Tool
A simple (customizable) react client tool to help you quickly generate your components.

![Build Status](https://img.shields.io/badge/dependencies-up_to_date-brightgreen.svg)  ![Build Status](https://img.shields.io/badge/dev_dependencies-up_to_date-brightgreen.svg)
![Build Status](https://img.shields.io/badge/npm-v6.2.4-blue.svg) ![Build Status](https://img.shields.io/badge/license-MIT-green.svg)



Please send feedback to: aball9423@gmail.com
Thanks!

The purpose of this node module is to be a simple react client tool.  For now, it only generates components.  It has limited configuration currently. This is still in beta, so any feedback would be greatly appreciated! 

## Installation
	$npm install -g rgc
## Prerequisites
I haven't had time to test its backward comparability yet, but it's compatible for node v6.14.4 at the least


### Usage:

	$rgc --help

### Generating a new component
    $rgc new COMPONENT_NAME
    
    Options:
        -p, --pure               it will create a pure component
        -d, --dir                it will place the file in it's own directory
        -o, --overwrite          it will overwrite files if they exist
        -s, --style [extension]  it will aditionally create a file sheet
        -h, --help               output usage information
         
### Setting Config Options
	$rgc config
### To Print Config Options
	$rgc print

  

## Options:

-V, --version Output the version number

-p, --pure Create a Pure Component

-h, --help Output usage information

  
  


