"use strict";

//  We do not need to study memory management, garbage collection, or the deeper internals of the JavaScript engine.

//  Synchronous callback: called as part of the current, ongoing execution.
//  Asynchronous callback: scheduled to run later, such as a setTimeout() callback.

//TODO 01. Section introduction

//? The setTimeout() method

// Exercise 1 — Predict the output

console.log("Start");

setTimeout(() => {
    console.log("Timer");
}, 0);

console.log("End");

//  Question: What is the exact output order? And explain why.
// Answer: The output order is Start > End > Timer because the log will display first "Start" followed by the "End" and immediately "Timer". The callback is scheduled with a minimum delay of 0 ms, but it cannot run until the current synchronous JavaScript has finished.

//? Exercise 2 — 0 milliseconds

console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

setTimeout(() => {
    console.log("C");
}, 0);

console.log("D");

//  Question: What is the exact output order? Then explain why "B" and "C" appear in that order.
//  Answer: The output order is A > D > B > C because the log will display the current synchronous JavaScript. The callback is scheduled with a minimum delay of 0 ms and will run after the synchronous order, B first followed by C.

//? Exercise 3 — Callback or function call?

function greet() {
    console.log("Hello");
}

console.log("Start");

setTimeout(greet, 0);

console.log("End");

//  Answer these three questions:
//  1. What is the output order?
//  2. Which part is the callback?
//  3. Why is this:

//  1. The output order is "Start" > "End" > "Hello" because it calls the function after passes "Hello" to setTimeout() as a callback.
//  2. The callback is setTimeout(greet, 0); because is the function who calls the greet() function and call it when appropriate.
//  3. The setTimeout(greet, 0); is passing the greet() function, and does not follow the asynchronous pattern. setTimeout, call it later.

//?  One more exercise before we move on

function one() {
    console.log("One");
}

console.log("Start");

setTimeout(one, 0);

console.log("Middle");

one();

console.log("End");

//? The Call Stack
//  A call stack is a mechanism for an interpreter (like the JavaScript interpreter in a web browser) to keep track of its place in a script that calls multiple functions — what function is currently being run and what functions are called from within that function, etc.
//  - When a script calls a function, the interpreter adds it to the call stack and then starts carrying out the function.
//  - Any functions that are called by that function are added to the call stack further up, and run where their calls are reached.
//  - When the current function is finished, the interpreter takes it off the stack and resumes execution where it left off in the last code listing.
//  - If the stack takes up more space than it was assigned, a "stack overflow" error is thrown.

function first() {
    console.log("First — start");
    second();
    console.log("First — end");
}

function second() {
    console.log("Second");
}

first();

//  The output is:
//  1. First — start
//  2. Second
//  3. First — end

//? Exercise Example: Last In, First Out (LIFO)

function first() {
    console.log("First -start");
    second();
    console.log("First -end");
}

function second() {
    console.log("Second - start");
    third();
    console.log("Second - end");
}

function third() {
    console.log("Third");
}

first();

//  The output is:
//  1. First — start
//  2. Second — start
//  3. Third
//  4. Second — end
//  5. First — end

//  Notice the pattern:
//  1. first() starts and pauses when it calls second().
//  2. second() starts and pauses when it calls third().
//  3. third() finishes first.
//  4. second() resumes and finishes.
//  5. first() resumes and finishes last.

//! The key principle: a function that calls another function remains active on the stack until its own execution completes.

//? Exercise Example: Last In, First Out (LIFO)

function first() {
    console.log("First — start");
    second();
    console.log("First — end");
}

function second() {
    console.log("Second");
}

first();

//  The sequence is:
//  1. first() enters the call stack.
//  2. first() calls second() and pauses.
//  3. second() enters the top of the stack and executes.
//  4. second() finishes and its stack frame is removed.
//  5. first() resumes and logs "First — end".
//  6. first() finishes and its stack frame is removed.

//TODO Module 4

//  A — New execution context: Each time greet() function is called, JavaScript creates a new execution context for that invocation.
//  B — Execution context removed: When the call finishes, its execution context is removed from the call stack. The function itself is not automatically deleted from memory.

//? The key distinction to remember is:
//  Execution context = the environment in which a particular function call executes.
//  Call stack = the structure that tracks active function calls and the order in which they execute.

//TODO  02. Under the Hood: Thread of Execution

function first() {
    console.log("First — start");
    second();
    console.log("First — end");
}

function second() {
    console.log("Second");
}

first();

//  The output is:
//  1. First — start
//  2. Second
//  3. First — end

// -------------------------------------------

const username = "Alex";

function greet() {
    const message = "Hello, " + username;
    console.log(message);
}

greet();

//  The output is:
//  Hello, Alex

//TODO  03. Under the Hood: How Async JS Works

//  Our goal in this lesson is to understand how JavaScript can arrange for work to happen later without blocking the rest of the code from running.

//* 1. Start with what you already know
//  Consider this code:

console.log("A");

function greet() {
    console.log("B");
}

greet();

console.log("C");

//  JavaScript executes synchronous code in order. The output is:   A   B   C
//  When JavaScript reaches greet(), it calls the function, executes its body, returns from the function, and continues with console.log("C").
//  Nothing surprising so far. The call stack helps JavaScript keep track of those active function calls.

//  Now let's introduce asynchronous behaviour.

//* 2. What happens when we use setTimeout()?

console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

console.log("C");

//  The output is:  A   C   B
//  Notice that B is printed last, even though the delay is 0 milliseconds. Why?
//  When JavaScript reaches setTimeout(), it registers a callback to be executed later. The callback does not run immediately as part of the current synchronous sequence. JavaScript continues to the next statement and prints C.
//  Once the current synchronous work has finished, the scheduled callback can run.
//  The important point is that setTimeout() does not pause the entire program and wait for the callback.

//* 3. The key pieces working together

//  For this lesson, we need to distinguish three things:
//  1. Call stack - Tracks the JavaScript function calls currently being executed.
//  2. Browser APIs - In a browser, facilities such as timers can handle waiting outside the JavaScript call stack.
//  3. Task queue and event loop - The task queue holds callbacks ready to be processed. The event loop coordinates when queued work can run, including waiting until the call stack is clear.

//! One useful clarification: the browser APIs, task queue and event loop are not all parts of the JavaScript call stack. They are separate parts of the environment that work together to support asynchronous behaviour.

//* 4. Trace the execution

console.log("Start");

setTimeout(() => {
    console.log("Timer");
}, 0);

console.log("End");

//  The exact output order is:
//  Start → End → Timer
//  The synchronous statements execute before the timer callback.

//  The callback is scheduled for later, allowing synchronous code to finish first.

//* 5. Consider this variation:

console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

setTimeout(() => {
    console.log("C");
}, 0);

console.log("D");

//  The exact output order is:
//  A → D → B → C

//  1. Synchronous code runs first. JavaScript prints A, schedules the first timer, schedules the second timer, and then prints D.
//  2. The callbacks run afterwards. Both timers have a delay of 0 milliseconds, but neither callback interrupts the synchronous code. In this example, the callbacks run in the order they were scheduled: B, then C.

//* 6. Imagine this code:

function doWork() {
    const start = Date.now();

    while (Date.now() - start < 2000) {
        // Keep JavaScript busy for approximately 2 seconds
    }

    console.log("Work finished");
}

setTimeout(() => {
    console.log("Timer callback");
}, 0);

doWork();

//  The output is:
//  1. Work finished
//  2. Timer callback

//  Here's why:
//  1. setTimeout() schedules the callback with a minimum delay of zero milliseconds. It does not pause JavaScript.
//  2. doWork() then runs synchronously and occupies the JavaScript call stack for approximately two seconds.
//  3. Even if the timer has already expired, its callback cannot interrupt the currently executing synchronous function.
//  4. Once doWork() finishes and the call stack becomes clear, the callback can run.

//  The key distinction: the timer's delay and the time JavaScript spends executing synchronous code are separate. The timer doesn't stop counting while synchronous code runs; rather, the callback must wait until JavaScript can process it.
//  Also, setTimeout() does not dictate the order of all code. Synchronous execution order, timer scheduling and the event loop all matter.

//! Important
//Q: Has the callback necessarily run as soon as the delay expires, or can it be ready to run but still waiting? Explain the difference.
//A: There are two separate events to distinguish:
//   1. The timer expires. The specified delay has elapsed, so the callback becomes eligible to run. It may be placed in the task queue, waiting to be processed.
//   2. The callback actually executes. JavaScript gets an opportunity to process that callback after the currently running synchronous code has finished.
//  The important distinction is that being ready to run is not the same as actually running.

//* Final check for Lesson 03

//  Consider this code:

console.log("First");

setTimeout(() => {
    console.log("Second");
}, 0);

function work() {
    console.log("Third");
}

work();

console.log("Forth");

//  Explain:
//  1. The exact output order is: First → Third → Forth → Second
//      1.1. console.log("First") executes immediately.
//      1.2. setTimeout() schedules the callback containing console.log("Second") to run later.
//      1.3. JavaScript continues executing synchronously. It calls work(), which prints "Third".
//      1.4. work() finishes, and JavaScript prints "Fourth".
//      1.5. Once the synchronous work finishes, the timer callback can run, printing "Second".
//  2. Even though the timer delay is zero, console.log('Second') cannot run immediately because the callback is scheduled for later. JavaScript continues executing the synchronous code, and the event loop allows the callback to run when the current execution has finished and the callback can be processed.


//TODO  Lesson 04. setTimeout and clearTimeout method

//  Schedule a callback, understand the timer ID it returns, and cancel a scheduled callback when necessary.

//* 1. Using setTimeout()

setTimeout(() => {
    console.log("Hello after 2 seconds");
}, 2000);

//  There are two important arguments:
//  - First argument: the callback function to execute.
//  - Second argument: the delay in milliseconds. Here, 2000 means 2,000 milliseconds, or 2 seconds.
//  Remember, the delay is a minimum waiting period, not a guarantee that the callback executes at exactly two seconds.

//* 2. Understanding the timer ID

//  setTimeout() returns a value identifying the scheduled timer. We can store that value in a variable:

const timerId = setTimeout(() => {
    console.log("This message is scheduled");
}, 3000);

console.log(timerId);

//! The value of timerId can be passed to clearTimeout() to cancel that timer. The exact type of the returned value depends on the JavaScript environment.

//* 3. Cancelling a timer with clearTimeout()

const timerId = setTimeout(() => {
    console.log("You should not see this message");
}, 3000);

clearTimeout(timerId);

//? The timer is cancelled before its callback executes, so the message is not printed.
//! A crucial detail: clearTimeout() can cancel a pending timer; it cannot undo a callback that has already started executing.


//* Short prediction exercise

console.log("Start");

const timerId = setTimeout(() => {
    console.log("Timer fired");
}, 2000);

clearTimeout(timerId);

console.log("End");

//  The actual output is: Start → End

//? Why?
//  1. console.log("Start") runs immediately.
//  2. setTimeout() schedules the callback with a 2,000-millisecond delay and returns a timer ID.
//  3. clearTimeout(timerId) cancels that pending timer. It does not change the delay to zero; it prevents the scheduled callback from executing.
//  4. console.log("End") runs immediately afterwards.
//  5. "Timer fired" is never printed because its timer was cancelled.
//  The key distinction is that clearTimeout() cancels a pending timer; it does not make the callback run sooner.


//* Suppose we change the code to this:

const timerId = setTimeout(() => {
    console.log("Hello");
}, 3000);

clearTimeout(timerId);

setTimeout(() => {
    console.log("Goodbye");
}, 0);

//? The output is "Goodbye" only, because clearTimeout(timerId) cancels the pending timer, and it will prevent the scheduled callback from executing. The "Hello" is never printed because its timer was cancelled.

//  Accurate reasoning:
//  1. clearTimeout(timerId) cancels the pending "Hello" timer.
//  2. The second setTimeout() schedules "Goodbye" independently, with a delay of zero milliseconds.
//  3. "Goodbye" is printed after the synchronous code finishes because its timer has not been cancelled.


//* Relying on the example

const timerId = setTimeout(() => {
    console.log("First");
}, 1000);

setTimeout(() => {
    clearTimeout(timerId);
    console.log("Second");
}, 0);

//  The actual output is:
//  1. The first setTimeout() schedules "First" to run after approximately 1,000 milliseconds and returns timerId.
//  2. The second setTimeout() schedules its callback with a delay of zero.
//  3. That second callback becomes eligible to run first, because its timer has the shorter delay.
//  4. It calls clearTimeout(timerId), cancelling the still-pending "First" timer.
//  5. It prints "Second". The "First" callback never executes.

//! The key principle is that a timer callback can cancel another timer, provided that timer's callback has not already started executing.


//  The setTimeout() method schedule a timer which executes a function once the timer expires. The clearTimeout() method interface cancel a timeout previously established.


//TODO  Lesson 05 — setInterval() and clearInterval()

//  Repeat an action at regular intervals and stop that repetition when needed.

//* 1. Using setInterval()
//  Imagine we want to print a message every two seconds.

setInterval(() => {
    console.log("Hello again!");
}, 2000);

//  This looks very similar to setTimeout(), but there is one important difference:
//  - setTimeout() schedules a callback to run once.
//  - setInterval() schedules a callback to run repeatedly, at the specified interval.
//  Here, the callback is scheduled to repeat approximately every 2,000 milliseconds (two seconds). It does not guarantee execution at exact two-second intervals, because JavaScript may be busy processing other work.

//* 2. Stopping repetition with clearInterval()
//  If we leave the interval running, it continues scheduling repetitions until it is cancelled or the environment stops it.

//  We can store the interval ID and use it to stop the repetition:

const intervalId = setInterval(() => {
    console.log("Hello again!");
}, 2000);

clearInterval(intervalId);

//  In this example, the interval is cancelled immediately, so the callback will not run if it has not already started.

//? Notice the pairing:
//  Start or schedule                   Stop or cancel
//  setTimeout()                        clearTimeout()
//  setInterval()                       clearInterval()
//  Each pair has a different purpose. Use the matching cancellation function for the timer you've created.

//? Exercise

//* Consider this code:

console.log("Start");

const intervalId = setInterval(() => {
    console.log("Tick");
}, 1000);

setInterval(() => {
    clearInterval(intervalId);
    console.log("Stopped");
}, 3200);

console.log("End");

//  The actual output is:
//  1. console.log("Start") prints Start immediately.
//  2. setInterval() schedules the Tick callback to repeat approximately every second.
//  3. setTimeout() schedules a separate callback to run after approximately 3.2 seconds.
//  4. console.log("End") prints End immediately. Neither timer pauses synchronous execution.
//  5. The interval callback prints Tick repeatedly while the interval remains active.
//  6. After approximately 3.2 seconds, the timeout callback calls clearInterval(intervalId), stopping further repetitions, then prints Stopped.

//  We use setTimeout() to schedule a one-time callback that will stop the interval after approximately 3.2 seconds.

//* Next check

let count = 0;

const intervalId = setInterval(() => {
    count++;
    console.log(count);

    if (count === 3) {
        clearInterval(intervalId);
        console.log("Finished");
    }
}, 1000);

//  The actual output is: 1 → 2 → 3 → Finished
//  1. set the "count" variable with let that can declares re-assignable, block-scoped local variables, optionally initializing each to a value.
//  2. set the "intervalId" variable with const that cannot be changed through reassignment using the assignment operator, but if a constant is an object, its properties can be added, updated, or removed.
//  3. setInterval() schedules the "Finished" callback to repeat approximately every second.
//  4. count will increment (++) operator increments (adds one to) its operand and returns the value before or after the increment, depending on where the operator is placed.
//  5. console.log(count); prints the number counted immediately.
//  6. if statement executes a statement if a specified condition is truthy. In this case "if" "count" is strictly equal(===) with 3
//  7. After approximately 1 second, the timeout callback calls clearInterval(intervalId), stopping further repetitions, then prints "Finished".


//* Quick check
//  What is the key difference between these two pairs?
//  - setTimeout() and clearTimeout()
//  - setInterval() and clearInterval()

//* How often the scheduled callback runs.
//  - setTimeout() schedules a callback to run once after a specified delay. clearTimeout() cancels it if it has not run yet.
//  - setInterval() schedules a callback to run repeatedly, at approximately the specified interval. clearInterval() stops future repetitions.

//? setInterval() & clearInterval(): Complete
//  - setInterval() repeats a callback at approximately regular intervals.
//  - clearInterval() stops future repetitions.
//  - setTimeout() schedules a callback to run once after a delay.
//  - clearTimeout() cancels a pending timeout.
//  - Timer delays are approximate, and callbacks don’t interrupt synchronous JavaScript execution.

//TODO  Next: Lesson 06 — Callbacks

//  A callback is a function passed to another function so it can be called later or at an appropriate point during that function’s work.

//* Here’s a simple example:

function greet(name) {
    console.log("Hello, " + name);
}

function processUser(callback) {
    callback("Alex");
}

processUser(greet);

//  The actual output is: Hello, Alex


//* Exercise Consider Printing

function sayHello() {
    console.log("Hello!");
}

const result = sayHello();
console.log(result);

//  The output is:
//  Hello!
//  undefined


//* One small exercise

//  Consider this code:

function getName() {
    return "Alex";
}

const person  = getName();
console.log(person);

//  The console will display "Alex", and the value stored in person is "Alex". The function returns "Alex" and the variable person is equal to any given return by the function. The console.log(person) prints the person value immediately.

//* Consider this code:

function greet() {
    console.log("Hello!");
}

function processUser(callback) {
    callback();
}

processUser(greet);

//  Question: What gets printed, and which line actually causes greet to run?
//  Solution:
//  1. processUser(greet) calls processUser and passes the greet function to it.
//  2. Inside processUser, the parameter callback now refers to the greet function.
//  3. callback() is the line that actually calls greet and prints "Hello!".

//  Remember: greet is the function being passed; callback() is how that function is called inside processUser.


//* The callback receives a value:

function greet(name) {
    console.log(("Hello, " + name));
}

function processUser(callback) {
    callback("Alex");
}

processUser(greet);

//  Question: When JavaScript executes callback("Alex"), which parameter receives the value "Alex" — callback or name?
//  Solution: The parameter "name" will receive the value "Alex". The greet function is passed into processUser. The parameter callback now refers to that function. Because callback refers to greet, this is effectively the same as calling: greet("Alex"). 

//  When greet("Alex") runs, its parameter name receives "Alex".
//  Think of it as two separate jobs:
//  - callback holds a reference to the function.
//  - name receives the string argument passed to that function.
//  The output is Hello, Alex.


//* Let's consolidate what you've learned

function greet(name) {
    console.log("Hello, " + name);
}

function processUser(callback) {
    callback("Sam");
}

processUser(greet);

//  Solution and key steps:
//  1. processUser(greet) passes the greet function into processUser.
//  2. The parameter callback refers to greet.
//  3. callback("Sam") calls greet, passing "Sam" as its argument.
//  4. The name parameter receives "Sam".
//  5. console.log() prints Hello, Sam.

//! A callback is a function passed to another function so that the receiving function can call it.


//* Follow up:

//  If we change this line: 
processUser(greet);

//  to this: 
processUser(greet());

//  Question: Would the greeting still work as intended? Explain what happens when greet() is evaluated first.
//  Solution: JavaScript executes greet() immediately, but "name" is undefined. The greet() prints "Hello, undefined" and returns: undefined (because there is no return statement).

//  Solution and key steps:
//  1. JavaScript evaluates greet() first.
//  2. Because no argument is supplied, name is undefined.
//  3. greet() prints Hello, undefined.
//  4. Because greet() has no return statement, its return value is undefined.
//  5. JavaScript then calls processUser(undefined).
//  6. Inside processUser, callback("Sam") attempts to call undefined as a function, causing a TypeError.


//* When does a callback run?

function sayHello() {
    console.log("Hello!");
}

function doSomething(callback) {
    console.log("Start");
    callback();
    console.log("End");
}

doSomething(sayHello);

//  Key steps:
//  1. doSomething(sayHello) passes the sayHello function to doSomething.
//  2. callback() calls the function received through the callback parameter.
//  3. console.log() displays a message in the console.

//  Your task, without running the code, tell me:
//  1. What three messages will appear in the console?
//  1. The messages that will appear in the console will be Start, Hello, and End

//  2. In what order will they appear?
//  2. The output order is: Start → Hello → End

//  3. Does sayHello run immediately during the execution of doSomething, or is it scheduled to run later?
//  3. The sayHello function runs immediately during the execution of doSomething because it is not scheduled to run later. Does not have setup a setTimeout() that schedule a callback to run once or a setInterval() that schedule a callback to run repeatedly, at the specified interval. 


//* Can you predict the difference?

function sayHello() {
    console.log("Hello!");
}

function doSomething(callback) {
    console.log("Start");

    setTimeout(callback, 0);

    console.log("End");
}

doSomething(sayHello);

//  The only meaningful change is that we now use setTimeout(callback, 0) instead of callback().

//  Answer these three questions:
//  1. What is the output order?
//  1. The output order is: Start → End → Hello

//  2. Does sayHello() run before or after console.log("End")?
//  2. The sayHEllo() function will run after console.log("End") because setTimeout() schedules the callback rather than calling it directly.

//  3. Why does not a delay of 0 make the callback run immediately?
//  3. 3. The callback will not run immediately even if the delay is 0 because it is included inside setTimeout. It will follow the setTimeout protocol with a 0 milliseconds delay and run immediately, JavaScript completes all the tasks.

//  The execution sequence:
//  1. Print Start.
//  2. Schedule callback with setTimeout(callback, 0).
//  3. Print End — synchronous execution continues.
//  4. Run the timer callback when it is eligible and JavaScript can process it.


//* Next exercise: Let's test your understanding

//  Consider this code:

function first() {
    console.log("First");
}

function second(callback) {
    console.log("Second");
    callback();
    console.log("Third");
}

console.log("Start");
second(first);
console.log("End");

//  Without running the code, answer these two questions:
//  1. What is the exact output order?
//  1. The output order is: Start → Second → First → Third → End

//  2. Why does first() run at that particular point in the sequence?
//  2. The first() runs in this particular order because is called by the second() in synchronous order. In this execution we do not have asynchronous.

//  Execution sequence:
//  1. Print Start.
//  2. Call second(first).
//  3. Print Second.
//  4. Execute callback(), which calls first() and prints First.
//  5. Return from first() and continue inside second(), printing Third.
//  6. Finish second() and print End.

//! The key principle: a synchronous callback runs when the receiving function calls it, and the receiving function continues after the callback finishes.


//* A callback that receives data

function showResult(value) {
    console.log("Result:", value);
}

function calculate(callback) {
    console.log("Calculating...");
    callback(10 + 5);
    console.log("Done");
}

calculate(showResult);

//  Without running the code, tell me:
//  1. What is the exact output, in order?
//  1. The output order is: Calculating... → Result: 15 → Done

//  2. What value does the parameter value receive?
//  2. The parameter receives a value of 15.

//  3. Why does showResult receive that value?
//  3. The showResult receives the calculated callback() value and is transferred when it is called in calculate(showResult).

//  Execution sequence:
//  1. calculate(showResult) passes the showResult function to calculate.
//  2. The parameter callback refers to showResult.
//  3. callback(10 + 5) evaluates 10 + 5 to 15 and calls showResult(15).
//  4. The parameter value receives 15.
//  5. showResult prints Result: 15, then execution returns to calculate, which prints Done.

//! Notice an important detail: the callback isn't returning the calculated value. The calculate function passes the value 15 into the callback as an argument.


//* Next exercise: Follow the value

//  Consider this code:

function double(number) {
    return number * 2;
}

function processNumber(callback) {
    const result = callback(5);
    console.log(result);
}

processNumber(double);

//  Take your time. Answer these questions in your own words:
//  1. What number is passed into double?
//  1. The number passed into double is 5.

//  2. What does double return?
//  2. Double return 10.

//  3. What value is stored in result?
////  3. We store 5 in the result variable.
//  3. Since callback refers to double, the expression callback(5) evaluates to 10. Therefore, result stores 10, not 5.

//  4. What appears in the console, and why?
////  4. On the console, it will appear 10 because this is the result of the print.
//  4. The result stores the callback's return value, not the original argument passed into the callback.


//* Execution sequence together

function double(number) {
    return number * 2;
}

function processNumber(callback) {
    const result = callback(8);
    console.log(result);
}

processNumber(double);

//! Solution:

//  Step 1 — Pass the function

processNumber(double);

//  This passes the double function to processNumber. The parameter callback now refers to double.
//  One small correction: we are not passing double to a function called calculate. We are passing it to processNumber.

//  Step 2 — Call the callback

const result = callback(8);

//  Because callback refers to double, this is equivalent to:

const result = double(8);

//  Notice that result does not refer to the double function. It will store the value returned by calling that function.

//  Step 3 — Calculate and return

return number * 2;

//  - number receives 8.
//  - number * 2 calculates 16.
//  - double(8) returns 16.

//  That returned value goes back to the assignment in processNumber.

//  Step 4 — Store and print

const result = callback(8);
console.log(result);

//  The assignment becomes effectively:
const result = 16;

//  Therefore, the console prints:
16

//  The important distinction: the argument goes into the function; the returned value comes out of the function and is stored in result.


//* Practice the same idea once more

//  We will keep the structure identical and change only the number.

function double(number) {
    return number * 2;
}

function processNumber(callback) {
    const result = callback(6);
    console.log(result);
}

processNumber(double);

//! Solution

//  The value stored in the result is 12 because the argument goes into the function; the returned value comes out of the function and is stored in result.

//  Execution sequence:
//  1. processNumber(double) passes the double function to processNumber.
//  2. callback(6) calls double(6).
//  3. double receives 6 and returns 12.
//  4. result stores 12.
//  5. console.log(result) prints 12.


//* Next challenge: Can you trace a different return value?

function addFive(number) {
    return number + 5;
}

function processNumber(callback) {
    const result = callback(6);
    console.log(result);
}

processNumber(addFive);

//  Without running the code, tell me:
//  1. What value does number receive?
//  1. The number will receive a value of 6.

//  2. What value does addFive return?
//  2. The addFive function will return a value of 11.

//  3. What value is stored in result?
//  3. The value stored in the result is 11.

//  4. What appears in the console?
//  4. The console will print 11.

//  Reviewed execution trace:
//  1. Argument: callback(6) calls addFive(6), so number receives 6.
//  2. Return value: addFive calculates 6 + 5 and returns 11.
//  3. Assignment: result receives and stores 11.
//  4. Console: console.log(result) prints 11.


//* Next challenge: Does every callback return a value?

function showNumber(number) {
    console.log(number);
}

function processNumber(callback) {
    const result = callback(6);
    console.log("Result:", result);
}

processNumber(showNumber);

//  Your task:
//  1. What will appear in the console, in order? 
//  1. The console will print:
//      A. Result: 6
//      B. 6

//  2. And what value will be stored in result?
//  2. The value stored in the result is 6 because it is the only value available in both functions.

//! Here's what happens:
//  1. processNumber(showNumber) passes the showNumber function as the callback.
//  2. callback(6) calls showNumber(6).
//  3. showNumber prints 6. It has no return statement, so its return value is undefined.
//  4. result therefore stores undefined.
//  5. console.log("Result:", result) prints Result: undefined.

//  The actual output is:
//  A. 6
//  B. Result: undefined

//! The important distinction is that the value 6 is passed into the callback, but the callback doesn't return that value. Printing a value doesn't automatically return it.

//* Consider this example:

function greetUser(name, callback) {
    console.log("Hello, " + name);

    setTimeout(callback, 2000);
}

function sayGoodbye() {
    console.log("Goodbye!");
}

greetUser("Alex", sayGoodbye);
console.log("Welcome!");

//  There are two key ideas here:
//  - sayGoodbye is passed as a callback to greetUser.
//  - setTimeout schedules that callback to run after approximately two seconds, rather than calling it immediately.

//  Solution
//  Tell me the output order, including which message appears after approximately two seconds.
//  The output order is: Welcome! → Hello, Alex → Goodbye!

//  Then explain briefly why sayGoodbye does not run immediately.
//  The sayGoodbye function does not run immediately because it will wait for greetUser to complete.

//  Feedback

//  Step 1: JavaScript calls greetUser

greetUser("Alex", sayGoodbye);
//  Two arguments are passed into the function:
//  - "Alex" is assigned to the parameter name.
//  - sayGoodbye is passed as a function to the parameter callback.
//  Notice that we write sayGoodbye, not sayGoodbye(). We are passing the function itself, not calling it immediately.

//  Step 2: The first message is printed

console.log("Hello, " + name);
//  Since name contains "Alex", the console immediately displays: Hello, Alex

//  Step 3: The callback is scheduled

setTimeout(callback, 2000);
//  This tells JavaScript to schedule the callback to run after a delay of approximately two seconds.
//  It does not pause the execution of greetUser for two seconds. The function continues, reaches its closing brace and finishes.

//  Step 4: JavaScript continues with the next line

console.log("Welcome!");
//  This runs without waiting for the timer. The console now displays: Welcome!

//  Step 5: The timer callback runs
//  After approximately two seconds, when JavaScript is able to process the scheduled callback, sayGoodbye runs and prints: Goodbye!

//  The complete output order is therefore:
//  Hello, Alex
//  Welcome!
//  Goodbye!

//  Your original answer had the first two messages in the wrong order. Your second explanation was close, but the reason isn't that sayGoodbye waits for greetUser to complete alone. It waits for the timer delay to expire and for JavaScript to be able to process the callback.

//  One thing to take away
//  You do not need to answer another question about this example yet. First, make sure this sequence makes sense:

//! greetUser starts → prints the greeting → schedules the callback → finishes → prints Welcome! → the timer callback prints Goodbye!.


//* Our next step: build something

//  Imagine you are building a simple notification system. One function performs an action, then calls another function to report that the action has finished.

//  Pseudocode
//  1. I must create a notification system.
//  2. I need two functions. One will perform an action, then the second function will must report the complete action.

function performAction() {
    console.log("A new day!");
}

function completeAction(callback) {
    console.log("Action complete!");
    callback();
}

completeAction(performAction);

















