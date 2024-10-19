// 测试文件
import { reactive } from "./reactive.js";
import { computed } from "./computed.js";
import { effect } from "./effect/effect.js";


const obj = reactive({
  a: 1,
  b: 18,
});

const sum = computed(() => obj.a + obj.b);

effect(() => {
  console.log('render',sum.value);
});
obj.a = 2;
