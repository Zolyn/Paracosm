---
title: Rust 学习笔记 (1)
date: 2022-10-11
outline: deep
---
:::info 提示
在非必要情况下，本笔记的代码块中都默认省略`main`函数的定义
:::

## UnCategorized
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

只有loop中的break才能指定返回值，在while结构或for迭代结构中使用的break不具备该功能

## 变量
在Rust中，“赋值”这一行为更确切的说法为“绑定”，但两者在日常中可以混用，哪个好理解选哪个

## 栈与堆
![stack_and_heap](https://rust-book.junmajinlong.com/ch5/2020_12_23_1608733444541.png)

**1. 栈适合存放存活时间短的数据**

**2. 数据要存放于栈中，要求数据所属数据类型的大小是已知的。**

因为只有这样，Rust编译器才知道在栈中为该数据分配多少内存

**3. 使用栈的效率要高于使用堆**

**4. Rust中各种类型的值默认都存储在栈中，除非显式地使用`Box::new()`将它们存放在堆上。**

但数据要存放在栈中，要求其数据类型的大小已知。对于静态大小的类型，可直接存储在栈上

注意：
- 将栈中数据赋值给变量时，数据直接存放在栈中。比如`i32`类型的33，33直接存放在栈内，而不是在堆中存放33并在栈中存放指向33的指针

- 因为类型的值默认都分布在栈中(即便是动态类型的数据，但也通过胖指针改变了该类型的值的表现形式)，所以创建某个变量的引用时，引用的是栈中的那个值

- 有些数据是0字节的，不需要占用空间，比如()
- 尽管【容器】结构中(如数组、元组、Struct)可以存放任意数据，但保存在容器中的要么是原始类型的栈中值，要么是指向堆中数据的引用，所以这些容器类型的值也在栈中。例如，对于`struct User {name: String}`，name字段存储的是String类型的胖指针，String类型实际的数据则在堆中
尽管`Box::new(T)`可以将类型T的数据放入堆中，但Box类型本身是一个struct，它是一个胖指针(更严格地说是智能指针)，它在栈中

**5. Rust除了使用堆栈，还使用全局内存区(静态变量区和字面量区)**

字符串字面量、static定义的静态变量(相当于全局变量)都会硬编码嵌入到二进制程序的全局内存区。全局内存区的数据是编译期间就可确定的，且存活于整个程序运行期间

**6. Rust中允许使用const定义常量。常量将在编译期间直接以硬编码的方式内联(inline)插入到使用常量的地方**

某些函数也可以内联，但只有那些频繁调用的短函数才适合被内联，并且内联会导致程序的代码膨胀。

**附加参考资料**：

[通过位置和值理解内存模型 - Rust入门秘籍](https://rust-book.junmajinlong.com/ch5/03_rust_place_value.html)

## 作用域
函数作用域内，无法访问函数外部的变量，而其他大括号的作用域，可以访问大括号外部的变量。

在Rust中，能否访问外部变量称为【捕获环境】。比如函数是不能捕获环境的，而大括号可以捕获环境。

## 所有权规则
- Rust中的每个值都有一个被称为其所有者的变量(即：值的所有者是某个变量)
- 值在任一时刻有且只有一个所有者
- 当所有者(变量)离开作用域，这个值将被销毁

补充：所有者离开作用域会导致值被销毁，这个过程实际上是调用一个名为`drop`的函数来销毁数据释放内存。销毁的数据特指堆栈中的数据，如果变量绑定的值是全局内存区内的数据，则数据不会被销毁。

### 容器集合类型

容器类型中可能包含栈中数据值(特指实现了Copy的类型)，也可能包含堆中数据值(特指未实现Copy的类型)

```rust
let tup = (5, String::from("hello"));
```

容器变量拥有容器中所有元素值的所有权。因此，当上面tup的第二个元素的所有权转移之后，tup将不再拥有它的所有权，这个元素将不可使用，tup自身也不可使用，但仍然可以使用tup的第一个元素。

```rust
let tup = (5, String::from("hello"));

// 5拷贝后赋值给x，tup仍有该元素的所有权
// 字符串所有权转移给y，tup丢失该元素所有权
let (x, y) = tup;    
println!("{},{}", x, y);   // 正确
println!("{}", tup.0);     // 正确
println!("{}", tup.1);  // 错误
println!("{:?}", tup);  // 错误
```

## Move 语义基础
所有权的转移，涉及到的过程是拷贝到目标变量，同时重置原变量到未初始状态，整个过程就像是进行了一次数据的移动。

函数参数类似于变量赋值，在调用函数时，会将所有权移动给函数参数。

函数返回时，返回值的所有权从函数内移动到函数外变量。

## Copy 与 Clone
Move实际上是进行了拷贝，只不过拷贝后让原始变量变回未初始化状态了，而Copy的行为，就是保留原始变量。

但Rust默认是使用Move语义，如果想要使用Copy语义，要求要拷贝的数据类型实现了`Copy` Trait。

实现`Copy` Trait 需要同时实现 `Clone` Trait

Copy 与 Clone 在**默认实现**上的区别：
- Copy时，只拷贝变量本身的值，如果这个变量指向了其它数据，则不会拷贝其指向的数据
- Clone时，拷贝变量本身的值，如果这个变量指向了其它数据，则也会拷贝其指向的数据

也就是说，Copy是浅拷贝，Clone是深拷贝，Rust会对每个字段每个元素递归调用clone()，直到最底部。

## 引用与借用
引用分两种：
- 不可变引用（读）`&s`
- 可变引用（读写）`&mut s`

我们把创建引用的行为称之为“借用”

多个不可变引用可共存（可同时读）
```rust
let s = "hello".to_string();
let s1 = &s;
let s2 = &s;
println!("s1: {}, s2: {}", s1, s2);// 输出：s1: hello, s2: hello
```

可变引用需要引用的对象本身可变
```rust
let mut s = "hi".to_string();
let s1 = &mut s;
s1.push_str(" world!");
println!("{}", s1);// 输出：hello world!
```

### 可变引用的排他性
**1. 可变引用<u>同时</u>只能存在一个**

这种限制的好处就是使 Rust 在编译期就避免数据竞争，数据竞争可由以下行为造成：

- 两个或更多的指针同时访问同一数据
- 至少有一个指针被用来写入数据
- 没有同步数据访问的机制

数据竞争会导致未定义行为，这种行为很可能超出我们的预期，难以在运行时追踪，并且难以诊断和修复。所以 Rust 会在编译期避免这些情况产生。

**2. 可变引用与不可变引用不能<u>同时</u>存在**

不可变引用的用户肯定不希望自己借用的东西被别人改变了，但多个不可变引用是允许的，因为它们没有能力修改数据。

---

上述两个规则的重点在于“同时”，即“同一时刻”。<br />
也就是说，Rust 允许我们拥有多个可变（或可变+不可变）引用，只是不能**同时**拥有罢了

如果还不能理解，可以通过下面的两个角度及其例子来理解。还是那句话，哪个好理解选哪个

#### 从作用域角度理解
在新编译器中（Rust 1.31后），引用作用域的结束位置从花括号（`}`）变成了**最后一次使用**的位置

**也就是说，一个引用的作用域从声明的地方开始一直持续到最后一次使用为止**

下面是一个拥有多个可变引用的错误示例：
```rust
let mut s = String::from("a");

let s1 = &mut s; // s1作用域开始
ss1.push_str("b");
let s2 = &mut s; // s2作用域开始并结束

println!("{}", s1); // s1作用域结束
// println!("{}, {}", s1, s2); 同理，只不过s2的作用域延长到此处了，可能更好理解一点
```
错误信息如下：
```text
error[E0499]: cannot borrow `s` as mutable more than once at a time 同一时间无法对 `s` 进行两次可变借用
 --> src/main.rs:6:12
  |
4 |   let s1 = &mut s;
  |            ------ first mutable borrow occurs here 首个可变引用在这里借用
5 |   s1.push_str("b");
6 |   let s2 = &mut s;
  |            ^^^^^^ second mutable borrow occurs here 第二个可变引用在这里借用
7 |
8 |   println!("{}", s1);
  |                  -- first borrow later used here 第一个借用在这里使用
```
因为可变引用`s1`和`s2`的作用域发生**重叠**，所以这段代码无法通过编译

要解决这个问题，可以试试这样
```rust
let mut s = String::from("a");

let s1 = &mut s;
s1.push_str("b");
println!("{}", s1); // s1作用域结束，输出：ab

let s2 = &mut s; // s2作用域开始
s2.push_str("c");
println!("{}", s1); // s2作用域结束，输出：abc
```
因为可变引用`s1`和`s2`的作用域并没有**重叠**，所以这段代码是可以通过编译的

对于可变+不可变引用也是同理，下面是一个错误示例
```rust
let mut s = String::from("hello");

let r1 = &s; // r1作用域开始
let r2 = &s; // r2作用域开始
let r3 = &mut s; // r3作用域开始

println!("{}, {}, and {}", r1, r2, r3);// r1 r2 r3作用域结束
```
错误信息如下
```text
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
              无法借用可变 `s` 因为它已经被借用了不可变
 --> src/main.rs:6:12
  |
4 |   let r1 = &s; // r1作用域开始
  |            -- immutable borrow occurs here 不可变借用发生在这里
5 |   let r2 = &s; // r2作用域开始
6 |   let r3 = &mut s; // r3作用域开始
  |            ^^^^^^ mutable borrow occurs here 可变借用发生在这里
7 |
8 |   println!("{}, {}, and {}", r1, r2, r3);// r1 r2 r3作用域结束
  |                              -- immutable borrow later used here 不可变借用在这里使用
```
因为可变引用`r3`和不可变引用`r1` `r2`的作用域发生**重叠**，所以无法通过编译

解决方法也很简单
```rust
let mut s = String::from("hello");

let r1 = &s; // r1作用域开始
let r2 = &s; // r2作用域开始

println!("{} and {}", r1, r2); // r1 r2作用域结束，输出：hello and hello

let r3 = &mut s; // r3作用域开始
println!("{}", r3) // r3作用域结束，输出：hello
```

::: details Note
编译器在作用域结束之前判断不再使用的引用的能力被称为 **非词法作用域生命周期**（Non-Lexical Lifetimes，简称 NLL）

你可以在[这里](https://blog.rust-lang.org/2018/12/06/Rust-1.31-and-rust-2018.html#non-lexical-lifetimes)找到它的更多信息
:::
#### 从读写锁角度理解
个人感觉和作用域的角度有些相似，但篇幅有点长，不想写了，详见[此处](https://rust-book.junmajinlong.com/ch6/04_understand_mutable_ref.html)

#### 关于原始变量

需要注意的是，对于一个可变变量而言，不管引用是可变还是不可变的，都不能在引用的作用域内修改原始变量

错误示例：
```rust
let mut s = String::from("hello");

let r = &s;

s = "s".to_string();

println!("{}", r);
```
```rust
let mut s = String::from("hello");

let r = &mut s;

s = "s".to_string();

println!("{}", r);
```
错误信息如下：
```text
error[E0506]: cannot assign to `s` because it is borrowed 不能对`s`赋值，因为它被借用
 --> src/main.rs:6:3
  |
4 |   let r = &s;
  |           -- borrow of `s` occurs here `s`的借用发生在这里
5 |
6 |   s = "s".to_string();
  |   ^ assignment to borrowed `s` occurs here 对`s`的赋值发生在这里
7 |
8 |   println!("{}", r);
  |                  - borrow later used here 借用在这里使用
```

可以这么理解：因为原始变量可变，所以可变引用的排他性规则同样适用于原始变量本身

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
- [由Kaisery 翻译的trpl](https://kaisery.github.io/trpl-zh-cn/title-page.html)：The Rust Programming Language的简体中文版，由于只是翻译，顺序和官方是一致的，但官方的顺序给我的感觉是一边教我rust的概念一边又教我cargo相关的知识（或者说，rust工具链的相关知识），稍微有点怪，阅读体验不是很舒服，而且我粗略翻了下issue也看到有人[反馈](https://github.com/rust-lang/book/issues/2790#issuecomment-881511345)。个人觉得它适合粗略阅读或作为补充阅读

- [Rust 圣经](https://course.rs/about-book.html)：相比前者语言更加通俗易懂，且个人认为顺序相比前者（其实应该说是官方）更具有条理性，部分内容相较前者有缺少，且有时会穿插一些超纲的内容，可能会让某些人（比如我）感到迷惑

- [Rust by practice](https://zh.practice.rs/why-exercise.html)：如果按照Rust 圣经的顺序来做的话，可能会因为一些题用到了超纲的知识而不会做，且某些情况下（如：当你觉得某个题没有出的意义时）可能需要多动点脑子来理解出题的目的

- [骏马金龙 Rust入门秘籍](https://rust-book.junmajinlong.com/about.html)：我最开始看的教程，够干货，内容相比上面提到的书籍不是很多，也稍微有点旧，作者随缘更新，但还是值得一看
