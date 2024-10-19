import { effect, cleanup } from "./effect/effect.js";
/**
 *
 * @param {*} source // 监听的数据源(响应式数据 或 getter函数)
 * @param {*} cb // 回调函数
 * @param {*} options // 选项
 */
export function watch(source, cb, options = {}) {
  // 参数归一化
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    // 监听对象
    getter = () => traverse(source);
  }
  let oldValue, newValue; // 缓存旧值和新值

  let job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      if (options.flush === "post") {
        Promise.resolve().then(job); // 延迟执行
      } else {
        job();
      }
    },
  });

  // 处理 'once' 选项
  const originalJob = job; // 存储原始的 job 函数
  job = () => {
    originalJob(); // 调用原始的 job
    if (options.once) { 
      cleanup(effectFn); // 如果 'once' 为 true，则在第一次执行后清理
    }
  };

  if (options.immediate) { // 立即执行
    job();
  } else {
    effectFn();
  }

  if (options.immediate) {
    job();
  } else {
    effectFn();
  }
  return () => {
    cleanup(effectFn);
  };
}

/**
 *  递归读取对象中的值(包括嵌套的属性)
 * @param {*} value
 * @param {*} seen
 * @returns
 */
function traverse(value, seen = new Set()) {
  // seen 用来去重
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  seen.add(value);
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}
