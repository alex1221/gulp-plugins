var gulp = require('gulp'),
	gutil = require('gulp-util');

gulp.task("default", function() {
    return gulp.src(["./src/**/1.scss"])
        // .pipe(sass())
        // .on("error", function(error) {
        //     console.log(error.toString());
        //     this.emit("end");
        // })
        .on('error', gutil.log)
        .pipe(gulp.dest("./dist"));
});