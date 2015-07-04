// Include gulp and Our Plugins
import gulp from 'gulp';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import plumber from 'gulp-plumber';
import ngAnnotate from 'gulp-ng-annotate';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import wrap from 'gulp-wrap-js';
import packagejson from './package.json';

let jsLocation = 'lib/*.js',
    jsDestination = 'dist/';

let version = packagejson.version;

gulp.task('scripts', function() {
    gulp.src(jsLocation)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(wrap(`/*! AngularStompDK v${version} */
                    (function() {%= body %})()`))
        .pipe(ngAnnotate())
        .pipe(rename('angular-stomp.js'))
        .pipe(gulp.dest(jsDestination))
        .pipe(uglify({ preserveComments : 'some' }))
        .pipe(rename('angular-stomp.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsDestination));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.start('scripts');
    gulp.watch(jsLocation, ['scripts']);
});

// Default Task
gulp.task('default', ['scripts']);
