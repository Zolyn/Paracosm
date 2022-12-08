私有成员可以被继承，因此可以在继承的类上访问

```js
class MyClass {
    // 声明一个私有的静态变量
    static #privateStaticVariable = "hello";

    #privateInstanceVar = "hi"
  
    // 声明一个公有的静态方法
    static publicStaticMethod() {
      console.log(this.#privateStaticVariable);
    }
    instanceMethod() {
        console.log(this.#privateInstanceVar);
    }
  }

class Sub extends MyClass {}

let c = new Sub();
c.instanceMethod()
```

而私有静态成员不能被继承，所以不可以在继承的类上访问

当然，不管是静态类型还是普通的私有成员，都能在当前类上通过方法（公开/私有）访问
