/*jslint node: true */
'use strict';

/**
# Gulp File
* Install `yarn` if you haven't already https://yarnpkg.com/en/docs/install
* Run `yarn` on the command line to install `gulp` and other prerequisites
* Run `gulp` on the command line to compile LESS files and watch them for changes
* Or run `gulp build-less` to build LESS files to CSS once and then exit
*/

// Include Gulp plugins
var gulp = require('gulp'),
  gutil = require('gulp-util'), // useful Gulp tools, used here for color text on console
  clean = require('gulp-clean'), // deletes files and directories
  rename = require('gulp-rename'), // renames files
  less = require('gulp-less'), // compiles LESS CSS
  sourcemaps = require('gulp-sourcemaps'), // helps browsers show the original source location of code
  watch = require('gulp-watch'), // monitors files for changes
  plumber = require('gulp-plumber'), // lets gulp-watch recover from errors
  autoprefix = require('gulp-autoprefixer'), // applies browser prefixes based on data from caniuse.com
  svgstore = require('gulp-svgstore'), // combines SVGs into a sprite sheet
  svgmin = require('gulp-svgmin'), // minifies SVGs to save filesize
  notify = require('gulp-notify'), // pops up OS notifications
  path = require('path'),
  spawn = require('child_process').spawn,
// Define source and destination paths
  paths = {
    src_less: 'src/themes/eos/styles/',
    dest_css: 'src/themes/eos/static/css/',
    src_icons: 'src/themes/eos/icons/',
    dest_icons: 'src/themes/eos/layouts/partials/generated/'
  };

// Error handler, prints the error on the console and pops up a notification bubble
var onError = function (error, task) {
  var fileName = (error.fileName) ? error.fileName + ' -- ' : '',
    lineNumber = (error.lineNumber) ? 'line ' + error.lineNumber + ' -- ' : '',
    pluginName = (error.plugin) ? ': [' + error.plugin + ']' : '[' + task + ']',
    report = '',
    chalk = gutil.colors.white.bgRed;

  notify({
    title: 'Task Failed ' + pluginName,
    message: fileName + lineNumber + 'See console.'
  }).write(error);

  gutil.beep();

  report += chalk('TASK:') + pluginName + '\n';
  report += chalk('ERROR:') + ' ' + error.message + '\n';
  if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
  if (error.fileName) { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }

  console.error(report);
};

gulp.task('clean:less', function () {
  return gulp.src([
    paths.dest_css + 'bundle.css',
    paths.dest_css + 'bundle.css.map'
  ], {read: false})
    .pipe(clean());
});

// Compile LESS to CSS
gulp.task('build:less', function () {
  return gulp.src(paths.src_less + 'bundle.less')
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: function (error) { onError(error, 'LESS'); }
    }))
    .pipe(less({
      paths: [paths.src_less]
    }))
    .pipe(autoprefix({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename('bundle.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dest_css)); // path to css directory
});

// Watch for changes in source folders and run their build tasks
gulp.task('watch', ['build:less', 'build:icons'], function () {
  gulp.watch(paths.src_less + '**/*', ['build:less']);
  gulp.watch(paths.src_icons + '**/*', ['build:icons']);
});

gulp.task('clean:icons', function () {
  return gulp.src(paths.dest_icons + 'icons.svg', {read: false})
    .pipe(clean());
});

// Combine SVG icons into a sprite-sheet to be embedded in the page
gulp.task('build:icons', function () {
  return gulp.src(paths.src_icons + '**/*.svg')
    .pipe(svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      };
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('icons.svg'))
    .pipe(gulp.dest(paths.dest_icons));
});

gulp.task('clean:site', function () {
  return gulp.src('./build', {read: false})
    .pipe(clean());
});

// Run `hugo` build command in a child process
gulp.task('build:site', ['clean:site', 'build:less', 'build:icons'], function () {
  var child = spawn("hugo", ["-s", "./src", "-d", "../dist"], {cwd: process.cwd()}),
    stdout = '',
    stderr = '';

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', function (data) {
    stdout += data;
    console.log(data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    stderr += data;
    console.error(gutil.colors.red(data));
    gutil.beep();
  });

  child.on('close', function (code) {
    gutil.log("Done with exit code", code);
  });
});

// Default will run the 'entry' task
gulp.task('default', ['watch']);
