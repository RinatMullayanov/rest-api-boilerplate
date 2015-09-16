var gulp = require("gulp");
var rename = require("gulp-rename");
var header = require('gulp-header');
var replace = require('gulp-replace');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

var browserify = require('browserify');
var source = require('vinyl-source-stream');

var eslint = require('gulp-eslint');

var config = {
  srcDir: 'src',
  distDir: 'dist',
  //https://babeljs.io/docs/usage/polyfill/ for enable support https://babeljs.io/docs/learn-es2015/#generators
  polyfill: './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js'
};

gulp.task('eslint', function () {
    return gulp.src(['src/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint({
          configFile: './.eslintrc'
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());
});

gulp.task('babel-node', function () {
  //http://babeljs.io/docs/usage/polyfill/#usage-in-node-browserify
  return gulp.src([config.polyfill, 'src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(replace(/[',"]use strict[',"];/g, ''))
    .pipe(concat('all.js'))
    .pipe(header("'use strict';"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.distDir));
});

gulp.task('babel-browser', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(replace(/[',"]use strict[',"];/g, ''))
    .pipe(concat('all-browser.js'))
    .pipe(header("'use strict';"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.distDir));
});

gulp.task("babel-for-browserify", function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest(config.distDir));
});

gulp.task('copy-polyfill', function () {
  return gulp.src(config.polyfill)
    .pipe(gulp.dest(config.distDir));
});

gulp.task('like-babelify', ['babel-browser', 'babel-for-browserify', 'copy-polyfill'], function() {
  return browserify('./dist/all-browser.js', { debug: true }) // enable sourceMap inside bundle.js file
    .bundle()
    .pipe(source(config.distDir + '/bundle.js'))
    .pipe(gulp.dest(function(file) {
      return file.base;
    }));
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js'], ['like-babelify']);
});

gulp.task('default', ['like-babelify'], function () {
});