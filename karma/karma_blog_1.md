## 如何用 Karma,Jasmine,Webpack 测试 UI 组件系列 （一） 配置篇

### 为什么要测试

从个人经验来看，测试是防止软件缺陷的最好方法。
生产开发中当我们修改一小段代码，大部分的开发人员会手动打开他们的浏览器 或 POSTMAN来验证它是否仍然正确。
这种方法(手工测试)不仅低效，而且会隐藏一些你未发现的缺陷。
我们测试我们软件的目的是验证它是否如我们预期中的一毛一样。

### 单元测试

单元测试是一种测试你的项目中每个最小单元代码的有效手段，是使你的程序思路清晰的基础。
一旦所有的测试通过，这些零散的单元组合在一起也会运行的很好，因为这些单元的行为已经被独立的验证过了。
本文介绍如何使用 Karma,Jasmine,Webpack 编写单元测试代码。

详细代码请点击 [https://github.com/sunyue1992/Karam_Jasmine_Webpack](https://github.com/sunyue1992/Karam_Jasmine_Webpack)

### 安装 Karma

```
npm i karma -D
npm i karma-cli -D
karma init //初始化karma.config.js文件
```

下面给出一份karma.config.js的配置模板，大部分按照默认值配置就可以了。

```
module.exports = function (config) {
    config.set({
        //设置文件匹配的基础路径，
        basePath: '', 
        
        //使用的断言库，可以用Jasmine,Mocha(选择Jasmine是因为Jasmine中的Spy十分好用)
        frameworks: ['jasmine'],
        
        //需要加载的文件列表,一般的顺序是 1.angular及相关的核心模块；2.应用文件；3.测试用例文件
        files: [
            'node_modules/angular/angular.min.js', //加载angular
            'node_modules/angular-mocks/angular-mocks.js', 
            //加载 angular 测试相关的模块，inject,module,sharedInjector，dump等方法
            // angular-mocks 详解见 https://docs.angularjs.org/api/ngMock/function
            'app/**/*.js', // 被测试的应用文件
            'test/**/*_test.js', // 此处是单元测试用例文件
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
        // possible可用值: 'dots', 'progress','spec'
        // 可用的配置详细见 https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec','coverage'], 
        //需要安装 npm i karma-coverage -D 生成测试覆盖率文件
        //需要安装 npm i karma-spec-reporter D 控制台输出更友好
        
        // 端口
        port: 9876,
        
        // colors 控制台输出日志加颜色
        colors: true,
        
        // 控制台输出日志的级别
        // logLevel可用值: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        
        // 检测文件变动，重新执行
        autoWatch: true,
        
        // browsers 设置启动的浏览器，一般 Chrome，也支持FireFox，PhantomJS
        browsers: ['Chrome'], //需要安装 npm i karma-chrome-launcher -D
        
        // singleRun 设置为true,Karma在打开浏览器运行完测试用例，会自动退出
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
```
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
//更多webpack的配置详见 https://webpack.js.org/concepts/
```

### Jasmine 的断言库的引入

```
    npm i jasmine-core karma-jasmine -D
    //jasmine的语法详见 https://github.com/jasmine/jasmine
```

### 编写测试用例

因为我司在生成中还在使用Angular 1.X 的版本，所以测试用例的编写也以此为例，需要安装angular angular-mocks。
```

npm i angular angular-mocks -S
//angular-mocks 的使用详见 https://docs.angularjs.org/guide/unit-testing#angular-mocks

```


###参考

[Testing AngularJS with Jasmine and Karma](https://scotch.io/tutorials/testing-angularjs-with-jasmine-and-karma-part-1)
[Angular 官方示例](https://github.com/angular/angular-seed)
[Angular 官方文档](https://docs.angularjs.org/guide/unit-testing)
[Jasmine语法](http://keenwon.com/1218.html)