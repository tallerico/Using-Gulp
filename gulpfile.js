const gulp = require('gulp');
const concat = require('gulp-concat');
const imagemin = require('imagemin');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const del = require('del');
const csso = require('gulp-csso');

gulp.task('clean', function() {
  del('dist/*');
});

gulp.task('concatScripts', function () {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js'])
      .pipe(maps.init())
      .pipe(concat('global.js'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('./js'));
});

gulp.task('scripts', ['concatScripts'], function() {
  return  gulp.src("js/global.js")
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('compileSass', function(){
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

gulp.task('styles', ['compileSass'], function(){
  return gulp.src('css/global.css')
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'));
});
