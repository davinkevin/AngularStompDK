/**
 * Created by kevin on 27/12/2015.
 */
import gulp from 'gulp';
import coveralls from 'gulp-coveralls';
import paths from '../paths';

gulp.task('coveralls', () =>
    gulp.src(paths.coverage.lcovfile)
        .pipe(coveralls())
);