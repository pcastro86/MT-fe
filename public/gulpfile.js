const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-minify-css');
const concatCss = require('gulp-concat-css');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del')
const ngAnnotate = require('gulp-ng-annotate')
const htmlify = require('gulp-angular-htmlify')
const inject = require('gulp-inject')
const htmlmin = require('gulp-htmlmin')
const removeHtmlComments = require('gulp-remove-html-comments')
const inlineAngularTemplates = require('gulp-inline-angular-templates')



gulp.task('build', ['index']);
gulp.task('build-prod', ['html:prod'])


gulp.task('clean', function() {
	return del(['dist'])
})

gulp.task('custom-css', ['clean'], function() {
	return gulp.src(['app/**/*.css'])
	.pipe(gulp.dest('dist/css')) // EL PIPE ES UN COPY. LE PUSO PUBLIC PORQUE LO LEVANTA DESDE SU NODE. EN MI CASO SERIA DIST
})

gulp.task('custom-css:prod', ['clean'], function() { // HACE LO MISMO CON LA ANTERIOR PERO LOS MINIFICAR Y CONCATENAR.
	return gulp.src(['app/**/*.css'])                      // LOS DIVIDE EN DOS TASK PORQUE SI HAY UN ERROR, LA PRIMERA NO LOS MINIFICA PARA PODER ENCONTRARLO, Y ESTA SI.
	.pipe(autoprefixer()) // LE AGREGA UN PREFIJO DE LA W3C
	.pipe(concat('styles.css')) // VA A PONER TODO EN UN ARCHIVO LLAMADO AGROFINGER.
	.pipe(minifycss()) // MINIFICA
	.pipe(gulp.dest('dist'))
})

gulp.task('css', ['clean', 'custom-css'], function() { // ERA DE BOWER, PERO EN MI CASO DEBERIA BUSCAR LOS CSS DE BOOSTRAP
	return gulp.src([
		'node_modules/bootstrap/dist/css/bootstrap.min.css',
	])
	.pipe(gulp.dest('dist/css/lib'))
})






// ********************* js ********************//

gulp.task('js', ['clean'], function() { // IDEM QUE CON CSS. VOYA BUSCAR LAS LIBRERIAS QUE TIENE QUE ESTAR ANTES QUE LOS MIOS
	return gulp.src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/angular/angular.js',
		'node_modules/angular-route/angular-route.js',
		'./app.module.js', // DONDE CREE MI MODULO, VA ANTES QUE EN TODOS LOS OTROS.
		'app/**/*.js'
	])
	.pipe(gulp.dest('dist/js'))
})

// minifica todo lo que encontreo con la task js
gulp.task('js-custom:prod', ['clean'], function() {
	return gulp.src([
		'public/app.module.js',
		'app/**/*.js'
	])
	.pipe(concat('mljs.js'))
	.pipe(ngAnnotate()) // REEMPLAZA EL INJECT.
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
})

gulp.task('js:prod', ['js-custom:prod'], function() { // NO LOS MINIFICO PORQUE YA ESTAN MINIFICADOS, SOLO LE AGREGO LOS MINIFICADOS MIOS QUE SALIERON DE JS.CUTOM.PROD
	return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
		'node_modules/angular/angular.min.js',
		'node_modules/angular-route/angular-route.min.js',
		'dist/js/mljs.js'
	])
	.pipe(concat('mljs.js'))
	.pipe(gulp.dest('dist'))
})


gulp.task('html', ['clean'], function() { // VA A BUSCAR MIS HTMLS. PARA ESTA TAREA YA DEBERIA TENER UN UNICO CSS CON TODO MINIFICADO Y UN UNICO JS CON TODO MINI
	return gulp.src('app/**/*.html')
	.pipe(htmlify())
	.pipe(gulp.dest('dist'))
})

gulp.task('index', ['css', 'js', 'html'], function () { // EN ESTE PUNTO VINCULO TODO. NO FUNCIONA-
	return gulp.src('./index.html')
	.pipe(htmlify())
	.pipe(inject( // AGARRA TODOS LOS SCRIPTS EN ESTE ORDEN
		gulp.src([
			'dist/js/jquery.js',
			'dist/js/angular.js',
			'dist/js/angular-route.js',
			'dist/js/app.module.js',
			'dist/js/**/*.module.js',
			'dist/js/services/*.js',
			'dist/js/**/*.component.js',
			'dist/css/lib/*.css',
			'dist/css/*.css'
		], {read: false}), {
			ignorePath: 'public',
			addRootSlash: false
		}
	))
	.pipe(gulp.dest('dist'))
})


gulp.task('index:prod', ['custom-css:prod', 'js:prod'], function () {
    return gulp.src('index.html') // AGARRA EL HTML
    .pipe(inject( // BUSCA EL JS MNIFICADO Y EL CSS MINIFICADO Y LOS INJECTA DENTRO DEL HTML. PREVIAMENTE TENGO QUE PONER LOS INJECT EN EL INDEX, SIN ESO NO FUNCIONA.
        gulp.src(['dist/*.js', './dist/**/*.css'], {read: false}), {
            ignorePath: 'dist',
            addRootSlash: false
        }
    ))
   .pipe(gulp.dest('dist'))
})


gulp.task('html:prod',['index:prod'], function() {
	return gulp.src('app/**/*.html')
   // .pipe(htmlify())
//	.pipe(htmlmin({collapseWhitespace: true}))
    // .pipe(removeHtmlComments())
	.pipe(inlineAngularTemplates('./dist/index.html', { // VA PONIENDO LOS HTML EN UN UNICO ARCHIVO HTML 
		//base: 'public/app',	// (Optional) ID of the <script> tag will be relative to this folder. Default is project dir. 
		selector: 'head',	// (Optional) CSS selector of the element to use to insert the templates. Default is `body`. 
		method: 'append'	// (Optional) DOM insert method. Values: append | prepend | replaceWith | after | before
	}))

	.pipe(gulp.dest('dist'))
})








// gulp.task('css', ['clean'], function () { // en este caso no hay CSS que compilar
//     gulp.src('app/**/*.css')
//     .pipe(concatCss('css/minifyCSS.css'))
//     .pipe(minifycss())
//     .pipe(gulp.dest('dist'))
// });


// gulp.task('js', ['clean'],function () {
//   gulp.src('app/**/*.js')
//     .pipe(concat("js/minifyJS.js"))
//     .pipe(uglify())
//     .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
//     .pipe(gulp.dest('dist'))
// });

// gulp.task('images', ['clean'],function(){
//     return gulp.src('app/img/*.+(png|jpg|gif|svg)')
//     .pipe(imagemin())
//     .pipe(gulp.dest('dist/images'))
//   });






  