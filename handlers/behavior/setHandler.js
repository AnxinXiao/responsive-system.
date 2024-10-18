import trigger from "../../effect/trigger.js";
import { TriggerOpTypes, hasChange } from "../../utils.js";
export default function (target, key, value) {
  //关于具体类型判断，设置，新增

  const type = target.hasOwnProperty(key)
    ? TriggerOpTypes.SET
    : TriggerOpTypes.ADD;

  // 设置前缓存旧制
  const oldValue = target[key];
  // 缓存旧数组长度
  const oldLength = Array.isArray(target) ? target.length : undefined;
  // 先进性设置操作
  const result = Reflect.set(target, key, value);
  // 要不要派发更行需要一些判断
  if (hasChange(oldValue, value)) {   
    if (key !== "length") {
      // 判断 length 是否发生改变
      // 如果修改了数组的 length 属性，需要重新计算数组的索引
      trigger(target, type, key);
      if (Array.isArray(target) && oldLength !== undefined) {
        // 触发数组的 length 拦截器
        trigger(target, TriggerOpTypes.SET, "length");
      }
    }else{
      // 修改数组的 length 属性显示变化
      // 长度改变且小于旧长度，需要重新计算索引
      for(let i = target.length; i < oldLength; i++){
        trigger(target, TriggerOpTypes.DELETE, i);
      }
    }
  }
  

  return result;
}
