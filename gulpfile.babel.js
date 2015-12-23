// Include gulp and Our Plugins
import gulp from 'gulp';
import coveralls from 'gulp-coveralls';

let jsLocation = 'lib/*.js',
    jsDestination = 'dist/';

gulp.task('scripts', function() {
    console.log('scripts');
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.start('scripts');
    gulp.watch(jsLocation, ['scripts']);
});


gulp.task('coveralls', () => {
    gulp.src('reports/coverage/phantomjs/lcov.info')
        .pipe(coveralls());
});

// Default Task
gulp.task('default', ['scripts']);
