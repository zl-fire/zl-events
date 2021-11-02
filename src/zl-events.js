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
