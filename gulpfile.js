const gulp = require("gulp");
const eslint = require("gulp-eslint");
const concat = require("gulp-concat");
const uglifyes = require("uglify-es");
const composer = require("gulp-uglify/composer");
const sourcemaps = require("gulp-sourcemaps");
const gutil = require("gulp-util");
const watch = require("gulp-watch");
const batch = require("gulp-batch");
const del = require("del");
const minify = composer(uglifyes, console);
const jsdoc = require("gulp-jsdoc3");
const babel = require("gulp-babel");

const paths = {
	scripts: [
		"js/src/*.js",
	],
};

gulp.task("clean", () => del(["build"]));

gulp.task("build", ["clean", "lint"], () => gulp.src(paths.scripts)
		.pipe(babel({
			presets: ["env"]
		}))
		.pipe(sourcemaps.init())
		.pipe(minify())
		.on("error", (err) => {

			gutil.log(gutil.colors.red("[Error]"), err.toString());

		})
		.pipe(concat("storymap.min.js"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/js"))
);

gulp.task('watch', function () {
    watch(paths.scripts, batch(function (events, done) {
        gulp.start('build', done);
    }));
});

gulp.task("lint", [], () => gulp.src(paths.scripts)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
);

gulp.task("doc", [], (cb) => {

	const config = require("./jsdoc.json");
	gulp.src(["README.md", "./js/src/*.js"], { read: false })
        .pipe(jsdoc(config, cb));

});

gulp.task("default", ["build"]);
