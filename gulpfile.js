"use strict";

// Подключаем Gulp
var gulp = require("gulp");
var sass = require("gulp-sass"), // переводит SASS в CSS
  plumber = require("gulp-plumber"),
  sourcemap = require("gulp-sourcemaps"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  csso = require("gulp-csso"),
  rename = require("gulp-rename"),
  imagemin = require('gulp-imagemin'), // Сжатие изображение
  rename = require("gulp-rename"), // Переименование файлов
  server = require("browser-sync").create(),
  del = require("del");

// Сервер
gulp.task("server", function () {
  server.init({
    server: "dist/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/*.html", gulp.series("html", "refresh"));
  gulp.watch("src/sass/**/*.{scss,sass}", gulp.series("sass", "refresh"));
  gulp.watch("src/images/*.+(jpg|jpeg|png|gif)", gulp.series("imgs", "refresh"));
});

// Обновление страницы
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

//Удаление ненужных файлов
gulp.task("del", function () {
  return del("dist");
});

// Копирование файлов HTML в папку dist
gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"));
});

// Сжимаем картинки
gulp.task('imgs', function () {
  return gulp.src("src/images/*.+(jpg|jpeg|png|gif)")
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true
    }))
    .pipe(gulp.dest("dist/images"))
});

// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("sass", function () {
  return gulp
    .src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("dist"))
    .pipe(server.stream());
});

// Запуск тасков по умолчанию
gulp.task("start", gulp.series("del", "html", "sass", "imgs", "server"));