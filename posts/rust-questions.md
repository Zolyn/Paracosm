---
title: Rust 疑问记录
date: 2022-10-13
---
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