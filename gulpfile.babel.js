import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import merge from 'merge-stream';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('resource/styles/scss/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('resource/styles/css'))
    .pipe(reload({stream: true}));
});

gulp.task('sprite', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('resource/images/sprite-png/*.png')
                        .pipe($.spritesmith({
                          imgName: 'sprite.png',
                          cssName: '_sprite.scss'
                        }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    .pipe($.imagemin())
    .pipe(gulp.dest('resource/images/generated-png/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var scssStream = spriteData.css
    .pipe(gulp.dest('resource/styles/scss/default/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, scssStream);
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

gulp.task('svg-min', function () {
    return gulp.src('resource/images/sprite-svg/*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest('resource/images/generated-svg'));
});

const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('resource/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    // .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('resource/fonts/**/*'))
    .pipe(gulp.dest('resource/fonts/builded'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('serve', ['styles', 'fonts'], () => {
  browserSync( {
    // notify: false,
    // server: {
    //   baseDir: ['app']
    // }
    proxy: '127.0.0.1',
    open: true,
    notify: false
  } );

  gulp.watch([
    'app/views/**/*.twig',
    'resource/scripts/**/*.js',
    'resource/images/**/*',
    'resource/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('resource/styles/**/*.scss', ['styles']);
  gulp.watch('resource/fonts/**/*', ['fonts']);
  // gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// gulp.task('serve:dist', () => {
//   browserSync({
//     notify: false,
//     port: 9000,
//     server: {
//       baseDir: ['dist']
//     }
//   });
// });

gulp.task('serve:test', () => {
  browserSync({
    proxy: '127.0.0.1',
    open: true,
    notify: false
  });
});

// inject bower components
// gulp.task('wiredep', () => {
//   gulp.src('app/styles/*.scss')
//     .pipe(wiredep({
//       ignorePath: /^(\.\.\/)+/
//     }))
//     .pipe(gulp.dest('app/styles'));

//   gulp.src('app/*.html')
//     .pipe(wiredep({
//       ignorePath: /^(\.\.\/)*\.\./
//     }))
//     .pipe(gulp.dest('app'));
// });

gulp.task('build', ['lint', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

// gulp.task('default', ['clean'], () => {
//   gulp.start('build');
// });
