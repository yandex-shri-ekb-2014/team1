// Define environment
var environment;
var gulp = require('gulp');
// var loadTasks = require('gulp-load')(gulp);
var requireDir = require('require-dir');

// Check environment, if Undefined => set to development
if (!process.env.environment) {
    environment = 'development';
}

// Load data for tasks from config
var tasksData = require('./gulp/configs/' + environment + '.json');

// Load all tasks
requireDir('./gulp/tasks/', {recurse: true});

console.log(tasksData);
// Default task depending of loaded config
gulp.task('default', tasksData.configTasks);
