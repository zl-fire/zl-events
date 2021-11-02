# js之观察者模式（发布订阅）实现--v2

    由于 观察者模式弱化了对象之间的联系，这本是好事情，但对象与对象之间的联系也会被隐藏的很深，会导致项目的难以跟踪维护和理解。

为了尽量减少这个这个不好的影响，所以更新了这个版本：允许订阅时给上相关说明，同时能够查询被订阅的事件和有哪些相关监听函数

从而帮助我们理清其中关联和逻辑

## 说明

1. 定义一个class，表示我们的观察者模块实现
2. class中声明5个基本方法：订阅事件 发布事件 取消订阅 取消所有订阅 查询订阅事件
3. class中声明一个静态属性：事件对象集合，结构为一个对象，有许多键值对，可跨实例共存
   
## 核心实现
```js
class ZL_Events {
    // 事件对象集合,设置为静态的，方便不同的示例共享
    static listenObj = {
        // 键为事件名，值为对象数组，包含了这个事件名的所有订阅函数和说明信息
        // "eventName": [{ callback, notes, time: new Date().toLocaleString() }],，
    };
    // 用来存储一些全局数据,格式: store.key=val;
    static store = {};

    // 订阅事件(每次订阅都往这个事件名对应的数组中添加一个回调函数元素)
    on(params) {
        // 对对象参数进行解构
        let {
            eventName, //事件名
            callback, //接收到事件后执行的回调函数
            notes, // 对此订阅行为的说明
        } = params;
        // 如果不是对象
        if (typeof params !== 'object') {
            eventName = arguments[0];
            callback = arguments[1];
            notes = "";
        }
        let listenObj = ZL_Events.listenObj;
        let theTime = new Date();
        let obj = { callback, notes, time: theTime.toLocaleString() + ":" + (theTime.getTime() + "").slice(-3) };
        if (!listenObj[eventName]) {
            listenObj[eventName] = [obj];
        }
        else {
            listenObj[eventName].push(obj);
        }
    }

    // 查询所有的事件与订阅函数.
    // type: 0 查询所有内容(默认为0)，1 查询所有的事件，2 查询具体事件名对应的所有回调 (当为2时需要传入eventName参数表示事件名)
    queryOn(type=0, eventName) {
        switch (type) {
            case 0:
                return ZL_Events.listenObj //JSON.stringify(ZL_Events.listenObj, null, 4);
            case 1:
                return Object.keys(ZL_Events.listenObj);
            case 2:
                return JSON.stringify(ZL_Events.listenObj[eventName], null, 4);
            default: break;
        }
    }

    // 取消订阅(每次取消订阅 都往这个事件名对应的数组中删除一个指定的回调函数元素)
    cancel(eventName, callback) {
        let listenObj = ZL_Events.listenObj;

        if (listenObj[eventName]) {
            // 获取当前事件所有的订阅函数
            let fns = listenObj[eventName].map(ele => ele.callback);
            // 在回调函数里面查询，找到后根据下标删除整个对象元素
            let index = fns.indexOf(callback);
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
            ZL_Events.listenObj = {};//取消所有的事件类型的订阅
        }
    }

    // 发布事件
    emit(eventName, params) {
        let listenObj = ZL_Events.listenObj;
        if (listenObj[eventName]) {
            listenObj[eventName].forEach(obj => {
                obj.callback(params);
            });
        }
    }
}
export default ZL_Events;

```
## 使用示例
```js
// 引入和实例化
const ZL_Events=require("zl-events");
const event=new ZL_Events();

// 订阅hello
event.on({
   //事件名
   eventName: 'hello',
   //接收到事件后执行的回调函数
   callback: function (params) {
      console.log("=======e1：开始加载远程数据=======", params)
   },
   // 对此订阅行为的说明
   notes: "当hello事件发生时，开始加载远程数据",
})

// 订阅hello
event.on({
   //事件名
   eventName: 'hello',
   //接收到事件后执行的回调函数
   callback: function (params) {
      console.log("=======e2：获取本地秘钥与远程数据进行对比=======", params)
   },
   // 对此订阅行为的说明
   notes: "当hello事件发生时,获取本地秘钥与远程数据进行对比",
})

// 订阅hello
function fn3(params) {
   console.log("=======e3：验证身份是否通过，通过就调整到主页=========", params)
}
event.on({
   //事件名
   eventName: 'hello',
   //接收到事件后执行的回调函数
   callback: fn3,
   // 对此订阅行为的说明
   notes: "当hello事件发生时,验证身份是否通过，通过就调整到主页",
})


// 订阅hello2
event.on({
   //事件名
   eventName: 'hello2',
   //接收到事件后执行的回调函数
   callback: function (params) {
      console.log("=======111 订阅hello2=======", params)
   },
   // 对此订阅行为的说明
   notes: "当hello2事件发生时,获取本地秘钥与远程数据进行对比",
})

// 订阅hello2
event.on({
   //事件名
   eventName: 'hello2',
   //接收到事件后执行的回调函数
   callback: function (params) {
      console.log("=======222 订阅hello2=======", params)
   },
   // 对此订阅行为的说明
   notes: "当hello2事件发生时,获取本地秘钥与远程数据进行对比",
})




event.cancel("hello", fn3); // 取消对hello的第三个订阅
// event.cancelAll("hello"); //取消对hello事件的所有订阅
// event.cancelAll(); //取消所有事件的订阅


// 发布hello事件
event.emit("hello", 999)
// 发布hello2事件
event.emit("hello2", 999); //这时就只会执行两个回调了

console.log("=====查询订阅 所有事件名=========", event.queryOn(1)) //三个订阅
console.log("=====查询订阅 hello2=========", event.queryOn(2,"hello2")) //两个订阅



```
## 观察者模式的优点与缺点

**优点**
1. 事件上的解耦，
2. 对象之间的解耦
既可用于异步编程中，也可以用帮助我们完成更松耦合的代码编写。

**缺点**
1. 创建订阅者本身要消耗一定的时间和内存
2. 当订阅一个消息时，也许此消息并没有发生，但这个订阅者会始终存在内存中。
3. 观察者模式弱化了对象之间的联系，这本是好事情，但如果过度使用，对象与对象之间的联系也会被隐藏的很深，会导致项目的难以跟踪维护和理解。
    所以这里为了方便观察，此版本对on方法进行了改造，允许传入订阅注释说明。
    然后还添加一个查看所有订阅的方法，这样我们就可以知道一个事件有哪些订阅了，并且订阅的目的是什么也有注释进行说明

## 用途

1. 在前端中，各种SPA项目里面的组件通信，可以使用这个方式实现（类似于vue中的中央事件总线bus）
2. 在前后端都可以通用的是：在某种状态下要执行许多函数模块时，就可以以这种发布订阅的方式进行
3. 前后端通信时也可以使用这种方式
     对于reseful方式接口，可以实现为后端订阅 前端发布（其实就是路由的一种变形，本质上还是路由）
     对于socket请求，前后端都可以即发布又订阅（标准中已经实现））


## 一些相关文章
https://www.cnblogs.com/tugenhua0707/p/4100876.html 

https://www.jianshu.com/p/e751d0ef4557

