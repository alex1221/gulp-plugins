# gulp-plugins
关于gulp插件的描述


## ![gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins)

### 简介

由于我们项目中有时候会用到很多插件，如果都用 require 进来，我们势必得写很多行 require 代码，虽然这样没问题，但是会显得很冗长，所以 gulp-load-plugins 插件应运而生。gulp-load-plugins 在我们需要用到某个插件的时候，才去加载那个插件，并不是一开始就全部加载进来。因为 gulp-load-plugins 是依赖 package.json 文件来加载插件的，所以请确保你需要的插件已经加入 package.json 文件并已经安装完毕。

比如：

``` bash
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('js', function () {
   return gulp.src('js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist'));
});

```

### 使用

`package.json` 文件：

``` bash
{

   "devDependencies": {
      "gulp-concat": "~2.2.0",
      "gulp-uglify": "~0.2.1",
      "gulp-jshint": "~1.5.1",
      "gulp": "~3.5.6"
   }
}

```


上面的代码用gulp-load-plugins模块改写，就是下面这样。

``` bash
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

gulp.task('js', function () {
   return gulp.src('js/*.js')
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('default'))
      .pipe(plugins.uglify())
      .pipe(plugins.concat('app.js'))
      .pipe(gulp.dest('dist'));
  
});

```

## ![gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps)

### 简介

生成![sourcemap文件](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)，因为文件压缩后不利于查看与调试，但是有了 `sourcemap` ，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。

### 使用


``` bash

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function () {
   return gulp.src('js/*.js')
      .pipe(sourcemaps.init())
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('default'))
      .pipe(plugins.uglify())
      .pipe(plugins.concat('app.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'));
  
});

```

### gulp-sourcemaps API，![资料来源](https://blog.csdn.net/liangxw1/article/details/80238655)

#### sourcemaps.init()

如字面意思是 `sourcemaps` 的初始化 API ，其中的配置项：

``` bash

sourcemaps.init({
      loadMaps: true,  //是否加载以前的 .map 
      largeFile: true,   //是否以流的方式处理大文件
})

```

#### sourcemaps.write()

`sourcemaps. write( url , {option} )` 的输出配置 API

``` bash

// url

sourcemaps.write( 'maps' ) //填写相对于 gulpfile.js 的 url 地址，用于存放 .map 文件

// {option} 

sourcemaps.write('maps', {
      addComment: false,   //为源文件添加 .map 地址注释，当你设为 false 时则禁用注释（比如你想要通过 header 加载映射源）
      includeContent：false,  //默认情况下，源映射包括源代码，通过false来使用原始文件（目测没什么用）
      sourceRoot: url , //配合上面的 includeContent：false ；指定原始文件位置
      sourceRoot: function(file) {
         return '/src';   //同时支持方法函数
      },
      destPath: url,  //指定另外的输出地址，可以不靠 gulp.dist() 输出
      sourceMappingURLPrefix: url ,   //在编写外部源映射时，指定前缀到源映射URL上,相对路径将把它们的主要点去掉（非常有用），也就是改变那个注释的 URL 前缀。
      sourceMappingURL: function(file){ ,   //如果您需要完全控制源映射URL，您可以传递函数到此选项。函数的输出必须是源映射的完整URL(在输出文件的函数中)。
          return ;
      }，
      mapFile:  function(mapFilePath) {     //重名 .map 文件
        // source map files are named *.map instead of *.js.map
        return mapFilePath.replace('.js.map', '.map');
      },
      charset: utf8 ,    //指定编码格式
      clone : {deep:false,contents:false}    //克隆原始原件，并用克隆文件来创建映射文件，参数参照 file.clone()  
})

```

#### gulp-sourcemaps 支持的插件

在 `sourcemaps.init()` 和 `sourcemaps.write()` 之间的所有插件都需要对 `gulp-sourcemaps` 进行支持，你可以在![Wiki](https://github.com/gulp-sourcemaps/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support)中查看这些插件的列表。


## 探究Gulp的Stream ![来源](https://segmentfault.com/a/1190000003770541)

为了让Gulp可以更多地利用当前Node生态体系的Stream，出现了许多Stream转换模块。下面介绍一些比较常用的。

### vinyl-source-stream

![vinyl-source-stream](https://github.com/hughsk/vinyl-source-stream)可以把普通的Node Stream转换为Vinyl File Object Stream。这样，相当于就可以把普通Node Stream连接到Gulp体系内。具体用法是：

``` bash

var fs = require("fs"),
    source = require('vinyl-source-stream'),
    gulp = require('gulp');

var nodeStream = fs.createReadStream("source.txt");

gulp.task("default", function(){
	nodeStream
    	.pipe(source("target.txt"))
    	.pipe(gulp.dest("./dest"));
});
    
```

这段代码中的Stream管道，作为起始的并不是gulp.src()，而是普通的Node Stream。但经过vinyl-source-stream的转换后，就可以用gulp.dest()进行输出。其中source([filename])就是调用转换，我们知道Vinyl至少要有contents和path，而这里的原Node Stream只提供了contents，因此还要指定一个filename作为path。

vinyl-source-stream中的stream，指的是生成的Vinyl File Object，其contents类型是Stream。类似的，还有vinyl-source-buffer，它的作用相同，只是生成的contents类型是Buffer


### vinyl-buffer

![vinyl-buffer](https://github.com/hughsk/vinyl-buffer)接收Vinyl File Object作为输入，然后判断其contents类型，如果是Stream就转换为Buffer。

很多常用的Gulp插件如gulp-sourcemaps、gulp-uglify，都只支持Buffer类型，因此vinyl-buffer可以在需要的时候派上用场。

``` bash

var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    size = require('gulp-size'),
    gulp = require('gulp');

gulp.task('build', function () {
    var b = browserify('./index.js');

    return b.bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('dist/'))
});

gulp.task("default", ['build']);

```

问：`b.bundle()` 生成了什么，为什么也可以 `.pipe()` ？
答：`b.bundle()` 生成了 `Node Stream` 中的 `Readable Stream`，而 `Readable Stream` 有管道方法 `pipe()`。

问：为什么不是从 `gulp.src()` 开始？
答：Browserify来自Node体系而不是Gulp体系，要结合Gulp和Browserify，适当的做法是先从Browserify生成的普通Node Stream开始，然后再转换为VInyl File Object Stream连接到Gulp体系中。

问：为什么还要 `vinyl-source-stream` 和 `vinyl-buffer` ？它们是什么？
答：因为Gulp插件的输入必须是Buffer或Stream类型的Vinyl File Object。它们分别是具有不同功能的Stream转换模块。

### Gulp错误处理

Gulp有一个比较令人头疼的问题是，如果管道中有任意一个插件运行失败，整个Gulp进程就会挂掉。尤其在使用gulp.watch()做即时更新的时候，仅仅是临时更改了代码产生了语法错误，就可能使得watch挂掉，又需要到控制台里开启一遍。

对错误进行处理就可以改善这个问题。前面提到过，Stream可以通过.on()添加事件侦听。对应的，在可能产生错误的插件的位置后面，加入on("error")，就可以做错误处理：

``` bash

var gulp = require('gulp'),
	gutil = require('gulp-util');

gulp.task("default", function() {
    return gulp.src(["./src/**/1.scss"])
        .on('error', gutil.log)
        .pipe(gulp.dest("./dist"));
});

```

如果你不想这样自己定义错误处理函数，可以考虑gulp-util的.log()方法。

另外，这种方法可能会需要在多个位置加入on("error")，此时推荐gulp-plumber，这个插件可以很方便地处理整个管道内的错误。

据说Gulp下一版本，Gulp 4，将大幅改进Gulp的错误处理功能，敬请期待。



