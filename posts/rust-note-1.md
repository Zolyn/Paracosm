---
title: Rust 学习笔记 (1)
date: 2022-10-11
---
## main
对于一个可变变量而言，不管引用是可变还是不可变的，都不能在引用的作用域内直接修改变量

结构体实例不能调用关联函数（顾名思义，仅仅只是和结构体有关联的函数而非方法，不存在于结构体实例中）

`trait`中`Self`代指实现方
结构体中`Self`代指本身，方法中解构结构体可以用Self

若带有泛型参数，则`Self`会指向具体的类型

“可反驳”和“不可反驳”模式可以理解为“部分匹配”（匹配部分情况）和“完全匹配”（匹配所有情况）

tuple只保存一个元素时也得加上`,`

切片操作允许使用`usize`类型的变量作为切片的边界，需要小心

由于切片数据的长度无法在编译期间得到确认(比如切片操作的边界是变量时`s[..n]`)，而编译器是不允许使用大小不定的数据类型的，因此无法直接去使用切片数据(比如无法直接将它赋值给变量)。

Rust为了保证字符串总是有效的Unicode字符，它不允许用户直接修改字符串中的字符，所以也无法通过切片引用来修改源字符串，除非那是ASCII字符(ASCII字符总是有效的unicode字符)

Array的引用可以当作Slice来使用，同时Array可以调用Slice的所有方法（`.`操作符的自动创建或解引用）

## 定义方式
```rust
fn NAME<GENERIC: TRAIT, const GENERIC: TYPE>() {}
```
```rust
impl TRAIT for STRUCT_OR_ENUM {}
```

# ?
## 1
```rust
let s = "hello".to_string();
let r1 = &mut s;
let r2 = &mut s;
```
```rust
let s = "hello".to_string();
let r1 = &mut s;
let r2 = &mut *r1;
```
## 2
```rust
struct Bar;
struct Foo;
struct FooBar;

impl std::ops::Add<Bar> for Foo {}
                   ^^^
fn add<T: std::ops::Add<Output = T>>(x: T, y: T) -> T {}
                        ^^^^^^^^^^
```
## 3
```rust
fn something<T>(val: T)
where
    Assert<{ core::mem::size_of::<T>() < 768 }>: IsTrue,
    //       ^-----------------------------^ 这里是一个 const 表达式，换成其它的 const 表达式也可以
{
    //
}
```

## 书评
- 由Kaisery 翻译的trpl：The Rust Programming Language的简体中文版，由于只是翻译，顺序和官方是一致的，但官方的顺序给我的感觉是一边教我rust的概念一边又教我cargo相关的知识（或者说，rust工具链的相关知识），稍微有点怪，阅读体验不是很舒服，而且我粗略翻了下issue也看到有人[反馈](https://github.com/rust-lang/book/issues/2790#issuecomment-881511345)。个人觉得它适合粗略阅读或作为补充阅读
- Rust 圣经：相比前者语言更加通俗易懂，且个人认为顺序相比前者（其实应该说是官方）更具有条理性，部分内容相较前者有缺少，且有时会穿插一些超纲的内容，可能会让某些人（比如我）感到迷惑
- Rust by practice：如果按照Rust 圣经的顺序来做的话，可能会因为一些题用到了超纲的知识而不会做，且某些情况下（如：当你觉得某个题没有出的意义时）可能需要多动点脑子来理解出题的目的
