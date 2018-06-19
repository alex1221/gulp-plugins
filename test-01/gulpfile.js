var gulp = require("gulp");

gulp.task("css", function(){
    gulp.src("./src/**/*.css")
        .pipe(gulp.dest("dist/"));
});

gulp.task("default", ['css']);