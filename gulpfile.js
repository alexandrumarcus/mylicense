var { src, gulp, series } = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

function browserSyncReload() {
  browserSync.init(null, {
    proxy: "http://localhost:5000",
    files: ["src/**/*.*"],
    port: 7000,
  })
}

function nodemon(cb) {
  var started = false;

  return nodemon({
    script: "app.js"
  }).on('start', function() {
    if(!started) {
      cb(); started = true;
    }
  })
}

exports.browserSyncReload = browserSyncReload;
exports.nodemon = nodemon;
exports.default = series(nodemon, browserSyncReload) 