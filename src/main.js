
import { getSensor, removeSensor } from './sensorPool'

export const bind = (element, cb) => {
  const sensor = getSensor(element)

  // 绑定新的方法
  sensor.bind(cb)

  // 返回 unbind 方法
  return () => {
    sensor.unbind(cb)
  }
}

export const clear = element => {
  const sensor = getSensor(element)

  removeSensor(sensor)
}
