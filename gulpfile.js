const gulp = require("gulp");
const eslint = require("gulp-eslint");
const concat = require("gulp-concat");
const uglifyes = require("uglify-es");
const composer = require("gulp-uglify/composer");
const sourcemaps = require("gulp-sourcemaps");
const gutil = require("gulp-util");
const del = require("del");
const minify = composer(uglifyes, console);
const jsdoc = require("gulp-jsdoc3");

const paths = {
	scripts: [
		"js/src/*.js",
	],
};

gulp.task("clean", () => del(["build"]));

gulp.task("build", ["clean", "lint"], () => gulp.src(paths.scripts)
		.pipe(sourcemaps.init())
		.pipe(minify())
		.on("error", (err) => {

			gutil.log(gutil.colors.red("[Error]"), err.toString());

		})
		.pipe(concat("storymap.min.js"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/js")));

gulp.task("lint", [], () => gulp.src(paths.scripts)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError()));

gulp.task("doc", [], (cb) => {

	const config = require("./jsdoc.json");
	gulp.src(["README.md", "./src/**/*.js"], { read: false })
        .pipe(jsdoc(config, cb));

});

gulp.task("default", ["build"]);
