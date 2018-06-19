var fs = require("fs");
var source = require('vinyl-source-stream');
var gulp = require('gulp');

var nodeStream = fs.createReadStream("source.txt");

gulp.task("default", function(){
	nodeStream
    	.pipe(source("target.txt"))
    	.pipe(gulp.dest("dist/"));
});