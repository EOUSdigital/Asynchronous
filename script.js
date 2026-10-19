"use strict";

//  We do not need to study memory management, garbage collection, or the deeper internals of the JavaScript engine.

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





















































































