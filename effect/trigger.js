// 这是触发器
import { TriggerOpTypes, TrackOpTypes, ITERATE_KEY } from "../utils.js";
import { targetMap, activeEffect } from "./effect.js";

/**
 * 定义了一个映射，描述了不同操作类型（如设置、添加、删除）对应的触发类型。
 */
const triggerTypeMap = {
  [TriggerOpTypes.SET]: [TrackOpTypes.GET],
  [TriggerOpTypes.ADD]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
  [TriggerOpTypes.DELETE]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
};

/**
 * 定义了一个映射，描述了不同操作类型（如设置、添加、删除）对应的触发类型。
 * @param {*} target 原始对象
 * @param {*} type 操作的类型
 * @param {*} key 操作的属性
 */
export default function (target, type, key) {
  // 要做的事情很简单，就是找到依赖，然后执行依赖
  const effectFns = getEffectFns(target, type, key); // 调用 getEffectFns 函数获取与当前操作相关的依赖函数集合。
  if (!effectFns) return; // effectFn 是当前活动的 effect，跳过执行。
  for (const effectFn of effectFns) {
    // 找到依赖函数，遍历它们并执行。
    if (effectFn === activeEffect) continue;
    if (effectFn.options && effectFn.options.shcheduler) {
      // effectFn 有 shcheduler 选项，则调用用户提供的调度函数；否则直接执行 effectFn。
      // 说明用户传递了回调函数，用户期望自己来处理依赖的函数
      effectFn.options.shcheduler(effectFn);
    } else {
      // 执行依赖函数
      effectFn();
    }
  }
}

/**
 * 根据 target、type、key 这些信息找到对应的依赖函数集合
 * @param {*} target
 * @param {*} type
 * @param {*} key
 */
function getEffectFns(target, type, key) {
  const propMap = targetMap.get(target); // 从 targetMap 中获取与 target 相关的属性映射。
  if (!propMap) return;

  // 如果是新增或者删除操作，会涉及到额外触发迭代
  const keys = [key];
  if (type === TriggerOpTypes.ADD || type === TriggerOpTypes.DELETE) {
    keys.push(ITERATE_KEY); // 添加 ITERATE_KEY 到要查找的键列表中。
  }

  const effectFns = new Set(); // 用于存储依赖的函数

  for (const key of keys) {
    const typeMap = propMap.get(key);
    if (!typeMap) continue;

    const trackTypes = triggerTypeMap[type];
    for (const trackType of trackTypes) {
      const dep = typeMap.get(trackType);
      if (!dep) continue;
      for (const effectFn of dep) {
        effectFns.add(effectFn);
      }
    }
  }
  return effectFns;
}
