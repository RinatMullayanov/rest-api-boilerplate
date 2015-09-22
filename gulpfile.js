var gulp = require('gulp');
var clean = require('gulp-clean');
var order = require('gulp-order');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var babel = require("gulp-babel");
var eslint = require('gulp-eslint');

var server = require('./src/api.js');
var config = require('./src/config.json');

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
  return gulp.src(['src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(replace(/[',"]use strict[',"];/g, ''))
    .pipe(concat('all.js'))
    .pipe(header("'use strict';"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});


gulp.task('server', function () {
  server.start(config);
});

gulp.task('watch', ['server'], function () {
  gulp.watch(['src/*/**', 'src/*']).on('change', function (file) {
    // tell the browser that the file was updated
    console.log('changed: ' + file.path);
  });
});

gulp.task('default', ['watch'], function () {
  // place code for your default task here
});
