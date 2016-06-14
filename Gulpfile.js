// Gulp file

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');

var config = {
  dir: {
    src: 'src',
    dist: 'dist',
  },
  js: {
    glob: '*.js'
  }
};

// Check our code for errors
gulp.task('lint', function() {
  return gulp.src( config.dir.src + '/' + config.js.glob )
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Copy our code to dist folder
gulp.task('copy', function() {
  return gulp.src( config.dir.src + '/player.js')
    .pipe(gulp.dest('dist'));
});

// Compress (and copy) our code
gulp.task('compress', ['copy'], function() {
  return gulp.src( config.dir.src + '/' + config.js.glob )
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

// Styles
gulp.task('styles', function() {
  gulp.src('example/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest('example/css/'));
});

// Default task to do all the above
gulp.task('default', ['lint', 'compress']);