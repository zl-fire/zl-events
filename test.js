// 引入和实例化
const ZL_Events=require("./index.js");
const event=new ZL_Events();

// 订阅hello
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

// 取消对hello的第三个订阅
console.log("=====ZL_Events=========",ZL_Events) //三个订阅
event.cancel("hello",fn3);
console.log("=====ZL_Events=========",ZL_Events) //两个订阅


// 再次发布hello事件
event.emit("hello",999); //这时就只会执行两个回调了