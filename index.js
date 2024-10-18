// 测试文件
import { reactive } from "./reactive.js";
import { effect } from "./effect/effect.js";
import { lazy } from "react";

const obj = {
  a: 1,
  b: 2,
};

const state = reactive(obj);

function fn() {
  console.log('fn');
  console.log(state.a)+1;
}
let isRun = false;
const effectFn = effect(fn,{
  lazy:true,
  scheduler(eff){
    isRun = true
    eff()
  }
})
effectFn(fn)

state.a++
state.a++
state.a++
state.a++
state.a++

