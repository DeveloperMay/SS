/**
** CONFIGURAÇÃÕES PARA O NOTIFICATION
**/
/**
** DEPENDENCIAS


  # Node Versão 8
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs

  # NPM ultima versão
  npm install npm@latest -g

  # verificar Node e npm instalado,
  node -v
  npm -v

  # Instalação Gulp
  # Gulp
    sudo npm install gulp-cli -g
    sudo npm install gulp -D

  # Dependencias
  # gulp-uglify-es
    npm install --save-dev gulp-uglify-es

  # gulp-rename
    npm i gulp-rename

  # gulp-concat
  npm install --save-dev gulp-concat

  # gul-sass
    npm install gulp-sass --save-dev
    'Se der problema com o Sass, execute isso'
    npm rebuild node-sass

  # gulp-notify
    npm i gulp-notify

  # gulp-sourcemaps
    npm i gulp-sourcemaps


  # ERRO ESCUTA GULP
    gulp watch fails with error: Error: watch ... ENOSPC

    ( SOLUÇÃO )
    - no terminal -
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
**/

const projeto = 'Abigor',
      msg     = 'O arquivo "<%= file.relative %>" foi compilado com sucesso!';

var gulp = require('gulp'),
    connect = require('gulp-connect-php'),
    browserSync = require('browser-sync'),
    sass   = require('gulp-sass'),
    reload = browserSync.reload,
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass   = require('gulp-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps');



gulp.task('scss', function(){

  // Função compila o SCSS com Map para Debugar
  var sassFiles = 'css/scss/main.scss',
      cssDest = 'css';
   return gulp.src(sassFiles)
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compiled'}))
      .pipe(rename('site.min.css'))
      .pipe(sourcemaps.write('./map'))
      .pipe(gulp.dest(cssDest))
      .pipe(reload({ stream:true }))
      .on('error', function(err) {
         /// notify().write(err);
          done(erro); 
      })
      //.pipe(notify({ title:projeto+' - Desenvolvimento', message: msg }));
});
gulp.task('site', function(cb){
  // Função compila o SITE.JS com Map para Debugar
  return gulp.src(contate_site)
    .pipe(sourcemaps.init())
    .pipe(concat('site.min.js'))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('js'))
      .pipe(reload({ stream:true }))
      .on('error', function(err) {
         /// notify().write(err);
          done(erro); 
      })
    //.pipe(notify({ title:projeto+' - Desenvolvimento', message: msg}))
});

gulp.task('push', function(cb){
  // Função compila o SITE.JS com Map para Debugar
  return gulp.src(contate_site)
    .pipe(sourcemaps.init())
    .pipe(concat('push.min.js'))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('js'))
      .pipe(reload({ stream:true }))
      .on('error', function(err) {
         /// notify().write(err);
          done(erro); 
      })
    //.pipe(notify({ title:projeto+' - Desenvolvimento', message: msg}))
});


gulp.task('dev', function() {
  connect.server({}, function (){
   browserSync.init({
        proxy: 'http://abigor.local:80/'
      });
    });

    gulp.watch('./*.php').on('change', function () {
      browserSync.reload();
    });

    gulp.watch(['css/scss/**/*.scss'],['scss']);
    gulp.watch('js/js/boss/boss.js', ['boss']);
    gulp.watch('js/js/a/a.js', ['a']);
    gulp.watch('js/js/push/push.js', ['push']);
    gulp.watch('js/js/**.js', ['site']);
});








const contate_site = [
  'js/js/site.js'
];

/**
** FUNÇÕES
**/
gulp.task('scss_producao', function(){
  // Função compila o SCSS SEM Map para produção
  var sassFiles = 'css/scss/main.scss',
      cssDest = 'css';
    gulp.src(sassFiles)
      .pipe(rename('site.min.css'))
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(gulp.dest(cssDest))
      .pipe(sass({ errLogToConsole: false, }))
      .on('error', function(err){
          notify().write(err);
          this.emit('end');
      })
      //.pipe(notify({ title:projeto+' - Produção', message: msg }));
});

gulp.task('a_producao', function(cb){
  // Função compila o BOSS.JS SEM Map para produção
  return gulp.src('js/js/a/a.js')
    .pipe(uglify())
    .pipe(rename('a.min.js'))
    .pipe(gulp.dest('js'))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //.pipe(notify({ title:projeto+' - Produção', message: msg }));
});

gulp.task('push_producao', function(cb){
  // Função compila o BOSS.JS SEM Map para produção
  return gulp.src('js/js/push/push.js')
    .pipe(uglify())
    .pipe(rename('push.min.js'))
    .pipe(gulp.dest('js'))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //.pipe(notify({ title:projeto+' - Produção', message: msg }));
});

gulp.task('boss_producao', function(cb){
  // Função compila o BOSS.JS SEM Map para produção
  return gulp.src('js/js/boss/boss.js')
    .pipe(uglify())
    .pipe(rename('boss.min.js'))
    .pipe(gulp.dest('js'))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //.pipe(notify({ title:projeto+' - Produção', message: msg }));
});

gulp.task('site_producao', function(cb){
  // Função compila o SITE.JS SEM Map para produção
  return gulp.src(contate_site)
    .pipe(concat('site.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //.pipe(notify({ title:projeto+' - Produção', message: msg }));
});

gulp.task('a', function(cb){
  // Função compila o BOSS.JS com Map para Debugar
  return gulp.src('js/js/a/a.js')
    .pipe(sourcemaps.init())
    .pipe(rename('a.min.js'))
    .pipe(sourcemaps.write('./map'))
    .pipe(reload({ stream:true }))
    .pipe(gulp.dest('js'))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //.pipe(notify({ title:projeto+' - Desenvolvimento', message: msg }));
});
gulp.task('push', function(cb){
  // Função compila o BOSS.JS com Map para Debugar
  return gulp.src('js/js/push/push.js')
    .pipe(sourcemaps.init())
    .pipe(rename('push.min.js'))
    .pipe(sourcemaps.write('./map'))
    .pipe(reload({ stream:true }))
    .pipe(gulp.dest('js'))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //.pipe(notify({ title:projeto+' - Desenvolvimento', message: msg }));
});
gulp.task('boss', function(cb){
  // Função compila o BOSS.JS com Map para Debugar
  return gulp.src('js/js/boss/boss.js')
    .pipe(sourcemaps.init())
    .pipe(rename('boss.min.js'))
    .pipe(sourcemaps.write('./map'))
    .pipe(reload({ stream:true }))
    .pipe(gulp.dest('js'))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //.pipe(notify({ title:projeto+' - Desenvolvimento', message: msg }));
});

gulp.task('icones', function(){
  // Função compila o SCSS com Map para Debugar
  var sassFiles = 'css/icones/icones.css',
      cssDest = 'css';
    gulp.src(sassFiles)
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compiled'}))
      .pipe(rename('icones.min.css'))
      .pipe(sourcemaps.write('./map'))
      .pipe(gulp.dest(cssDest))
      .on('error', function(err) {
          notify().write(err);
          this.emit('end');
      })
    //  .pipe(notify({ title:projeto+' - Desenvolvimento', message: msg }));
});


/**
** - ESCUTAS -
**
** COMANDOS:
** gulp           -- compila JS e SCSS para desenvolvimento, ambos com map (gera arquivo .min.css/js)
** gulp producao  -- compila JS e CSS para producao, ambos sem map (gera arquivo .min.css/js)
** gulp js        -- compila somente JS para desenvolvimento, com map (gera arquivo .min.js)
** gulp css       -- compila somente SCSS para desenvolvimento, com map (gera arquivo .min.css)
**/
gulp.task('default', function() {
    gulp.watch(['css/scss/**/*.scss'],['scss']);
    gulp.watch('css/icones/icones.css',['icones']);
    gulp.watch('js/js/boss/boss.js', ['boss']);
    gulp.watch('js/js/a/a.js', ['a']);
    gulp.watch('js/js/push/push.js', ['push']);
    gulp.watch('js/js/**.js', ['site']);
});

gulp.task('css', function() {
    gulp.watch('css/scss/**/*.scss',['scss']);
    gulp.watch('css/icones/icones.css',['icones']);
});

gulp.task('js', function() {
  gulp.watch('js/js/boss/boss.js', ['boss']);
  gulp.watch('js/js/a/a.js', ['a']);
  gulp.watch('js/js/push/push.js', ['push']);
  gulp.watch('js/js/**.js', ['site']);
});

gulp.task('producao', function() {
  gulp.watch('css/scss/**/*.scss',['scss_producao']);
  gulp.watch('css/icones/icones.css',['icones_producao']);
  gulp.watch('js/js/boss/boss.js', ['boss_producao']);
  gulp.watch('js/js/a/a.js', ['a_producao']);
  gulp.watch('js/js/push/push.js', ['push_producao']);
  gulp.watch('js/js/**.js', ['site_producao']);
});