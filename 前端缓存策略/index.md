### 基本知识

强缓存利用HTTP Response Header中的Expires或Cache-Control字段来实现，
它们都用来表示资源在客户端缓存的有效期。两个header可以只启用一个，也可同时启用。
Cache-Control优先级高于Expires。

浏览器第一次跟服务器请求一个资源，服务器返回资源的响应头如上(Chrome)。浏览器解析后，
会将这个资源连同header一起缓存起来。当下次浏览器再请求这个资源时，将先在缓存中寻找，
找到后再根据Expires或Cache-Control来计算是否过期。若未过期，则缓存命中，
直接加载缓存资源。若已过期，则直接从服务器加载资源，同时重新缓存新的资源包。

需要注意的是，Cache-Control:max-age=0时是不启用缓存。另外，目前所有浏览器直接输入网址跳转都是利用缓存的，
强制刷新ctrl+F5均放弃缓存，而刷新F5动作则有细微区别（Chrome使用缓存，Edge、Firefox放弃缓存）。

协商缓存利用【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】两对Header字段来管理。