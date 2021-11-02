'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['zl-nodefs'] = factory());
})(undefined, function () {
    'use strict';

    var ZL_Events = function () {
        function ZL_Events() {
            _classCallCheck(this, ZL_Events);
        }

        _createClass(ZL_Events, [{
            key: 'on',

            // 订阅事件(每次订阅都往这个事件名对应的数组中添加一个回调函数元素)
            value: function on(params) {
                // 对对象参数进行解构
                var eventName = params.eventName,
                    callback = params.callback,
                    notes = params.notes;
                // 如果不是对象

                if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
                    eventName = arguments[0];
                    callback = arguments[1];
                    notes = "";
                }
                var listenObj = ZL_Events.listenObj;
                var theTime = new Date();
                var obj = { callback: callback, notes: notes, time: theTime.toLocaleString() + ":" + (theTime.getTime() + "").slice(-3) };
                if (!listenObj[eventName]) {
                    listenObj[eventName] = [obj];
                } else {
                    // 先判断下listenObj中是否已经存在相同的监听函数，如果存在就过滤
                    // 获取当前事件所有的订阅函数
                    var fns = listenObj[eventName].map(function (ele) {
                        return ele.callback.toString();
                    });
                    var index = fns.indexOf(callback.toString());
                    // 不存在就添加监听
                    if (index == -1) {
                        listenObj[eventName].push(obj);
                    }
                }
            }

            // 查询所有的事件与订阅函数.
            // type: 0 查询所有内容(默认为0)，1 查询所有的事件，2 查询具体事件名对应的所有回调 (当为2时需要传入eventName参数表示事件名)

        }, {
            key: 'queryOn',
            value: function queryOn() {
                var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var eventName = arguments[1];

                switch (type) {
                    case 0:
                        return ZL_Events.listenObj; //JSON.stringify(ZL_Events.listenObj, null, 4);
                    case 1:
                        return Object.keys(ZL_Events.listenObj);
                    case 2:
                        return JSON.stringify(ZL_Events.listenObj[eventName], null, 4);
                }
            }

            // 取消订阅(每次取消订阅 都往这个事件名对应的数组中删除一个指定的回调函数元素)

        }, {
            key: 'cancel',
            value: function cancel(eventName, callback) {
                var listenObj = ZL_Events.listenObj;
                if (listenObj[eventName]) {
                    // 获取当前事件所有的订阅函数
                    var fns = listenObj[eventName].map(function (ele) {
                        return ele.callback.toString();
                    });
                    // 在回调函数里面查询，找到后根据下标删除整个对象元素
                    var index = fns.indexOf(callback.toString());
                    if (index !== -1) {
                        listenObj[eventName].splice(index, 1);
                    }
                }
            }

            // 取消所有订阅(每次取消订阅 都往这个事件名对应的数组中删除一个指定的回调函数元素)

        }, {
            key: 'cancelAll',
            value: function cancelAll(eventName) {
                var listenObj = ZL_Events.listenObj;
                if (eventName) {
                    if (listenObj[eventName]) {
                        listenObj[eventName] = []; //取消eventName事件的所有订阅事件
                    }
                } else {
                    ZL_Events.listenObj = {}; //取消所有的事件类型的订阅
                }
            }

            // 发布事件

        }, {
            key: 'emit',
            value: function emit(eventName, params) {
                var listenObj = ZL_Events.listenObj;
                if (listenObj[eventName]) {
                    listenObj[eventName].forEach(function (obj) {
                        obj.callback(params);
                    });
                }
            }
        }]);

        return ZL_Events;
    }();
    // 事件对象集合,设置为静态的，方便不同的示例共享


    ZL_Events.listenObj = {
        // 键为事件名，值为对象数组，包含了这个事件名的所有订阅函数和说明信息
        // "eventName": [{ callback, notes, time: new Date().toLocaleString() }],，
    };
    // 用来存储一些全局数据,格式: store.key=val;
    ZL_Events.store = {};

    return ZL_Events;
});
