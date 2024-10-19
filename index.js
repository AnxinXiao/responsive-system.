// 测试文件
import { reactive } from "./reactive.js";
import { watch } from "./watch.js";

const obj = reactive({
  a: 1,
  b: 18,
});

watch(
  () => obj.a + obj.b,
  (newValue, oldValue) => {
    console.log("sum is" + newValue + "," + "oldValue is" + oldValue);
  },
  {
    flush: true,
  }
);
obj.a++;
obj.b++;
