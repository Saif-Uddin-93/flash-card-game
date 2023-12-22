const questionAmount = 10;
const category = 18;
// add logic to difficulty() for selecting the difficulty options at start of game
const difficulty = ()=> "easy";
const qType = "multiple";
let apiResult = "";

const apiURL = `https://opentdb.com/api.php?amount=${questionAmount}&category=${category}&difficulty=${difficulty()}&type=${qType}`

fetch(apiURL)
.then(response => response.json())
.then(result => apiResult = result)


/* {
    "response_code":0,
    "results":[
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"What does the computer software acronym JVM stand for?",
            "correct_answer":"Java Virtual Machine",
            "incorrect_answers":[
                "Java Vendor Machine",
                "Java Visual Machine",
                "Just Virtual Machine"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"Which programming language shares its name with an island in Indonesia?",
            "correct_answer":"Java",
            "incorrect_answers":[
                "Python",
                "C",
                "Jakarta"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"How long is an IPv6 address?",
            "correct_answer":"128 bits",
            "incorrect_answers":[
                "32 bits",
                "64 bits",
                "128 bytes"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"HTML is what type of language?",
            "correct_answer":"Markup Language",
            "incorrect_answers":[
                "Macro Language",
                "Programming Language",
                "Scripting Language"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"What does LTS stand for in the software market?",
            "correct_answer":"Long Term Support",
            "incorrect_answers":[
                "Long Taco Service",
                "Ludicrous Transfer Speed",
                "Ludicrous Turbo Speed"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"In any programming language, what is the most common way to iterate through an array?",
            "correct_answer":"&#039;For&#039; loops",
            "incorrect_answers":[
                "&#039;If&#039; Statements",
                "&#039;Do-while&#039; loops",
                "&#039;While&#039; loops"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"The numbering system with a radix of 16 is more commonly referred to as ",
            "correct_answer":"Hexidecimal",
            "incorrect_answers":["Binary","Duodecimal","Octal"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"What amount of bits commonly equals one byte?",
            "correct_answer":"8",
            "incorrect_answers":["1","2","64"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"What is the domain name for the country Tuvalu?",
            "correct_answer":".tv",
            "incorrect_answers":[".tu",".tt",".tl"]},
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Science: Computers",
            "question":"What does the &quot;MP&quot; stand for in MP3?",
            "correct_answer":"Moving Picture",
            "incorrect_answers":["Music Player","Multi Pass","Micro Point"]
        }
    ]
} */