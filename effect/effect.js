/**
 * 用于记录当前活动的 effect
 */
export let activeEffect = undefined;
export const targetMap = new WeakMap(); // 用来存储对象和其属性的依赖关系
const effectStack = [];

/**
 * 该函数的作用，是执行传入的函数，并且在执行的过程中，收集依赖
 * @param {*} fn 要执行的函数
 */
export function effect(fn, options = {}) {
  // 接受一个函数 fn 和一个可选的 options 对象。
  const { lazy = false } = options; // options 对象可以包含一个 lazy 属性，指示是否延迟执行。
  const environment = () => {
    // environment 函数是一个内部函数，用于执行传入的 fn 函数并收集依赖。
    try {
      activeEffect = environment;
      effectStack.push(environment); // 推入 effectStack。
      cleanup(environment); //该函数用于清理当前环境函数的依赖
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  environment.deps = [];
  environment.options = options;
  if (!lazy) {
    environment();
  }
  return environment;
}

export function cleanup(environment) {
  let deps = environment.deps; // 拿到当前环境函数的依赖（是个数组）
  if (deps.length) {
    deps.forEach((dep) => {
      // deps 数组不为空，则遍历每个依赖并从中删除当前环境函数
      dep.delete(environment);
    });
    deps.length = 0;
  }
}
