/*!
 * dom-size-monitor.js v1.0.0
 * (c) 2018-2018 崔海峰
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var id = 1;

var id$1 = (function () {
  return "" + id++;
});

var debounce = (function (fn) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;

  var timer = null;

  return function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timer);

    timer = setTimeout(function () {
      fn.apply(_this, args);
    }, delay);
  };
});

var SizeSensorId = 'size-sensor-id';

var SensorStyle = 'display:block;position:absolute;top:0;left:0;height:100%;width:100%;transform:translate3d(0,0,0);-webkit-transform:translate3d(0,0,0);overflow:hidden;pointer-events:none;z-index:-1;opacity:0';

var SensorClassName = 'size-sensor-object';

var createSensor = function createSensor(element) {
  // 感应器
  var sensor = null;
  // callback
  var listeners = [];
  var newSensor = function newSensor() {
    // 调整样式
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }

    var obj = document.createElement('object');
    obj.onload = function () {
      obj.contentDocument.defaultView.addEventListener('resize', resizeListener);
      // 直接触发一次 resize
      resizeListener();
    };
    obj.setAttribute('style', SensorStyle);
    obj.setAttribute('class', SensorClassName);
    obj.type = 'text/html';

    // 添加到 dom 结构中
    element.appendChild(obj);
    // 对于 ie 需要滞后，否则白屏，所以放到后面
    obj.data = 'about:blank';
    return obj;
  };

  /**
   * 统一触发 listeners
   */
  var resizeListener = debounce(function () {
    // 依次触发执行
    listeners.forEach(function (listener) {
      listener(element);
    });
  });
  var bind = function bind(cb) {
    // 如果不存在 sensor，则创建一个 object
    if (!sensor) {
      sensor = newSensor();
    }

    if (listeners.indexOf(cb) === -1) {
      listeners.push(cb);
    }
  };
  var destroy = function destroy() {
    if (sensor && sensor.parentNode) {
      if (sensor.contentDocument) {
        // 移除事件
        sensor.contentDocument.defaultView.removeEventListener('resize', resizeListener);
      }
      // 移除 dom
      sensor.parentNode.removeChild(sensor);
      // 初始化
      sensor = undefined;
      listeners = [];
    }
  };

  /**
   * 取消绑定
   * @param cb
   */
  var unbind = function unbind(cb) {
    var idx = listeners.indexOf(cb);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }

    // 不存在 listener，并且存在 sensor object
    // 则移除 object
    if (listeners.length === 0 && sensor) {
      destroy();
    }
  };

  return {
    element: element,
    bind: bind,
    destroy: destroy,
    unbind: unbind
  };
};

var createSensor$1 = function createSensor(element) {
  // 感应器
  var sensor = null;
  // callback
  var listeners = [];

  /**
   * 统一触发 listeners
   */
  var resizeListener = debounce(function () {
    // 依次触发执行
    listeners.forEach(function (listener) {
      listener(element);
    });
  });

  var newSensor = function newSensor() {
    var sensor = new ResizeObserver(resizeListener);
    // 监听 element
    sensor.observe(element);

    // 直接触发一次
    resizeListener();
    return sensor;
  };

  var bind = function bind(cb) {
    if (!sensor) {
      sensor = newSensor();
    }

    if (listeners.indexOf(cb) === -1) {
      listeners.push(cb);
    }
  };

  /**
   * 完全 destroy
   */
  var destroy = function destroy() {
    sensor.disconnect();

    listeners = [];
    sensor = undefined;
  };

  var unbind = function unbind(cb) {
    var idx = listeners.indexOf(cb);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }

    // 不存在 listener，并且存在 sensor object
    // 则移除 object
    if (listeners.length === 0 && sensor) {
      destroy();
    }
  };

  return {
    element: element,
    bind: bind,
    destroy: destroy,
    unbind: unbind
  };
};

/**
 * 传感器使用策略
 */
var createSensorFunc = function createSensorFunc() {
  return typeof ResizeObserver !== 'undefined' ? createSensor$1 : createSensor;
};

var createSensor$2 = createSensorFunc();

var Sensors = {};

var getSensor = function getSensor(element) {
  var sensorId = element.getAttribute(SizeSensorId);

  // 1. 已经存在，则直接取这个 sensor
  if (sensorId && Sensors[sensorId]) {
    return Sensors[sensorId];
  }

  // 2. 不存在则创建
  var newId = id$1();
  element.setAttribute(SizeSensorId, newId);

  var sensor = createSensor$2(element);
  // 添加到池子中
  Sensors[newId] = sensor;

  return sensor;
};

var removeSensor = function removeSensor(sensor) {
  var sensorId = sensor.element.getAttribute(SizeSensorId);

  // 移除 attribute
  sensor.element.removeAttribute(SizeSensorId);
  // 移除 sensor 对应的 事件 和 dom 结构
  sensor.destroy();

  // 存在则从 pool 中移除
  if (sensorId && Sensors[sensorId]) {
    delete Sensors[sensorId];
  }
};

var bind = function bind(element, cb) {
  var sensor = getSensor(element);

  // 绑定新的方法
  sensor.bind(cb);

  // 返回 unbind 方法
  return function () {
    sensor.unbind(cb);
  };
};

var clear = function clear(element) {
  var sensor = getSensor(element);

  removeSensor(sensor);
};

exports.bind = bind;
exports.clear = clear;
