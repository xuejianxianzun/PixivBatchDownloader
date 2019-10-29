"use strict";
class A {
    init() {
        console.log(111111);
    }
}
class A1 extends A {
    constructor(){
        return new Date()
    }
}
const a = new A1();
