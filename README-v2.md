# js之观察者/发布订阅模式--v2

1. **更新点1：**
   
由于 观察者模式弱化了对象之间的联系，这本是好事情，但对象与对象之间的联系也会被隐藏的很深，会导致项目的难以跟踪维护和理解。

为了尽量降低这个影响，所以更新了这个版本：即**允许订阅事件时给上相关说明，同时提供事件和订阅函数查询功能**从而帮助我们理清其中关联和逻辑（在本版中，on方法被重写，当然仍然完全兼容v1版本的用法）

1. **更新点2：**
  给ZL_Events对象添加一个store静态属性，用于存储一些全局都可以访问的信息 (感觉和vue中的bus更像了)

## 使用示例
```js
// 引入和实例化
const ZL_Events=require("zl-events");
const event=new ZL_Events();

function fn3(params) {
   console.log("=======e3：验证身份是否通过，通过就调整到主页=========", params)
}

// 订阅hello
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

// event.cancel("hello", fn3); // 取消对hello的fn3订阅
// event.cancelAll("hello"); //取消对hello事件的所有订阅
// event.cancelAll(); //取消所有事件的订阅


// 发布hello事件
event.emit("hello", 999)
// 发布hello2事件
event.emit("hello2", 999); //这时就只会执行两个回调了

console.log("=====查询订阅 所有事件名=========", event.queryOn(1)) //三个订阅
console.log("=====查询订阅 hello2=========", event.queryOn(2,"hello2")) //两个订阅

// 存储全局通用的一些数据
ZL_Events.store.msg="存储在ZL_Events.store中的信息"

```
## 示例：在vue中实现全局通信

  这里以一个父子组件通信作为示例
  ![1635863842277](/assets/1635863842277.jpg)


APP组件代码
```js
<template>
  <div id="app">
    <button @click="fn">测试</button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <router-view />
  </div>
</template>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import ZL_Events from "zl-events";
window.ZL_Events=ZL_Events;
// 引入和实例化
const event = new ZL_Events();
export default {
  name: "home",
  components: {
    HelloWorld,
  },
  mounted() {
    // 订阅hello
    event.on({
      //事件名
      eventName: "sub",
      //接收到事件后执行的回调函数
      callback: function (params) {
        console.log("=======收到helloworld的推送=======", params);
      },
      // 对此订阅行为的说明
      notes: "app中监听hello事件",
    });
  },
  methods: {
    fn() {
      ZL_Events.store.msg="存储在ZL_Events.store中的信息"
      // 发布hello事件
      event.emit("app", '来自app组件的消息');
    },
  },
};
</script>

```

HelloWorld组件代码
```js
<template>
  <div class="hello">
    <button @click="fn">测试sub</button>

    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
      >.
    </p>
  </div>
</template>

<script>
import ZL_Events from "zl-events";
// 引入和实例化
const event = new ZL_Events();
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    // 订阅hello
    event.on({
      //事件名
      eventName: "app",
      //接收到事件后执行的回调函数
      callback: function (params) {
        console.log("=======收到app的推送=======", params);
        console.log("=======ZL_Events.store=======", ZL_Events.store);
      },
      // 对此订阅行为的说明
      notes: "app中监听hello事件",
    });
  },
  methods: {
    fn() {
      // 发布hello事件
      event.emit("sub", '来自子组件的消息');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

```
