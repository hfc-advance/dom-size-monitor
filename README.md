## dom-size-monitor
**高性能监听元素尺寸变化**

## 使用
**install**
```javascript
// es6
import { bind, clear } from 'dom-size-monitor'

//common
let { bind, clear } = require('dom-size-monitor')
```

- **bind**

**给元素添加一个大小变化监听事件，返回当前元素的解绑事件**
```javascript
// 绑定事件
const unbind = bind(document.querySelector('.container'), element => {
  // do what you want to to.
})

// 解绑事件
unbind()
```

- **clear**

**清除元素上面的所有大小变化监听事件**
```javascript
clear(document.querySelector('.container'))
```
