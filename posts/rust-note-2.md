---
title: Rust 学习笔记 (2)
date: 2022-10-13
outline: deep
---
## 再次理解 Move
[全文地址](https://rust-book.junmajinlong.com/ch6/05_re_understand_move.html)

**当使用值的时候，就会产生位置，就会发生移动。**

有哪些地方会使用值呢？除了比较明显的会移动的情况，还有一些隐式的移动(或Copy)：
- 方法调用的真实接收者，如`a.meth()`，a会被移动(注意，a可能会被自动加减引用，此时a不是方法的真实接收者)
- 解引用时会Move(注意，解引用会得到那个值，但不一定会消耗这个值，有可能只是借助这个值去访问它的某个字段、或创建这个值的引用，这些操作可以看作是借值而不是使用值)
- 字段访问时会Move那个字段
- 索引访问时，会Move那个元素
- 大小比较时，会Move(注意，`a > b`比较时会先自动取a和b的引用，然后再增减a和b的引用直到两边类型相同，因此实际上Move(Copy)的是它们的某个引用，而不会Move变量本身)

示例：
```rust
#![allow(unused)]
fn main() {
  struct User {
    name: String
  }

  let user = User {
    name: "Yumeoto Zorin".to_string()
  };
  let name = (&user).name; // 报错，想要移动name字段，但user正被引用着，此刻不允许移走它的一部分
  
  let s = "hello".to_string();
  let s1 = *(&s); // 报错，解引用临时变量时触发移动，此时s正被引用着
  let s2 = &(*s); // 不报错，解引用得到值后，对这个值创建引用，不会消耗值

  impl User {
    fn func(&self) {
      let xx = *self; // 报错，解引用报错，self自身不是所有者，例如user.func()时，user才是所有者

      if (*self).name < "hello".to_string() {} // 不报错，比较时会转换为&((*self).name) < &("hello".to_string())
    }
  }
}
```

## 引用类型的 Copy 与 Clone
- 没有实现`Clone`时，引用类型的`clone()`将等价于`Copy`，但cilppy会提示该结果可能不符合预期（如果只是想拷贝引用，`Copy`是更好的选择）

- 实现了`Clone`时，引用类型的`clone()`将克隆并得到引用所指向的类型
