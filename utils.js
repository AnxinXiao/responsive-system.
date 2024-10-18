// 提供工具方法的文件

/**
 * 判断是否是对象
 * @param {*} target 要判断的值
 * @returns
 */
export function isObject(target) {
  return typeof target === "object" && target !== null;
}

/**
 * 判断值是否改变
 * @param {*} oldValue 
 * @param {*} newValue 
 * @returns 
 */
export function hasChange(oldValue, newValue){
    return !Object.is(oldValue, newValue);
}


/**
 * 收集依赖的操作类型
 */
export const TrackOpTypes = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
};

/**
 * 触发依赖的操作类型
 */
export const TriggerOpTypes = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
};


/**
 * 特殊标识，用于标识一个对象是原始对象
 */
export const RAW = Symbol("raw");

export const ITERATE_KEY = Symbol("iterate");
