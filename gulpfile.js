/// <binding ProjectOpened='watch' />
"use strict";

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    notify = require('gulp-notify');

// Styles
gulp.task('styles', function () {
    var plugins = [
        autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}),
        cssnano()
    ];
    return gulp.src('./scss/styles.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return error.message;
            })
        }))
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('.'))
        .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['js/*.js', 'js/modules/*.js', '!js/**/*.min.js'])
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return error.message;
            })
        }))
        .pipe(concat('site.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('.'))
        .pipe(browserSync.stream());
});
gulp.task('default', function () {
    gulp.start('styles', 'scripts');
});
gulp.task('js-watch', ['scripts'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('scss-watch', ['styles'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('serve', ['styles', 'scripts'], function() {
    browserSync.init({
        server: "./"
    });
    // Watch .scss files
    gulp.watch('scss/**/*.scss', ['scss-watch']);
    // Watch .js files
    gulp.watch(['js/*.js', 'js/modules/*.js'], ['js-watch']);
    gulp.watch(["html/*.html", '*.html']).on('change', browserSync.reload);
});
