const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass");
const sasslint = require("gulp-sass-lint");
const prefix = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browsersync = require("browser-sync");
const del = require("del");
const rename = require("gulp-rename");
const phpGulp = require("gulp-php2html");
const jsimport = require("gulp-js-import-file");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const paths = {};

paths.assets = "./project/";

/* Template Tasks */
/* HTML file compilation */
function html() {
  return src("./*.html").pipe(dest(paths.assets));
}

function php() {
  return src(["./*.php"])
    .pipe(phpGulp())
    .pipe(dest(paths.assets));
}

/* CSS Tasks */
/* Linting main scss files without vendors folder */
function lintsass() {
  return src(["src/scss/*.scss", "!src/scss/vendors/*.scss"])
    .pipe(
      sasslint({
        configFile: "src/scss/.sasslintrc"
      })
    )
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
}

/* SCSS bundled into compressed CSS */
function css() {
  return src("src/scss/*.scss")
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(prefix())
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(dest(paths.assets + "css"));
}

/* Assets Tasks */
/* Copy Assets */
function copyAssets() {
  return src("src/assets/**/*.*",
    del(paths.assets + "assets/**"))
    .pipe(dest(paths.assets + "assets"));
}

/* JS Tasks */
/* JS bundled into min.js task */
function js() {
  return src(["src/js/**/*.js", "!src/js/vendors/**/*.js"], del(paths.assets + "assets/js/**"))
    .pipe(sourcemaps.init())
    .pipe(concat("_main.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(dest(paths.assets + "js"));
}

/* Copy JS components */
function copyJsComponents() {
  return src("src/js/components/**/*.*", del(paths.assets + "js/components/**"))
    .pipe(dest(paths.assets + "js/components/")
    );
}

/* Copy JS vendors */
function copyJsVendors() {
  return src(["src/js/vendors/**/*.*", "!src/js/vendors/vendors-bundle.js"], del(paths.assets + "js/vendors/**")).pipe(
    dest(paths.assets + "js/vendors/")
  );
}

/* JS vendors bundled */
function vendorsBundle() {
  return src(['src/js/vendors/**/*.js', '!src/js/vendors/jQuery/*.js'], del(paths.assets + "assets/js/vendors/**"))
    .pipe(sourcemaps.init())
    .pipe(concat("vendors-bundle.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(dest(paths.assets + "js"));
}

/* JS Vendors bundled into min.js task */
function vendorsJs() {
  return src(["src/js/vendors/**/*.js", "!src/js/vendors/vendors-bundle.js"], del(paths.assets + "assets/js/vendors/*.js"))
    .pipe(sourcemaps.init())
    .pipe(concat("vendors-bundle.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("maps"))
    .pipe(dest(paths.assets + "js"));

}

/* Server Start */
function browserSync() {
  browsersync({
    server: {
      baseDir: paths.assets
    },
    port: 3000
  });
}

/* Server Reload */
function browserReload() {
  return browsersync.reload;
}

/* Watch files on change */
function watchFiles() {
  /* Watch all design changes */
  watch("src/scss/**/*.*", series(lintsass, css)).on("change", browserReload());

  /* Watch javascript changes */
  watch("src/js/**/*.js", series(js, copyJsComponents, copyJsVendors, vendorsBundle)).on("change", browserReload());

  /* Watch templates changes */
  watch("./*.html", html).on("change", browserReload());
  watch("./*.php", php).on("change", browserReload());
}

const watching = parallel(watchFiles, browserSync);

exports.html = html;
exports.lintsass = lintsass;
exports.css = css;
exports.js = js;
exports.php = php;
exports.copyAssets = copyAssets;
exports.copyJsVendors = copyJsVendors;
exports.vendorsBundle = vendorsBundle;
exports.copyJsComponents = copyJsComponents;
exports.vendorsJs = vendorsJs;
exports.prod = series(html, php, lintsass, css, js, vendorsBundle, copyAssets);
exports.default = series(html, php, lintsass, css, js, copyJsComponents, copyJsVendors, vendorsBundle, vendorsJs, copyAssets, watching);
