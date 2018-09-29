//---------------------Set the type for the parameter to Object instead of String.---------------------
function sayHello(name: (name: any){
   return `Hello, ${name}!`;
}
// This is working great:
console.log(sayHello("Kermit"));
// Why isn't this working? I want it to return "Hello, 9!"
console.log(sayHello(9));


//---------------------Optional Parameters---------------------
function fullName(firstName?: string, lastName?: string, middleName?: string) {
  let fullName = `${firstName} ${middleName} ${lastName}`;
  return fullName;
}
// This works:
console.log(fullName("Mary", "Moore", "Tyler"));
// What do I do if someone doesn't have a middle name?
console.log(fullName("Jimbo", "Jones"));


//----------------- 4. Interfaces and function parameters---------------------
interface Student {
    firstName: string;
    lastName: string;
    belts: number;
}

function graduate(ninja: Student){
        return `Congratulations, ${ninja.firstName} ${ninja.lastName}, you earned ${ninja.belts} belts!`;
    }
}
let christine = {
    firstName: "Christine",
    lastName: "Yang",
    belts: 2
}
let jay =  {
   firstName: "Jay",
   lastName: "Patel",
   belts: 4
}
// This seems to work fine:
console.log(graduate(christine));
// This one has problems:
console.log(graduate(jay));


// To describe a function type with an interface, we give the interface a call signature. This is like a function declaration with only the parameter list and return type given. Each parameter in the parameter list requires both name and type.
//Example from TS documentation
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// Once defined, we can use this function type interface like we would other interfaces. Here, we show how you can create a variable of a function type and assign it a function value of the same type.

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}

// For function types to correctly type-check, the names of the parameters donot need to match.We could have, for example, written the above example like this:

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean) {
  let result = src.search(sub);
  return result > -1;
}


//---------------------Indexable types---------------------------------
// Similarly to how we can use interfaces to describe function types, we can also describe types that we can “index into” like a[10], or ageMap["daniel"].
// Indexable types have an index signature that describes the types we can use to index into the object, along with the corresponding return types when indexing. Let’s take an example:
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
//Outputs "Bob"

//Debugging TS problem
(function(firstName, lastName, middleName) {
  var fullName = firstName + " " + middleName + " " + lastName;
  return fullName;
});
// This works:
console.log(function(fullName) { return; }, "Mary", "Moore", "Tyler");
// What do I do if someone doesn't have a middle name?
console.log(fullName ?  : any);
"Jimbo" + "Jones";
;


//=====================CLASS TYPES======================================
// Implementing an interface
// One of the most common uses of interfaces in languages like C# and Java, that of explicitly enforcing that a class meets a particular contract, is also possible in TypeScript.

interface ClockInterface {
  currentTime: Date;
}

class Clock implements ClockInterface {
  currentTime: Date;
  constructor(h: number, m: number) { }
}

// You can also describe methods in an interface that are implemented in the class, as we do with setTime in the below example:

interface ClockInterface {
  currentTime: Date;
  setTime(d: Date);
}

class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) { }
}
// Interfaces describe the public side of the class, rather than both the public and private side. This prohibits you from using them to check that a class also has particular types for the private side of the class instance.



//=============Difference between the static and instance sides of classes====
// Difference between the static and instance sides of classes
// When working with classes and interfaces, it helps to keep in mind that a class has two types: the type of the static side and the type of the instance side. You may notice that if you create an interface with a construct signature and try to create a class that implements this interface you get an error:

interface ClockConstructor {
  new(hour: number, minute: number);
}

class Clock implements ClockConstructor {
  currentTime: Date;
  constructor(h: number, m: number) { }
}
// This is because when a class implements an interface, only the instance side of the class is checked. Since the constructor sits in the static side, it is not included in this check.


// Instead, you would need to work with the static side of the class directly. In this example, we define two interfaces, ClockConstructor for the constructor and ClockInterface for the instance methods. Then for convenience we define a constructor function createClock that creates instances of the type that is passed to it.


interface ClockConstructor {
	new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
	tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
	return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
	constructor(h: number, m: number) {}
	tick(){
		console.log("beep mofucka");
	}
}

class AnalogClock implements ClockInterface {
	constructor(h: number, m: number) {	}
	tick() {
		console.log("tick bitch");
	}
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

// Because createClock’s first parameter is of type ClockConstructor, in createClock(AnalogClock, 7, 32), it checks that AnalogClock has the correct constructor signature.


//=====================Extending Interfaces======================
// Like classes, interfaces can extend each other. This allows you to copy the members of one interface into another, which gives you more flexibility in how you separate your interfaces into reusable components.

interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;

// An interface can extend multiple interfaces, creating a combination of all of the interfaces.

interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;



// =========================Hybrid Types==============================
// As we mentioned earlier, interfaces can describe the rich types present in real world JavaScript. Because of JavaScript’s dynamic and flexible nature, you may occasionally encounter an object that works as a combination of some of the types described above.
//
// One such example is an object that acts as both a function and an object, with additional properties:

interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter() : Counter {
  let counter = <Counter>function (start: number) {};
  counter.interval = 123;
  counter.reset = function() { };
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;



//================Interfaces Extending Classes========================
//
// When an interface type extends a class type it inherits the members of the class but not their implementations. It is as if the interface had declared all of the members of the class without providing an implementation. Interfaces inherit even the private and protected members of a base class. This means that when you create an interface that extends a class with private or protected members, that interface type can only be implemented by that class or a subclass of it.
//
// This is useful when you have a large inheritance hierarchy, but want to specify that your code works with only subclasses that have certain properties. The subclasses don’t have to be related besides inheriting from the base class. For example:


class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// Error: Property 'state' is missing in type 'Image'.
class Image implements SelectableControl {
    select() { }
}

class Location {

}
// In the above example, SelectableControl contains all of the members of Control, including the private state property. Since state is a private member it is only possible for descendants of Control to implement SelectableControl. This is because only descendants of Control will have a state private member that originates in the same declaration, which is a requirement for private members to be compatible.
//
// Within the Control class it is possible to access the state private member through an instance of SelectableControl. Effectively, a SelectableControl acts like a Control that is known to have a select method. The Button and TextBox classes are subtypes of SelectableControl (because they both inherit from Control and have a select method), but the Image and Location classes are not.








//====5====Classes and function Parameters==============================

class Ninja {
   fullName: string;
   constructor(
      public firstName: string,
      public lastName: string){
         this.fullName = `${firstName} ${lastName}`;
      }
   debug(){
      console.log("Console.log() is my friend.")
   }
}
// This is not making an instance of Ninja, for some reason:
const shane = new Ninja("Shane", "Mcpoop");
// Since I'm having trouble making an instance of Ninja, I decided to do this:
const turing = new Ninja("Alan", "Turing")
// Now I'll make a study function, which is a lot like our graduate function from above:
function study(programmer: Ninja){
   return `Ready to whiteboard an algorithm, ${programmer.fullName}?`
}
console.log(study(shane));
// Now this has problems:
console.log(study(turing));



//==6===========Arrow functions================================================
let x = 4;
let y = 8;
var increment = x => x + 1;
// This works great:
console.log(increment(3));
x = 4;
y = 8;

var square = x => x * x;
// This is not showing me what I want:
console.log(square(4));
// This is not working:
x = 4;
y = 8;
var multiply = (x, y) => x * y;
console.log(multiply(x, y));
// Nor is this working:

x = 4;
y = 8;
var math = (x, y) => {
    let sum = x + y;
    let product = x * y;
    let difference = Math.abs(x - y);
    return [sum, product, difference];
}
console.log(math(x, y));




//=======Arrow functions and 'this'===================================

class Elephant {
   constructor(public age: number){}
       birthday = function () {
        this.age += 1
    }
}
babar =>
    setTimeout(babar.birthday, 0);
    setTimeout(function () {
    console.log(`Babar's age is ${babar.age}.`
    )
}, 2000);
// Why didn't babar's age change? Fix this by using an arrow function in the Elephant class.


const babar = new Elephant(8)
