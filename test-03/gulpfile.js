var browserify = require('browserify'),
    sourcestram = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcebuffer = require('vinyl-source-buffer'),
    uglify = require('gulp-uglify'),
    size = require('gulp-size'),
    gulp = require('gulp');

// 使用vinyl-source-stream，直接将Node Stream转成Vinyl File Object Stream文件，再用vinyl-buffer将Vinyl File Object Stream文件转成Buffer文件
gulp.task('build-01', function () {
    var b = browserify('./index.js');

    return b.bundle()
        .pipe(sourcestram('index-01.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('dist/'))
});

// 使用vinyl-source-buffer，直接将Node Stream转成Buffer文件
gulp.task('build-02', function () {
    var b = browserify('./index.js');

    return b.bundle()
        .pipe(sourcebuffer('index-02.js'))
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('dist/'))
});

gulp.task("default", ['build-01','build-02']);