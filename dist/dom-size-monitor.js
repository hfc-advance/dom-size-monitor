(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['dom-size-monitor'] = {})));
}(this, (function (exports) { 'use strict';

  //! 要监听的dom属性
  const attr = '_dom_size_monitor';

  //! DOM绑定的事件模型
  let attrModel = {};
  let observer = null;
  //! 存储callback模型
  let observe = (element, callback) => {
    //! 判断是否DOM
    if (!(element instanceof Element)) {
      throw new Error('param is not an Element');
    }
    //! 创建监听器
    createObserver();
    //! 判断该元素是否已经注册过
    let domAttr = element.getAttribute(attr);
    let callbacks = attrModel[domAttr];
    //! 注册过
    if (domAttr && callbacks && callbacks.length > 0) {
      if (callbacks.indexOf(callback) < 0) {
        observer.observe(element);
        attrModel[domAttr].push(callback);
      }
    } else {
      domAttr = Math.random().toString(16).slice(2);
      element.setAttribute(attr, domAttr);
      observer.observe(element);
      //! 没有注册
      attrModel[domAttr] = [callback];
    }
    //! 绑定之后返回数据
    return {
      //! 卸载当前绑定事件
      unMonitor
      //! 卸载当前绑定事件
    };function unMonitor() {
      let domAttr = element.getAttribute(attr);
      let callbacks = attrModel[domAttr];
      if (domAttr && callbacks && callbacks.length > 0) {
        element.removeAttribute(attr);
        let index = callbacks.indexOf(callback);
        callbacks.splice(index, 1);
      }
    }
  };

  //! 创建observer
  function createObserver() {
    if (observer) return false;
    observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        let { target, contentRect: { width = 0, height = 0 } = {} } = entry;
        let currentAttr = target && target.getAttribute && target.getAttribute(attr);
        let callbacks = currentAttr && attrModel[currentAttr];
        if (callbacks) {
          callbacks.forEach(callback => {
            let data = { width, height };
            callback(data);
          });
        }
      });
    });
  }

  //! 监听
  let monitor = window.ResizeObserver ? observe : null;

  exports.monitor = monitor;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=dom-size-monitor.js.map
