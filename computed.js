import { effect } from "./effect/effect.js";
import track from "./effect/track.js";
import trigger from "./effect/trigger.js";
import { TrackOpTypes, TriggerOpTypes } from "./utils.js";
/**
 * 进行参数归一化
 * @param {*} getterOrOptions //可能是 getter函数，也可能是一个包含 getter 和 setter 的对象
 */
function normalizeParams(getterOrOptions) {
  // 1.判断是否是函数
  if (typeof getterOrOptions === "function") {
    // 传递的是一个 getter 函数
    return {
      getter: getterOrOptions,
      setter: undefined,
    };
  }
  // 2.判断是否是包含 getter 和 setter 的对象
  return {
    getter: getterOrOptions.get,
    setter: getterOrOptions.set,
  };
}
export function computed(getterOrOptions) {
  // 参数归一化
  const { getter, setter } = normalizeParams(getterOrOptions);

  let value; // 缓存计算属性的值
  let dirty = true; //脏值 标志，判断 是否需要重新计算

  const effectFn = effect(getter, {
    lazy: true, // 懒执行，第一次不执行，只有当读取 value 属性时，才会执行
    shcheduler() {
      // 监听到依赖发生变化，重新计算
      dirty = true;
      trigger(obj, TriggerOpTypes.SET, "value"); // 触发依赖
    },
  });

  // 返回一个对象
  const obj = {
    get value() {
      track(obj, TrackOpTypes.GET, "value"); // 依赖收集
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      return value;
    },
    set value(newValue) {
      // 2.调用 setter 函数，设置计算属性的值
      setter && setter(newValue);
    },
  };
  return obj;
}
