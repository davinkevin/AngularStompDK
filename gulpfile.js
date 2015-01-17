// Include gulp and Our Plugins
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    ngmin = require('gulp-ngmin');

var jsLocation = 'lib/*.js', jsDestination = 'dist/';

gulp.task('scripts', function() {
    gulp.src(jsLocation)
    .pipe(plumber())
    .pipe(rename('angular-stomp.min.js'))
    .pipe(ngmin())
    .pipe(uglify({
            mangle : true
        }))
    .pipe(gulp.dest(jsDestination));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(jsLocation, ['scripts']);
});

// Default Task
gulp.task('default', ['scripts']);