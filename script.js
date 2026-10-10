"use strict";

//  The setTimeout() method

// Exercise 1 — Predict the output

console.log("Start");

setTimeout(() => {
    console.log("Timer");
}, 0);

console.log("End");

//  Question: What is the exact output order? And explain why.
// Answer: The output order is Start > End > Timer because the log will display first "Start" followed by the "End" and immediately "Timer". The callback is scheduled with a minimum delay of 0 ms, but it cannot run until the current synchronous JavaScript has finished.

//  Exercise 2 — 0 milliseconds

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

//  Exercise 3 — Callback or function call?

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

//  One more exercise before we move on

function one() {
    console.log("One");
}

console.log("Start");

setTimeout(one, 0);

console.log("Middle");

one();

console.log("End");

//  Q: What is the exact output order? And tell me which One is produced synchronously and which One is produced by the callback.
//  A: The output follows the order "Start" > "Middle" > "One" > "End"  > "One". The first "One" is produced following synchronous process and the second "One" is produced by the callback. 



// The Call Stack

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

















































