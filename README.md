# js之观察者模式（发布订阅）实现

## 说明

1. 定义一个class，表示我们的观察者模块实现
2. class中声明四个基本方法：订阅事件 发布事件 取消订阅 取消所有订阅
3. class中声明一个事件对象集合，结构为一个对象，有许多键值对。
   
## 核心实现
```js
class ZL_Events {

    // 事件对象集合,设置为静态的，方便不同的示例共享
    static listenObj = {
        // "eventName": [fn1,fn2,fn3],键为事件名，值为数组，包含了这个事件名的所有订阅函数，
    };

    // 订阅事件(每次订阅都往这个事件名对应的数组中添加一个回调函数元素)
    on(eventName, callback) {
        let listenObj = ZL_Events.listenObj;
        if (!listenObj[eventName]) {
            listenObj[eventName] = [callback];
        }
        else {
            listenObj[eventName].push(callback);
        }
    }

    // 取消订阅(每次取消订阅 都往这个事件名对应的数组中删除一个指定的回调函数元素)
    cancel(eventName, callback) {
        let listenObj = ZL_Events.listenObj;
        if (listenObj[eventName]) {
            let index = listenObj[eventName].indexOf(callback);
            if (index !== -1) {
                listenObj[eventName].splice(index, 1);
            }
        }
    }
    // 取消所有订阅(每次取消订阅 都往这个事件名对应的数组中删除一个指定的回调函数元素)
    cancelAll(eventName) {
        let listenObj = ZL_Events.listenObj;
        if (eventName) {
            if (listenObj[eventName]) {
                listenObj[eventName] = []; //取消eventName事件的所有订阅事件
            }
        }
        else {
            ZL_Events.listenObj={};//取消所有的事件类型的订阅
        }

    }

    // 发布事件
    emit(eventName, params) {
        let listenObj = ZL_Events.listenObj;
        if (listenObj[eventName]) {
            listenObj[eventName].forEach(fn => {
                fn(params);
            });
        }
    }
}
export default ZL_Events;

```
## 使用示例
```js
// 引入和实例化
const ZL_Events=require("./zl-events");
const event=new ZL_Events();

// 订阅hello事件
event.on("hello",function(params){
   console.log("=====e1=========",params)
})

event.on("hello",function(params){
   console.log("=======e2=======",params)
})

function fn3(params){
    console.log("=====e12=========",params)
 }
event.on("hello",fn3)

// 发布hello事件
event.emit("hello",999)

// 取消对hello的第三个订阅行为
event.cancel("hello",fn3);

```


##一篇好文章
https://www.cnblogs.com/tugenhua0707/p/4100876.html 
