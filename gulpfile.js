'use strict'

var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

/* watch */
gulp.task('watch', function () {
	gulp.watch('static/sass/*.scss', ['compass']);
	gulp.watch('**/*.html', ['bs-reload']); 
})

/* compass */
gulp.task('compass',  function(cb) {
	return gulp.src('static/sass/*.scss')
		.pipe($.compass({
			sass: 'static/sass',
			css: 'static/css'
		}))
		.pipe($.autoprefixer())
		.pipe(browserSync.reload({stream: true}));
});

/* web server */
gulp.task('browser-sync', function () {
    browserSync({
        notify: false,
        logPrefix: '服务启动',
        server: {
            baseDir: '.'
        }
    })
})

/* 实时刷新 */
gulp.task('bs-reload', function () {
    browserSync.reload();
})

gulp.task('default', ['watch', 'browser-sync']);
