import gulp from "gulp";
import jspm from 'jspm';
import sourcemaps from 'gulp-sourcemaps';
import ngAnnotate from 'gulp-ng-annotate';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import del from 'del';
import gzip from 'gulp-gzip';
import mkdirp from 'mkdirp';
import paths from '../paths';

gulp.task('build:pre-clean', (cb) => del([`${paths.releaseDir}/**/*`], cb));
gulp.task('build:create-folder', (cal) => mkdirp(paths.release.root, (err) => (err) ?  cal(new Error(err)) : cal()));

gulp.task('build:jspm', (cb) => {
    let options = {
        sourceMaps: true,
        globalDeps: { angular : 'angular', stompjs : 'stompjs' }
    };

    new jspm.Builder()
        .buildStatic(`${paths.app.entryPoint} - angular - stompjs`, `${paths.releaseDir}/${paths.app.name}.js`, options)
        .then(() => cb())
        .catch((ex) => cb(new Error(ex)));
});

gulp.task('build:js', () =>
    gulp.src(`${paths.releaseDir}/${paths.app.name}.js`)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.releaseDir))
);

gulp.task('build:post-clean', (cb) => del([`${paths.releaseDir}/${paths.app.name}.js.map`], cb));

gulp.task('build', (cal) => {
    runSequence(
        ['build:pre-clean'],
        ['build:create-folder'],
        ['build:jspm'],
        ['build:js'],
        ['build:post-clean'],
        cal);
});
