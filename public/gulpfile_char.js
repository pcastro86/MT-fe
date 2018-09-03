// CHAR

gulp.task('clean', function() {
	return del(['public'])
})

gulp.task('font', ['clean'], function() {
	//node_modules\materialize-css\dist\font\material-design-icons
	return gulp.src([
		'src/font/**'
	])
	.pipe(gulp.dest('public/font'))
})



gulp.task('custom-css', ['clean', 'font'], function() {
	return gulp.src(['src/css/*.css'])
	.pipe(gulp.dest('public/css')) // EL PIPE ES UN COPY. LE PUSO PUBLIC PORQUE LO LEVANTA DESDE SU NODE. EN MI CASO SERIA DIST
})

gulp.task('custom-css:prod', ['clean', 'font'], function() { // HACE LO MISMO CON LA ANTERIOR PERO LOS MINIFICAR Y CONCATENAR.
	return gulp.src(['src/css/*.css'])                      // LOS DIVIDE EN DOS TASK PORQUE SI HAY UN ERROR, LA PRIMERA NO LOS MINIFICA PARA PODER ENCONTRARLO, Y ESTA SI.
	.pipe(autoprefixer()) // LE AGREGA UN PREFIJO DE LA W3C
	.pipe(concat('agrofinger.css')) // VA A PONER TODO EN UN ARCHIVO LLAMADO AGROFINGER.
	.pipe(csso()) // MINIFICA
	.pipe(gulp.dest('public/css'))
})

gulp.task('css', ['clean', 'custom-css'], function() { // ERA DE BOWER, PERO EN MI CASO DEBERIA BUSCAR LOS CSS DE BOOSTRAP
	return gulp.src([
		'node_modules/materialize-css/dist/css/materialize.css',
		'node_modules/nvd3/build/nv.d3.css'
	])
	.pipe(gulp.dest('public/css/lib'))
})

gulp.task('css:prod', ['clean', 'custom-css:prod'], function() { // BUSCA LOS MISMO ARCHIVOS QUE EL ANTERIOR + TODOS LOS MIOS QUE SON PRODUCTO DE TASK ANTERIORES. 
	return gulp.src([                                           // ES IMPORTANTE QUE ESTEN AL FINAL. 
		'node_modules/materialize-css/dist/css/materialize.min.css', // <-- NO LOS MINIFICA PORQUE YA ESTAN MINIFICADOS. POR ESO TENGO MI OTRA TAREA CUSTOM-CSS:PROD. AHI ESTAN MIS MINIFICADOS.
		'node_modules/nvd3/build/nv.d3.min.css',
		'public/css/*.css'//<--- MIOS
	])
	.pipe(concat('agrofinger.css'))
	.pipe(gulp.dest('public/css'))
})

gulp.task('js', ['clean'], function() { // IDEM QUE CON CSS. VOYA BUSCAR LAS LIBRERIAS QUE TIENE QUE ESTAR ANTES QUE LOS MIOS
	return gulp.src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/materialize-css/dist/js/materialize.js',
		'node_modules/angular/angular.js',
		'node_modules/angular-animate/angular-animate.js',
		'node_modules/angular-route/angular-route.js',
		'bower_components/angular-swipe/dist/angular-swipe.js',
		'node_modules/angucomplete-alt/angucomplete-alt.js',
		'node_modules/d3/d3.js',
		'node_modules/nvd3/build/nv.d3.js',
		'node_modules/angular-nvd3/dist/angular-nvd3.js',
		'src/agrofinger.js', // DONDE CREE MI MODULO, VA ANTES QUE EN TODOS LOS OTROS.
		'src/**/*.js'
	])
	.pipe(gulp.dest('public/js'))
})

gulp.task('js-custom:prod', ['clean'], function() {
	return gulp.src([
		'src/agrofinger.js',
		'src/**/*.js'
	])
	.pipe(concat('agrofinger.js'))
	.pipe(ngAnnotate()) // REEMPLAZA EL INJECT.
	.pipe(uglify())
	.pipe(gulp.dest('public/js'))
})

gulp.task('js:prod', ['js-custom:prod'], function() { // NO LOS MINIFICO PORQUE YA ESTAN MINIFICADOS, SOLO LE AGREGO LOS MINIFICADOS MIOS QUE SALIERON DE JS.CUTOM.PROD
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/materialize-css/dist/js/materialize.min.js',
		'node_modules/angular/angular.min.js',
		'node_modules/angular-animate/angular-animate.min.js',
		'node_modules/angular-route/angular-route.min.js',
		'bower_components/angular-swipe/dist/angular-swipe.min.js',
		'node_modules/angucomplete-alt/dist/angucomplete-alt.min.js',
		'node_modules/d3/d3.min.js',
		'node_modules/nvd3/build/nv.d3.min.js',
		'node_modules/angular-nvd3/dist/angular-nvd3.min.js',
		'public/js/agrofinger.js'
	])
	.pipe(concat('agrofinger.js'))
	.pipe(gulp.dest('public/js'))
})



gulp.task('html', ['clean'], function() { // VA A BUSCAR MIS HTMLS. PARA ESTA TAREA YA DEBERIA TENER UN UNICO CSS CON TODO MINIFICADO Y UN UNICO JS CON TODO MINI
	return gulp.src('src/view/*.html')
	.pipe(htmlify())
	.pipe(gulp.dest('public'))
})

gulp.task('index:prod', ['css:prod', 'js:prod'], function () {
	return gulp.src('src/index.html') // AGARRA EL HTML
	.pipe(inject( // BUSCA EL JS MNIFICADO Y EL CSS MINIFICADO Y LOS INJECTA DENTRO DEL HTML
		gulp.src(['public/js/*.js', 'public/css/*.css'], {read: false}), {
			ignorePath: 'public',
			addRootSlash: false
		}
	))
	.pipe(gulp.dest('public'))
})

gulp.task('html:prod', ['index:prod'], function() {
	return gulp.src('src/view/*.html')
	.pipe(htmlify())
    .pipe(htmlmin({ // LIMPIA EL CODIGO
		collapseWhitespace: true,
		keepClosingSlash: true
	}))
	.pipe(removeHtmlComments())
	.pipe(inlineAngularTemplates('public/index.html', { // VA PONIENDO LOS HTML EN UN UNICO ARCHIVO HTML 
		base: 'src/view',	// (Optional) ID of the <script> tag will be relative to this folder. Default is project dir. 
		selector: 'head',	// (Optional) CSS selector of the element to use to insert the templates. Default is `body`. 
		method: 'append'	// (Optional) DOM insert method. Values: append | prepend | replaceWith | after | before
    }))
	.pipe(htmlify()) // LO MINIFICO
    .pipe(htmlmin({collapseWhitespace: true}))
	.pipe(removeHtmlComments())
	.pipe(w3cjs())
	.pipe(gulp.dest('public'))
})



gulp.task('index', ['css', 'js'], function () { // EN ESTE PUNTO VINCULO TODO.
	return gulp.src('src/index.html')
	.pipe(htmlify())
	.pipe(inject( // AGARRA TODOS LOS SCRIPTS EN ESTE ORDEN
		gulp.src([
			'public/js/jquery.js',
			'public/js/materialize.js',
			'public/js/angular.js',
			'public/js/angular-animate.js',
			'public/js/angular-route.js',
			'public/js/angular-swipe.js',
			'public/js/angucomplete-alt.js',
			'public/js/d3.js',
			'public/js/nv.d3.js',
			'public/js/angular-nvd3.js',
			'public/js/agrofinger.js',
			'public/js/module/*.js',
			'public/js/service/*.js',
			'public/js/controller/*.js',
			'public/js/directive/*.js',
			'public/css/lib/*.css',
			'public/css/*.css'
		], {read: false}), {
			ignorePath: 'public',
			addRootSlash: false
		}
	))
	.pipe(gulp.dest('public'))
})




gulp.task('manifest-inject', ['html:prod'], function() {
	return gulp.src(['public/index.html'])
	.pipe(replace({
		patterns: [
			{
				match: /(<html\s)(.*>.*)/i,
				replacement: '$1manifest="agrofinger.manifest" $2'
			}
		]
    }))
	.pipe(gulp.dest('public'))
})

gulp.task('manifest', ['manifest-inject'], function() {
	return gulp.src(['public/**/*'])
	.pipe(manifest({
		filename: 'agrofinger.manifest',
		timestamp: true
	}))
	.pipe(replace({
		patterns: [
			{
				match: /%5C/g,
				replacement: '/'
			}
		]
    }))
	.pipe(gulp.dest('public'))
})

gulp.task('apache', ['manifest'], function() {
	fs.writeFileSync('public/.htaccess', [
		'# Do not remove this line or mod_rewrite rules and search engine friendly URLs will stop working',
		'RewriteBase /',
		'',
		'AddType text/cache-manifest .appcache'
	].join('\n'))
})

gulp.task('zip', ['apache'], function() {
	fs.writeFileSync('public/.htaccess', [
		'# Do not remove this line or mod_rewrite rules and search engine friendly URLs will stop working',
		'RewriteBase /',
		'',
		'AddType text/cache-manifest .appcache'
	].join('\n'))
	return gulp.src('public/**/*')
	.pipe(zip('public.zip'))
	.pipe(gulp.dest('public'))
})

gulp.task('hostinger', ['apache'], function() {
	var conn = ftp.create({
        host:     'agrofinger.esy.es',
        user:     'u528786895',
        password: 'sxnC9H802M',
        parallel: 1,
		log: gutil.log
    })
	return gulp.src(['public/.htaccess', 'public/**'], {base: 'public', buffer: false})
	.pipe(conn.dest('/public_html'))
})

gulp.task('dev', ['html', 'index'])
gulp.task('default', ['apache'])