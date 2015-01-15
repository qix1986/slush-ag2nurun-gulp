var gulp 			= require('gulp'),
	sass 				= require('gulp-sass'),
	cssmin 			= require('gulp-cssmin'),
	browserSync = require('browser-sync'),
	uglify 			= require('gulp-uglify'),
	concat 			= require('gulp-concat'),
	changed 		= require('gulp-changed'),
	runSequence = require('run-sequence'),
	gutil 			= require('gulp-util');

var path = {
	js: ['dev/assets/js/**/*.js', '!dev/assets/js/**/*.min.js'],
	sass: ['dev/assets/sass/**/*.scss'],
	css: ['dev/assets/css/**/*.css', '!dev/assets/css/**/*.min.css'],
	img: ['dev/assets/img/*'],
	html: ['dev/**/*.html']
};

gulp.task('js:build', function () {
	return gulp.src(path.js)
		.pipe(uglify({outSourceMap: true}).on('error', function (err) { errorLog(err); }))
		.pipe(gulp.dest('build/assets/js/'));
});

gulp.task('sass', function () {
	return gulp.src(path.sass)
		.pipe(sass().on('error', function (err) { errorLog(err); }))
		.pipe(cssmin().on('error', function (err) { errorLog(err); }))
		.pipe(gulp.dest('dev/assets/css'))
		.pipe(reload({stream:true}));
});

gulp.task('sync', function() {
	browserSync({
		server: {
			baseDir: "./dev"
		}
	});
});

gulp.task('html', function () {
  return gulp.src(path.html)
		.pipe(reload({stream:true}));
});

gulp.task('watch', function () {
  gulp.watch(path.sass, ['sass']);
  gulp.watch(path.html, ['html']);
});

gulp.task('move:build', function () {
	return gulp.src([	
		'dev/**',
		'!dev/assets/sass', 
		'!dev/assets/sass/**/*.scss',
		'!dev/assets/js',
		'!dev/assets/js/**/*.js'
	])
	.pipe(gulp.dest('build/'));
});

gulp.task('default', ['sass', 'watch', 'sync']);
gulp.task('build', function () {
	runSequence('sass', 'js:build', 'move:build');
});

errorLog = function (err) {
	gutil.log('Arquivo: ' + err.fileName);
	gutil.log('Erro: ' + err.message);
};