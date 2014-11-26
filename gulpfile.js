var gulp = require('gulp');
var requireDir = require('require-dir');
var config = require('config');

// Load all tasks
requireDir('./gulp/tasks/', {recurse: true});

// Default task depending of loaded config
gulp.task('default', config.get('gulp.configTasks'));
