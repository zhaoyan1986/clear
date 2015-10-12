//'use strict';

var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sprity = require('sprity');
var program = require('commander');
var $ = require('gulp-load-plugins')();



var project = 'cleardemo';

// 命令行参数
// 定义参数,以及参数内容的描述
program
	.version('0.0.1')
	.usage('[options] [value ...]')
	.option('-p, --project <string>', 'input a string arg');
//解析commandline arguments
program.parse(process.argv);
if (program.project) {
	project = program.project;
}

//
const sassPath = project + '/static/sass';
const es6Path = project + '/static/es6/**/*.js';
const cssPath = project + '/static/css';
const jsPath = project + '/static/js';
const imgPath = project + '/static/img';

/* web server */
gulp.task('browser-sync', function() {
	browserSync({
		logPrefix: '服务启动',
		server: {
			baseDir: './' + project
		}
	});
});

/* 实时刷新 */
gulp.task('bs-reload', function() {
	gulp.src(['*/*.html', project + '/static/js/**/*.js']).pipe(browserSync.reload({
		stream: true
	}));
});

/* sass */
var sassOptions = {
	outputStyle: 'expanded',
	indentType: 'tab',
	indentWidth: 1,
}
var sassFile;
gulp.task('sass', function() {
	var src = sassFile || sassPath + '/**/*.scss';
	return gulp.src(src)
		.pipe($.sass(sassOptions))
		.on('error', function(e) {
			$.util.log($.util.colors.red('Error: ' + e.message.replace(/\n/g, '')));
			this.emit('end');
		})
		.pipe($.autoprefixer())
		.pipe(gulp.dest(project + '/static/css'))
		.pipe(reload({
			stream: true
		}));
});

/* sprite */
gulp.task('sprite', function() {
	return sprity.src({
			src: imgPath + '/sprites/**/*.png',
			split: true,
			style: 'sprite.scss',
			processor: 'sass'
		})
		.pipe($.if('*.png', gulp.dest(imgPath), gulp.dest(sassPath)));
});

/* babel */
var es6File;
gulp.task('babel', function(res) {
	var src = es6File || es6Path;
	return gulp.src(src)
		.pipe($.babel())
		.on('error', function(e) {
			$.util.log($.util.colors.red('Error: ' + e.message));
			this.emit('end');
		})
		// .pipe($.rename({
		// 	 suffix: "-es5"
		// }))
		.pipe(gulp.dest(jsPath))
		.pipe(reload({
			stream: true
		}));
})

/* default */
gulp.task('default', ['browser-sync'], function() {
	gulp.watch(project + '/*.html').on('change', reload);
	gulp.watch(sassPath + '/**/*.scss', ['sass']).on('change', function (e) {
		sassFile = e.path;
	});
	gulp.watch(es6Path, ['babel']).on('change', function (e) {
		es6File = e.path;
	});
});