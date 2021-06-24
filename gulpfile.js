let gulp = require('gulp'),
    sass = require('gulp-sass'),
    include = require('gulp-include'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    concat = require("gulp-concat"),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    newer = require('gulp-newer'),
    uglify = require('gulp-uglify'),
    beautifyCode = require('gulp-beautify-code'),
    babel = require('gulp-babel'),
    pug = require('gulp-pug'),
 
    // PATH

    srcCss = './src/css/*.scss',
    srcFonts = './src/css/fonts/**/*',
    srcPug = './src/pug/*.pug',
    srcJS = './src/js/custom/*.js',
    srcVJS = './src/js/*.js',
    srcSvg = './src/img/svg/*.svg',
    srcImg = './src/img/*.+(jpg|jpeg|png|gif)',
    distCss = './dist/css',
    distFonts = './dist/css/fonts',
    distHtml = './dist',
    distJS = './dist/js',
    distSvg = './dist/img/svg',
    distImg = './dist/img',
    watchCss = './src/css',
    watchPug = './src/pug';

// Task create

gulp.task('html', function () {
    return gulp.src(srcPug)
        .pipe(pug())
        .pipe(beautifyCode())
        .pipe(gulp.dest(distHtml))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    return gulp.src(srcCss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist:  ['last 2 versions'],
            cascade: false
         }))
        .pipe(sourcemaps.write('.'))
        .pipe(beautifyCode())
        .pipe(gulp.dest(distCss))
        .pipe(browserSync.stream());
});

gulp.task('font', function () {
    return gulp.src(srcFonts)
        .pipe(newer(distFonts))
        .pipe(gulp.dest(distFonts))
        .pipe(browserSync.stream());
});

gulp.task('img', function() {
    return gulp.src(srcImg)
        .pipe(newer(distImg))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest(distImg))
        .pipe(browserSync.stream());
});

gulp.task('svg', function() {
    return gulp.src(srcSvg)
        .pipe(newer(distSvg))
        .pipe(gulp.dest(distSvg))
        .pipe(browserSync.stream());
});

gulp.task("vendorjs", function() {
    return gulp.src(srcVJS)
        .pipe(include())
        .pipe(uglify())
        .pipe(gulp.dest(distJS))
        .pipe(browserSync.stream());
});

gulp.task("script", function() {
    return gulp.src(srcJS)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(beautifyCode())
        .pipe(gulp.dest(distJS))
        .pipe(browserSync.stream());
});

gulp.task('server', function() {
    browserSync.init({
        server: "./dist"
    });
});

gulp.task("track", function() {
    gulp.watch(watchPug, gulp.parallel(["html"]));
    gulp.watch(srcVJS, gulp.parallel(["vendorjs"]));
    gulp.watch(srcJS, gulp.parallel(["script"]));
    gulp.watch(watchCss, gulp.parallel(["sass"]));
    gulp.watch(srcFonts, gulp.parallel(["font"]));
    gulp.watch(srcImg, gulp.parallel(["img"]));
    gulp.watch(srcSvg, gulp.parallel(["svg"]));
});


gulp.task("build", gulp.series(['html', 'sass', 'font', 'vendorjs', 'script', 'img', 'svg']));

gulp.task("watch", gulp.parallel(['track', 'server']));

gulp.task("run", gulp.series(['build', 'watch']));