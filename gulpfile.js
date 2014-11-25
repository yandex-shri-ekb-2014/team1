// Define environment
var NODE_ENV;
var gulp = require('gulp');
var requireDir = require('require-dir');

// Check environment, if Undefined => set to development
if (!process.env.NODE_ENV) {
    NODE_ENV = 'development';
}

// Load data for tasks from config
var tasksData = require('./gulp/configs/' + NODE_ENV + '.json');

// Load all tasks
requireDir('./gulp/tasks/', {recurse: true});

// Default task depending of loaded config
gulp.task('default', tasksData.configTasks);
