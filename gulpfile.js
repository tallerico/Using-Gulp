/*------------ Modules ------------*/
const gulp = require('gulp');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const csso = require('gulp-csso');
const del = require('del');
const imagemin = require('gulp-imagemin');
const maps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

/*------------ Tasks ------------*/

//deletes all folders and files in dist
gulp.task('clean', function() {
  del('dist/*');
});

//concatinates applicable scripts into global.js and makes source maps
gulp.task('concatScripts', ['clean'], function () {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js'])
      .pipe(maps.init())
      .pipe(concat('global.js'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('./js'));
});

//runs 'concatScripts' as dependency, then minifies and saves them into dist/scripts
gulp.task('scripts', ['concatScripts'], function() {
  return  gulp.src("js/global.js")
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

//deletes all fils in dist/styles
gulp.task('cleanStyles', function() {
  del('dist/styles/*');
});

//runs 'cleanStyles' as dependency then creates sourcemaps and compiles sass to css
gulp.task('compileSass', ['cleanStyles'], function(){
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

//runs 'compileSass' as dependency then minifies css and reloads web server
gulp.task('styles', ['compileSass'], function() {
  return gulp.src('css/global.css')
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(connect.reload());
});

// compresses images and copies them to dist/content
gulp.task('images', ['clean'], function() {
  return gulp.src('images/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/content'));
});

//runs 'images', 'scripts', and 'styles' simultaneously
gulp.task('build', ['images', 'scripts', 'styles'], function() {
  console.log('Done with build...');
});

//runs build, then starts up a server on port 3000
gulp.task('connect', ['build'], function() {
  connect.server({
    port: 3000,
    livereload: true
  });
});

//runs 'connect', which runs 'build'.
//also watches all files in sass folder ending in .s*ss for changes
//and runs 'styles' then hot reloads web page when changes are found
gulp.task('default', ['connect'], function() {
  gulp.watch(['sass/**/**/*.s*ss'],['styles']);
});
