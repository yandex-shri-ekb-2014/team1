var _ = require('lodash');
var gulp = require('gulp');
var requireDir = require('require-dir');

if (_.isUndefined(process.env.NODE_CONFIG_DIR)) {
    process.env.NODE_CONFIG_DIR = './gulp/config';
}
var config = require('config');


requireDir('./gulp/tasks', {recurse: true});

gulp.task('default', config.get('gulp.default'));
