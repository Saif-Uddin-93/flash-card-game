questions = {
  easy: [
    {
      question: "How do you declare a variable in JavaScript?", 
      answer: "Variables are declared using keywords like var, let, or const, followed by the variable name.",
      hint: "Consider the keywords used for variable declaration in JavaScript."     
    },
    {
      question: "What does the alert() function do?",
      answer: "The alert() function is used to display a pop-up dialog box with a specified message.",
      hint: "Think about how you can display a simple message to the user."     
    },
    {
      question: "How do you write a comment in JavaScript?",
      answer: "Single-line comments use //, and multi-line comments use /* */.",
      hint: "Consider the syntax for adding comments to your code."     
    },
    {
      question: "Explain the difference between == and ===.",
      answer: " == checks for equality with type coercion, while === checks for strict equality in both value and type.",
      hint : "Think about the importance of considering both value and type in comparisons."     
    },
    {
      question: "Write a basic for loop in JavaScript.",
      answer: "Use the for keyword followed by loop initialization, condition, and increment/decrement expressions.",
      hint: "Consider the syntax for creating a loop that iterates over a range of values."     
    },
    {
      question: "What does the typeof operator do?",
      answer: "typeof is used to determine the data type of a variable or expression.",
      hint: "Think about how you can check the type of a value in JavaScript."     
    },
    {
      question: "Define an array in JavaScript.",
      answer: "An array is a data structure that stores a collection of elements, each identified by an index.",
      hint: "Think about a data structure that allows you to store multiple elements."     
    },
    {
      question: "How do you write a function in JavaScript?", 
      answer: "Use the function keyword followed by the function name, parameters, and the function body.",
      hint: "Consider the syntax for creating a reusable block of code in JavaScript."     
    },
  ],
  intermediate: [
    {
      question: "Explain closures in JavaScript.",
      answer: "Closures allow functions to retain access to variables from their outer scope, even after the outer function has finished execution.",
      hint: "Think about the relationship between functions and the scope of variables."
    },
    {
      question: "What is the Event Loop?",
      answer: "The Event Loop is a mechanism that handles asynchronous operations by placing them in a callback queue.",
      hint: "Consider how JavaScript manages asynchronous tasks and callbacks."
    }, 
    {
      question: "Describe the purpose of the this keyword.",
      answer: " this refers to the current execution context and is determined by how a function is called.",
      hint: "Think about how this is affected by function invocation."
    }, 
    {
      question: "Question1",
      answer: "Objects can inherit properties and methods through a prototype chain, with each object having a prototype object.",
      hint: "Consider the concept of inheritance in the context of JavaScript objects."
    }, 
    {
      question: "Differentiate between null and undefined.",
      answer: "null represents intentional absence, while undefined is automatically assigned to uninitialized variables.",
      hint: "Consider scenarios where you might deliberately set a value to null or encounter undefined."
    }, 
    {
      question: "What does the bind method do?",
      answer: "The bind method creates a new function with a specified this value and initial arguments.",
      hint: "Think about how bind can be used to control the context of a function."
    }, 
    {
      question: "How does asynchronous programming work in JavaScript?",
      answer: "Asynchronous programming is achieved through callbacks, promises, and async/await for non-blocking execution.",
      hint: "Consider how JavaScript manages tasks that take time to complete without blocking the main thread."
    }, 
    {
      question: "Explain the purpose of try, catch, and finally blocks.",
      answer: "try contains code that might throw an exception, catch handles the exception, and finally runs regardless of exceptions.",
      hint: "Think about how error handling is structured in JavaScript."
    }, 
    {
      question: "What is hoisting in JavaScript?",
      answer: "Hoisting moves variable and function declarations to the top of their scope during compilation.",
      hint: "Consider how JavaScript handles variable and function declarations before code execution."
    }, 
    {
      question: "How do you make an AJAX request in JavaScript?",
      answer: "Use the XMLHttpRequest object or the fetch API to make asynchronous HTTP requests in JavaScript.",
      hint: "Consider the JavaScript tools available for making asynchronous HTTP requests."
    }, 
  ],
  advanced: [
    {
      question: "What is the Observer pattern and how can it be implemented in JavaScript?",
      answer: "The Observer pattern involves an object (subject) maintaining a list of its dependents (observers) that are notified of any state changes. Implementation can use custom code or the Observer interface in modern JavaScript.",
      hint: "Think about how you can implement a system where multiple objects are notified of changes in another object's state."     
    },
    {
      question: "Explain the concept of Promises in JavaScript.",
      answer: "Promises are objects that represent the eventual completion or failure of an asynchronous operation, allowing you to handle results using then() and catch() methods.",
      hint: "Consider how Promises improve handling of asynchronous code compared to callbacks."     
    },
    {
      question: "What are Generators in JavaScript?",
      answer: "Generators are special functions that can be paused and resumed, allowing manual control of the flow of execution. They are defined using the function* syntax and yield statements.",
      hint: "Think about scenarios where you might need fine-grained control over function execution."     
    },
    {
      question: "Explain the concept of memoization in JavaScript.",
      answer: "Memoization is an optimization technique where the results of expensive function calls are cached, allowing subsequent calls with the same arguments to return the cached result instead of recomputing the function.",
      hint: "Consider situations where you want to optimize performance by avoiding redundant calculations."     
    },
    {
      question: "What is the role of the WeakMap and WeakSet in JavaScript?",
      answer: "WeakMap and WeakSet are collection objects that allow you to associate weakly held objects with values. They do not prevent the garbage collector from collecting keys or values if they are not referenced elsewhere.",
      hint: "Consider scenarios where you need to associate data with objects without preventing them from being garbage collected."     
    },
    {
      question: "What is the difference between the call, apply, and bind methods?",
      answer: "call and apply immediately invoke the function, while bind returns a new function with the specified this value but doesn't invoke it.",
      hint: "Think about how these methods are used to manipulate the this value in function calls."     
    },
    {
      question: "How does the async/await syntax work in JavaScript?",
      answer: "async/await is a syntax for handling asynchronous code more cleanly. async defines an asynchronous function, and await is used to pause execution until the awaited promise is settled.",
      hint: "Consider how async/await simplifies asynchronous code compared to using callbacks or Promises."     
    },
    {
      question: "Explain the concept of WebSockets and how they differ from traditional HTTP communication.",
      answer: "WebSockets provide a full-duplex communication channel over a single, long-lived connection, allowing real-time data exchange. This is different from traditional HTTP, which is request-response based.",
      hint: "Think about scenarios where real-time, bidirectional communication is essential, and compare it to the typical request-response model of HTTP."     
    },
    {
      question: "What is the Event Delegation pattern in JavaScript?",
      answer: "Event delegation is a technique where a single event listener is attached to a common ancestor, managing events for multiple child elements. This is useful for dynamically created elements.",
      hint: "Consider situations where you want to optimize event handling, especially for dynamic content."     
    },
    {
      question: "How does the WeakMap and WeakSet differ from Map and Set in JavaScript?",
      answer: "WeakMap and WeakSet are similar to Map and Set, but they allow keys to be weakly held, making them eligible for garbage collection if not referenced elsewhere.",
      hint: "Think about scenarios where you need to associate data with objects without preventing those objects from being collected by the garbage collector."     
    },
  ]
}

 