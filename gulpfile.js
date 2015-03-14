// Include gulp and Our Plugins
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    ngAnnotate = require('gulp-ng-annotate'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    wrap = require('gulp-wrap');

var jsLocation = 'lib/*.js', jsDestination = 'dist/';

gulp.task('scripts', function() {
    gulp.src(jsLocation)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(wrap('(function(){\n<%= contents %>\n})();'))
    .pipe(ngAnnotate())
    .pipe(rename('angular-stomp.es5.js'))
    .pipe(gulp.dest(jsDestination))
    .pipe(uglify())
    .pipe(rename('angular-stomp.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsDestination));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(jsLocation, ['scripts']);
});

// Default Task
gulp.task('default', ['scripts']);