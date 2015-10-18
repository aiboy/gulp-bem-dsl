var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {
      // place code for your default task here
    
    // isProd?
    // isDev?

    var samsung = bundle('samsung')
        .getDepsFrom('index.bemjson.js')
        .getBemdeclFromDeps()
        .getFullListDepsFromBemdecl()
        .getBemdeclFromDeps()
        .cond(function (bundle) {
            if (prod) {
                bundle.bundleDest('prod/build')
                    .compile('');
            }
        })
        .loop([1,2,3], [a,b,c] ,function (bundle, meta, meta2) {
            if (meta == 1 && meta2 == c) {
                bundle.include('./lib/c')
                    .replacePlugin('borshik', function(){});
            }   
        })
        .layrs(['./lib/a', './lib/b'])
        .compile('app.js', ['coffee', 'js'])
        .compile('index.html', 'html')
        .compile('index.css', function plugin (file, techs) {
            // techs:
            // sass
            // less
            // return result gulp.File
            return file; 
        })
        .compile('index.svg', 'svg', function plugin (file, teshs, baseTech) {
          // techs - {Array<String>}
          // file - {Object<gulpFile>}
          // baseTechs {Object}
          //
          return file;
        })
        .layers(['./lib/c.js'], true)
        .exclude('./lib/a.js')
    ;

    return samsung.buildTarget();
});



function product(targetProj) {
    var allDeps = [];
    var pipes =  [];
    var result  = {
        deps: function( depsArr, depsFirst ) {
            if (depsFirst) {
               allDeps = depsArr.concat(allDeps);
            } else {
               allDeps = allDeps.concat(depsArr);
            }
            return this;
        },
        pipe: function(pipeAction) {
            pipes.push(pipeAction);
            return this;
        },
        exclude: function( dep ) {
            var idx = allDeps.indexOf(dep);
            if (idx >= 0) {
                allDeps.splice(idx, 1);
            }
            return this;
        },
        buildTarget: function() {
            var cpipe =  gulp.src(allDeps);
            for(var i = 0; i < pipes.length; i++) {
                cpipe = cpipe.pipe(pipes[i]);
            }
            return cpipe.pipe(gulp.dest('./build/' + targetProj));
        }
    };
    return result;
}
