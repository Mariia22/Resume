"use strict";

// Подключаем Gulp
var gulp = require("gulp");
var sass = require("gulp-sass"), // переводит SASS в CSS
  cssnano = require("gulp-cssnano"), // Минимизация CSS
  autoprefixer = require("gulp-autoprefixer"), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
  concat = require("gulp-concat"), // Объединение файлов - конкатенация
  rename = require("gulp-rename"); // Переименование файлов

// Копирование файлов HTML в папку dist
gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"));
});

// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("sass", function () {
  return gulp.src("src/sass/*.sass")
    .pipe(concat('styles.scss'))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest("dist/css"));
});

// Задача слежения за измененными файлами
gulp.task("watch", function () {
  gulp.watch("src/*.html", ["html"]);
  gulp.watch("src/sass/*.sass", ["sass"]);
});

///// Таски ///////////////////////////////////////

// Запуск тасков по умолчанию
gulp.task("default", gulp.series("html", "sass", "watch"));