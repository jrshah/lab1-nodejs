#! /usr/bin/env node
'use strict'
require('./helper')
let _ = require("lodash")
let path = require("path")
let fs = require('fs').promise
let co = require('co')

let argv = require('yargs').default('dir', __dirname).argv
let dir = argv.dir

// let {dir} = require('yargs')
// 	.default('dir', __dirname)
// 	.argv

// bonusls = wrap(bonusls)

let ls = co.wrap(function*(rootpath) {
  
  // Your implementation here
  let filenames = yield fs.readdir(rootpath)

  for (let file of filenames){
  	
  	let filePath = path.join(rootpath, file)
  	let status = yield fs.stat(filePath)

  	if (status.isDirectory()){
  		process.stdout.write("Directory :: " + file + "\n")  		
  		ls(filePath)
  	} else {
  		process.stdout.write(file + "\n")  		
  	}
  }
  
})


let bonusls = co.wrap(function*(rootpath) {
  
  // Your implementation here
  let filenames = yield fs.readdir(rootpath)

  let lsPromises = []
  	
  for (let file of filenames){
  	
  	let filePath = path.join(rootpath, file)
  	let status = yield fs.stat(filePath)


  	if (status.isDirectory()){
  		let promise = bonusls(filePath)
  		lsPromises.push(promise)
  	} 
  	else {
  		lsPromises.push(file)
  	}
  	

  }
  return yield Promise.all(lsPromises)
  
})

function* main() {
	// Use 'yield' in here
	console.log('Executing ls function...')
	//yield ls(dir)
  	
  	let filePaths = _.flatten(yield bonusls(dir))

  	for(let file of filePaths) {
  		process.stdout.write(file + "\n")
  	}

}

module.exports = main
