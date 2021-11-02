// 引入和实例化
const ZL_Events = require("./index.js");
const event = new ZL_Events();

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

