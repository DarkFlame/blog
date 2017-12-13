## 如何用 Karma,Jasmine,Webpack 测试 UI 组件系列 （一）


### 安装 Karma

```
npm i karma -D
npm i karma-cli -D
karma init //初始化karma.config.js文件
```

下面给出一份karma.config.js的配置模板，大部分按照默认值配置就可以了

```
module.exports = function (config) {
    config.set({
        //设置文件匹配的基础路径，
        basePath: '', 
        
        //使用的断言库，可以用Jasmine,Mocha(选择Jasmine是因为Jasmine中的Spy十分好用)
        frameworks: ['jasmine'],
        
        //需要加载的文件列表
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'test/**/*_test.js', // 此处是单元测试用例文件
            'app/**/*.js', //被测试的目标文件
        ],

        // 需要排除的文件列表
        exclude: [],


        // 预处理匹配到的文件插件，因为实际开发中js可能会使用ES6的语法，css使用sass,less等库，需要webpack对文件进行编译加载
        // 可用的预处理插件: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './app/*.js' : ['webpack']
        },
        //加载webapck的配置文件
        webpack: require("./webpack.config.js"),
        webpackMiddleware: {
        //隐藏webpack编译的输出信息
            noInfo: true,
        },
        // 测试结果的展示设置
        // possible可用值: 'dots', 'progress'
        // 可用的配置详细见 https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress','coverage'], //需要安装 npm i karma-coverage -D
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // 控制台输出日志的级别
        // 可用值: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // 检测文件变动，重新执行
        autoWatch: true,
        // 设置启动的浏览器 当然是Chrome，也支持FireFox，PhantomJS
        browsers: ['Chrome'], //需要安装 npm i karma-chrome-launcher -D
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
    //更多详细配置见 https://github.com/karma-runner/karma/
}

```


### Webpack 和 Babel 的安装和配置

```
npm i webpack babel-core babel-loader babel-preset-env karma-webpack -D
```
Babel和Webpack的根据使用到的ECMAScript新特性决定是否配置，我的配置如下
```angular2html
// .babelrc
{
    "presets": [
        "env"
    ]
}


// webpack.config.js
let path = require('path');
let webpack = require('webpack');


let config = {
    entry: {
        'main': path.resolve('./**')
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./dist'),
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['ng-annotate-loader', 'babel-loader'],
                //ng-annotate-loader 是对angularjs 依赖注入可以采用注释的写法的 webapck 的 loader
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true
                    }
                }]
            }
        ]
    },
    plugins: [],
    resolve: {
        modules: [
            path.join(__dirname, './node_modules')
        ]
    }
};


module.exports = config;
```

### Jasmine 的断言库的引入

```
    npm i jasmine-core karma-jasmine -D
```

### 编写测试用例

因为我司在生成中还在使用Angular 1.X 的版本，所以测试用例的编写也以此为例，
需要安装
```angular2html
npm i angular angular-mocks -S
```