// Include gulp and Our Plugins
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var jsLocation = 'lib/*.js', jsDestination = 'dist/';

gulp.task('scripts', function() {
    gulp.src(jsLocation)
    .pipe(rename('angular-stomp.min.js'))
    .pipe(uglify({
            mangle : false
        }))
    .pipe(gulp.dest(jsDestination));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(jsLocation, ['scripts']);
});

// Default Task
gulp.task('default', ['scripts']);