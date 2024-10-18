import trigger from "../../effect/trigger.js";
import { TriggerOpTypes } from "../../utils.js";
export default function (target, key) {
  // 判断是否有该属性
  const hadKey = target.hasOwnProperty(key);

  // 进行删除行为
  const result = Reflect.deleteProperty(target, key);
  // 判断是否删除成功
  if (hadKey && result) {
    trigger(target, TriggerOpTypes.DELETE, key);
  }
  return result;
}
