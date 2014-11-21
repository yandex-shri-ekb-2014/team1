// Include gulp
var gulp = require('gulp');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

// Include plugins
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var autoprefixer = require('gulp-autoprefixer');
//var uglifyjs = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var rimraf = require('gulp-rimraf');
var mocha = require('gulp-mocha');


// Set paths
var blocksPath = './blocks/**/*';
var publicPath = './desktop.bundles/index/';
var testPath = [
    './tests/server/*.js'
];
var scriptsPaths = [
    'gulpfile.js',
    'geoid.js',
    './server/*.js',
    './app/blocks/**/*.js'
];


// Include scripts task ( concat + uglify )
gulp.task('scripts', function () {
    return browserify('./app/browser/app.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        // Todo: fix uglify
        //.pipe(uglifyjs())
        .pipe(gulp.dest(publicPath));
});

// Include styles task ( concat + stylus + autoprefixer + minify )
gulp.task('styles', function () {
    gulp.src(blocksPath + '.styl')
        .pipe(concat('index.styl'))
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: ['> 0%']
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(publicPath));
});


// Include mocha task
gulp.task('mocha', function () {
    return gulp.src(testPath, {read: false})
        .pipe(mocha({reporter: 'spec', timeout: 10000}));
});

gulp.task('test', ['mocha']);


// Include jshint task
gulp.task('jshint', function () {
    return gulp.src(scriptsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Include jscs task
gulp.task('jscs', function () {
    return gulp.src(scriptsPaths)
        .pipe(jscs());
});

// Include lint task
// Todo: need lint JSX files...
gulp.task('lint', ['jshint', 'jscs']);


// Include js & css watch task
gulp.task('watch', function () {
    gulp.watch(blocksPath + '.styl', function () {
        gulp.run('styles');
    });
    gulp.watch(blocksPath + '.js' , function () {
        gulp.run('scripts');
    });
});


// Include clear task
gulp.task('clear', function () {
    return gulp.src(publicPath)
    .pipe(rimraf());
});



// Default task
gulp.task('default', ['styles', 'scripts', 'mocha' , 'lint' , 'watch']);
