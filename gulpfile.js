const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-minify-css');
const concatCss = require('gulp-concat-css');
const gutil = require('gulp-util');
const  serve = require('gulp-serve');
const imagemin = require('gulp-imagemin');


gulp.task('build', [ 'js', 'images', 'css']);
gulp.task('serve', serve('./'));


gulp.task('css', function () { // en este caso no hay CSS que compilar
    gulp.src('app/**/*.css')
    .pipe(concatCss('css/minifyCSS.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist'))
});


gulp.task('js', function () {
  gulp.src('app/**/*.js')
    .pipe(concat("js/minifyJS.js"))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/img/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
  });
