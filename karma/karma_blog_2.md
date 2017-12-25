## 如何用 Karma,Jasmine,Webpack 测试 UI 组件系列 （二） Angular测试用例篇

本章介绍如何对Angular中的 Controller,Service,Filter,Directive编写unit test。

详细代码请点击 [https://github.com/sunyue1992/Karam_Jasmine_Webpack](https://github.com/sunyue1992/Karam_Jasmine_Webpack)
### Test Controller

```
    //controller.js
    angular.module('calculatorApp',[])
        .controller('CalculatorController',
        function CalculatorController($scope,$rootScope) {
            $scope.sum = function () {
                $scope.z = $scope.x + $scope.y;
            };
            this.name = 'sunyue';
        });
```

```      
    //controller_test.js
    
    describe('calculator', function () {
    
        beforeEach(module('calculatorApp'));//加载angular中对应的module
        let $controller;
    
        beforeEach(inject(function(_$controller_){
        // 注入 $controller Provider
            $controller = _$controller_;
        }));
    
        describe('sum', function () {
            it('1 + 1 should equal 2', function () {
                let $scope = {};
                // $controller Provider 接受一个引用 $scope 的对象
                let controller = $controller('CalculatorController', { $scope: $scope });
                $scope.x = 1;
                $scope.y = 2;
                $scope.sum();
                expect($scope.z).toBe(3);
                expect(controller.name).toBe('sunyue');
                expect($scope.name1).toBe(undefined);
            });
        });
    });
```

### Test Service
这里写了两种类型的service生成方式，以及一个返回Promise的方法的测试用例
（用到了Angular内置的 $httpBackend模拟数据的返回）

```
//service.js
angular.module('calculatorApp')
    .factory('CalculatorService',
        /*@ngInject*/
        function ($http,$rootScope) {
            return {
                getArr() {
                    return [1,2,3]
                },
                getPromiseTest() {
                    return $http.get('languages.json').then(res=>res.data)
                }
            }
        })
    .service('CustomService',function () {
        this.name = 'hello'
    });

```


```
   //service_test.js
    describe('calculator',function () {
    
        module.sharedInjector();
        beforeAll(module("calculatorApp"));
    
        let CustomService,CalculatorService,$httpBackend,$rootScope,$controller;
        let jsonResponse = [{"name": "en"},{"name": "es"},{"name": "fr"}];
        beforeEach(inject(function ($injector,_CalculatorService_,_$rootScope_,_$httpBackend_,_CustomService_,_$controller_) {
            CalculatorService = _CalculatorService_;
            // CalculatorService = $injector.get('CalculatorService');
            // 或者直接 inject(function(CalculatorService){...})
            // 三种注入service的方法都可以，推荐第一种，因为我们注入一次之后，复制给事先声明的变量，这样我们在it块中引用统一的变量
            CustomService = _CustomService_;
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('languages.json')
                .respond(jsonResponse);
        }));
    
        describe('test service',function () {
            it('should return [1,2,3]',function () {
                let arr = CalculatorService.getArr();
                expect(arr).toContain(1);
                expect(arr.length).toEqual(3);
            });
            it('should return hello',function () {
                let ser = CustomService;
                expect(ser.name).toEqual('hello');
            });
            it('should return promise',function (done) {
                let promise = CalculatorService.getPromiseTest()
                promise.then(data=>{
                    expect(data.map(z=>z.name)).toContain('en');
                    done();
                })
                $httpBackend.flush();
            });
          
        });
    
    });


```

### Test Filter
Filter本质上是一个把 **输入的数据** 转换成 **可读的数据**  的Function
类似与Service的测试，需要注意的是自定义filter调用如下
$filter('myFilter')(input, [arguments]).
```
//filter.js
angular.module('calculatorAppFilter',[])
    .filter('myFilter', function() {
        return function(input) {
            return input.toUpperCase() + 'hello,world';
        };
    });
```

```
//filter_test.js
describe('calculator', function () {
    let myFilter,$filter
    beforeEach(module('calculatorAppFilter'));
    beforeEach(inject(function ($injector) {
        $filter = $injector.get('$filter');
    }));

    describe('filter', function () {
        it('name suffer with hello,world', function () {
            expect($filter('myFilter')('sunyue')).toBe('SUNYUEhello,world');
        });
    });

});
```
### Test Directive
本章只介绍基础指令的测试,基本测试过程是提供element和context进行编译，判断最后得到的
dom是不是预期的
```
//directive.js
class Controller{
    /*@ngInject*/
    constructor($parse, $scope, $element, $attrs,version) {
        this.$scope = $scope;
        this.version = version;
    }
}

class Directive {
    /*@ngInject*/
    constructor() {
        this.restrict = 'AE';
        this.scope = {
        };
        this.controller = Controller;
        this.controllerAs = '$ctrl';
        this.bindToController = {
            ngModel:'='
        };
        this.template = `
            <div >{{$ctrl.ngModel || $ctrl.version}}</div>
        `;
    }
}

angular.module('calculatorApp')
    .directive('calculatorDirective',() => new Directive())

```

```
//directive_test.js
describe('calculator',function () {
    beforeEach(module('calculatorApp'));

    describe('directive',function () {
        it('should print current version',function () {
            let text = 'TEST_VER';
            module(function ($provide) {
                //动态设置一个service ,在指令编译中需要
                $provide.value('version',text);
            });
            inject(function ($compile,$rootScope,version) {
                //传入element和scope编译指令
                let element = $compile('<span calculator-directive ng-model="name" ng-click="name = \'hello world\'"></span>')($rootScope);
                //执行 $digest(),把 model 同步到视图中，也可以用 $apply
                $rootScope.$digest();
                expect(element.text().trim()).toEqual(text);
                //模拟浏览器点击事件，触发click事件
                browserTrigger(element,'click');
                expect(element.text().trim()).toEqual('hello world');
            });
        });
    });
});

```

### Test Event ($broadcast/$on)

我们创建一个getBroadcasr方法 broadcast 一个 event,同时监听这个事件是否被 trigger,
在事件的回调中我们修改$scope上的一个值。为了判断函数是否被执行，我们使用了Jasmine中的Spies
相关的方法。具体的使用方法详见[https://jasmine.github.io/](https://jasmine.github.io/)

```
//event.js
    angular.module('calculatorApp',[])
        .controller('CalculatorController',
        function CalculatorController($scope,$rootScope) {
            $scope.message = '';
            $rootScope.$on('global-message',function(e,message){
                $scope.message = message
            });
             $rootScope.getBroadcast = function(message){
                 $rootScope.$broadcast('global-message',message)
            }
        });

```

```
//evnet_test.js
describe('it test broadcast',function () {
    let message = 'i is message',$scope,$controller
    beforeEach(inject(function ($rootScope,$controller) {
         $scope = $rootScope.$new();
         spyOn($rootScope,'$broadcast').and.callThrough();
         spyOn($rootScope,'$on').and.callThrough();
    }));
    it("should broadcast message", function() {
        $rootScope.$broadcast.and.stub();
        $controller('CalculatorController', { $scope: $scope });
        $scope.getBroadcast(message);
        expect($rootScope.$broadcast).toHaveBeenCalled();
        expect($rootScope.$broadcast).toHaveBeenCalledWith("global-message", message);
    });
    it("should on message to message", function() {
        $controller('CalculatorController', { $scope: $scope });
        //更友好的方式把变量展示在控制台
        dump($scope)
        // trigger event
        $scope.getBroadcast(message);
        expect($rootScope.$on).toHaveBeenCalled();
        expect($rootScope.$on).toHaveBeenCalledWith('global-message', jasmine.any(Function));
        expect($scope.message).toEqual(message);
    });
});

```

后面还会介绍高级指令，以及 Routes,Events 的测试用例的编写

### 关联

[angular-unit-testing-with-jasmine](https://coderwall.com/p/u720zq/angular-unit-testing-with-jasmine)