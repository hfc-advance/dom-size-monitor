
import { observe as resizeObserver } from './observer/resizeObserver.js'
//! 监听
let monitor = window.ResizeObserver ? resizeObserver : null

export {
  monitor
}
