var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var webpack = require('gulp-webpack');
var wait = require('gulp-wait');
var protractor = require('gulp-protractor').protractor;
var del = require('del');
var runSequence = require('run-sequence');
var stylish = require('jshint-stylish');
var http = require('http');
var st = require('st');
var path = require('path');
var karma = require('karma').server;
var pkg = require('./package');
var jshintConfig = pkg.jshintConfig;

var BANNER = [
  '/**',
  ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
  ' * Copyright <%= new Date().getFullYear() %> - <%= pkg.author %>',
  ' * Licensed under <%= pkg.license %>',
  ' */',
  ''
].join('\n');

var PATH = {
  SOURCE: './src/',
  TEST: './test/',
  DEMO: './demo/',
  DIST: './dist/'
};

var SOURCE = {
  SCRIPTS: PATH.SOURCE + 'scripts/',
  STYLES: PATH.SOURCE + 'styles/',
};

var handleErr = function(err) {
  console.error('ERROR' + (err.fileName ? ' in ' + err.fileName : ':'));
  console.error(err.message);
  this.end();
};

gulp.task('clean', function(cb) {
  del([PATH.DIST], cb);
});

jshintConfig.lookup = false;
gulp.task('jshint', function() {
  return gulp.src(SOURCE.SCRIPTS + '*.js')
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter(stylish))
    .pipe(wait(1000))
    .pipe(livereload());
});

gulp.task('sass', function() {
  return gulp.src(SOURCE.STYLES + '*.scss')
    .pipe(sass()).on('error', handleErr)
    .pipe(gulp.dest(PATH.DIST))
    .pipe(wait(500))
    .pipe(livereload());
});

gulp.task('convert-and-concat', function() {
  return gulp.src([
      SOURCE.SCRIPTS + '*.js'
    ])
    .pipe(babel())
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('uglify', function() {
  return gulp.src(PATH.DIST + pkg.name + '.js')
    .pipe(uglify()).on('error', handleErr)
    .pipe(rename({
      basename: pkg.name,
      suffix: '.min'
    }))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('minify', function() {
  return gulp.src(PATH.DIST + pkg.name + '.css')
    .pipe(minifyCSS())
    .pipe(rename({
      basename: pkg.name,
      suffix: '.min'
    }))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('banner', function() {
  return gulp.src(PATH.DIST + '*')
    .pipe(header(BANNER, {
      pkg: pkg
    }))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('webpack', function() {
  return gulp.src(SOURCE.SCRIPTS + '*.js')
    .pipe(webpack({
      output: {
        path: __dirname + PATH.DEMO.substr(1),
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          loader: 'babel-loader'
        }]
      }
    }))
    .pipe(gulp.dest(PATH.DEMO));
});

gulp.task('reloadDemo', function() {
  return gulp.src(PATH.DEMO + '*.*')
    .pipe(livereload());
});

gulp.task('watch', ['server', 'webpack'], function() {
  livereload.listen({
    basePath: './',
    reloadPage: 'demo/index.html'
  });
  gulp.watch(SOURCE.SCRIPTS + '*.js', ['jshint', 'webpack']);
  gulp.watch(SOURCE.STYLES + '*.scss', ['sass']);
  gulp.watch(PATH.DEMO + '*.*', ['reloadDemo']);
});

var server;
gulp.task('server', function(cb) {
  server = http.createServer(
    st({
      path: __dirname,
      index: 'index.html',
      cache: false
    })
  ).listen(8080, cb);
});

gulp.task('test-unit', function(cb) {
  var config = {
    configFile: path.join(__dirname, '/test/karma.conf.js')
  };

  karma.start(config, function() {
    cb();
  });
});

gulp.task('test-e2e', ['server', 'webpack'], function() {
  return gulp.src([PATH.TEST + 'specs/e2e/*.js'])
    .pipe(protractor({
      configFile: path.join(__dirname, (process.env.TRAVIS) ?
        '/test/e2e.travis.conf.js' : '/test/e2e.conf.js'),
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    })).on('error', function(e) {
      server.close();
      throw e;
    }).on('end', function() {
      server.close();
    });
});

gulp.task('build', ['clean'], function(cb) {
  runSequence(
    'sass',
    'convert-and-concat',
    'uglify',
    'minify',
    'banner',
    'test-unit',
    'test-e2e',
    cb);
});

gulp.task('default', ['build']);
