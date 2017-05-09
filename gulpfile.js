var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    exec = require('child_process').exec;

gulp.task('develop', function () {
  var env = process.env.NODE_ENV || 'development'

  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js jade'
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

gulp.task('default', [
  'develop'
]);
