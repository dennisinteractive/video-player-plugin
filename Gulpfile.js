// Gulp file

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

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

// Copy our uncompiled code to dist folder
gulp.task('copy', function() {
  return gulp.src( config.dir.src + '/player.js')
    .pipe(gulp.dest('dist'));
});

// Compress (and copy) our code
gulp.task('js', ['lint', 'copy'], function() {
  return gulp.src( config.dir.src + '/' + config.js.glob )
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('css-watch', ['example-styles', 'styles'], browserSync.reload);

// Example Styles
gulp.task('example-styles', function() {
  gulp.src('example/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest('example/css/'));
});

// Player Styles
gulp.task('styles', function() {
  gulp.src('src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest('dist'));
});

// Boot up server to look at examples
gulp.task('serve', ['js', 'example-styles', 'styles'], function() {
  browserSync.init({
    server: {
      baseDir: "./example"
    }
  });

  gulp.watch('src/*.js', ['js-watch']);
  gulp.watch('**/*.scss', ['css-watch']);
  gulp.watch('**/*.html').on('change', browserSync.reload);

});

// Default task to do all the above
gulp.task('default', ['example-styles', 'lint', 'js']);
