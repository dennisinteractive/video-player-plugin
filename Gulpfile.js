// Gulp file

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var gulp   = require('gulp');

gulp.task('compress', ['copy'], function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('copy', function() {
   return gulp.src('src/player.js')
   .pipe(gulp.dest('dist'));
});
