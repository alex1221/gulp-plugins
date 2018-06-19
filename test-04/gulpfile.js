var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    notifier = require('node-notifier');

var logError = function (err) {
    notifier.notify({
        title: 'test-04',
        message: 'Error:' + err.message
    })
};

// 默认不处理，出现错误，会中断gulp
gulp.task("default", function() {
    return gulp.src(["./src/**/*.scss"])
        .pipe(sass())
        .pipe(gulp.dest("./dist"));
});

// 用on事件监听，自己定义错误处理函数
gulp.task("error1", function() {
    return gulp.src(["./src/**/*.scss"])
        .pipe(sass())
        .on("error", function(error) {
            console.log(error.toString());
            this.emit("end");
        })
        .pipe(gulp.dest("./dist"));
});

// 用on事件监听，用gulp-util的.log()方法
gulp.task("error2", function() {
    return gulp.src(["./src/**/*.scss"])
        .pipe(sass())
        .on("error", gutil.log)
        .pipe(gulp.dest("./dist"));
});

// 用on事件监听，用notifier的.notify()方法，个人喜欢这一种。
gulp.task("error3", function () {
    return gulp.src(["./src/**/*.scss"])
        .pipe(sass())
        .on('error', logError)
        .pipe(gulp.dest("./dist"));
});