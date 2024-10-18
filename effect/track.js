import { TrackOpTypes, ITERATE_KEY } from "../utils.js";
import { activeEffect, targetMap } from "./effect.js";
let shouldTrack = true; // 是否需要收集依赖
/**
 * 暂停收集器： 暂停收集依赖
 */
export function pauseTracking() {
  shouldTrack = false;
}
/**
 * 恢复收集器： 恢复收集依赖
 */
export function resumeTracking() {
  shouldTrack = true;
}

/**
 * 收集器： 收集依赖
 * @param {*} target 原始对象
 * @param {*} type 进行的操作类型
 * @param {*} key 针对哪一个属性
 */
export default function (target, type, key) {
  // 判断是否需要收集依赖。
  if (!shouldTrack || !activeEffect) return; // 开关关闭，不收集依赖
  let propMap = targetMap.get(target);
  if (!propMap) {
    propMap = new Map();
    targetMap.set(target, propMap);
  }
  // 对 key 值 参数归一化
  if (type === TrackOpTypes.ITERATE) {
    key = ITERATE_KEY;
  }
  let typeMap = propMap.get(key);
  if (!typeMap) {
    typeMap = new Map();
    propMap.set(key, typeMap);
  }
  // 根据 type 值，找对应 set
  let depSet = typeMap.get(type);
  if (!depSet) {
    depSet = new Set();
    typeMap.set(type, depSet);
  }
  // 将当前激活的 effect 添加到依赖集合中
  if (!depSet.has(activeEffect)) {
    depSet.add(activeEffect);
    activeEffect.deps.push(depSet); // 将依赖收集到 effect 中
  }
}
