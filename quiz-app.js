let app = document.getElementById("app");
let startButton = document.querySelector(".start-btn");

let quizUrl ="https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple";
let quizes;
let errorMessage = "fetch from server failed try refreshing the page";
let questionNumber = 0;
let correctAns;
let passCounter = 0;
let quizTotal = 10;
let gotwrongAns = [] //wrong answers go here.

//fetch data
fetch(quizUrl)
  .then(res => res.json())
  .then(data => {
      quizes = [...data.results];
      init();
    })
    .catch(err => {
      app.innerHTML = errorMessage;
      console.log("errrrr", err);
    });

//initialize variables
const init = () => {
  app.innerHTML = "";
  startButton.disabled = false;
  questionNumber = 0;
  correctAns = 0;
  passCounter = 0;
  quizTotal = 10;
  gotwrongAns = []
};

const createElement = (element, text="") => {
  let elem = document.createElement(element);
  elem.innerHTML = text;
  return elem;
};

const generate = () => {
  //intialalise
  app.innerHTML = "";
  //create question and answer elements
  let { question, correct_answer, incorrect_answers } = quizes[questionNumber];
  let container = createElement("div", "");
  let heading = createElement("h1", `Question ${questionNumber + 1}/${quizTotal}`);
  let Question = createElement("h2", question);
  let ul = generateAnswers(correct_answer, incorrect_answers);
  //append all itmes to the container
  container.append(heading);
  container.append(Question);
  container.append(ul);
  app.append(container);
  ul.scrollIntoView()
};

const randomNum = x => {
  return Math.floor(Math.random() * x);
};

const generateAnswers = (ans, arr) => {
  let newArr = [...arr];
  let num = randomNum(newArr.length + 1);
  correctAns = num;
  //create a list of all answers
  newArr.splice(num, 0, ans);
  //create element list
  let ul = createElement("ul");
  ul.id = 'answers'
  newArr.forEach((ans,i)=> {
    let li = createElement("li");
    let paragraph = createElement("p");
    li.setAttribute("data-list", i);
    li.addEventListener("click", checkAns);
    paragraph.innerHTML = ans;
    li.append(paragraph);
    ul.append(li);
  })
  return ul;
};

const nextQuestion = () => {
  if (questionNumber === 9) {
    showResults();
  } else {
    questionNumber++;
    generate();
  }
};

const checkAns = e => {
  let selected = e.target;
  if (selected.tagName === "P") selected = selected.parentElement;
  let id = selected.getAttribute("data-list");
  id = Number(id);
  //check correct answer
  if (id === correctAns) {
    passCounter++
  } else {
    //got wrong questions
    gotwrongAns.push(questionNumber+1);
  }
  selected.classList.toggle('clicked');
  selected.addEventListener('animationend', function listener () {
    selected.removeEventListener('animationend', listener )
    removeUlListener();
    nextQuestion();
  })
  
};

const showResults = () => {
  app.innerHTML = "";
  let heading = createElement("h1");
  let score = createElement("h2");
  let percentage = createElement("h1");
  heading.innerHTML = "Your score:";
  score.innerHTML = `You got ${passCounter} question${passCounter === 1?"":'s'} right 🚀`;
  percentage.innerHTML = ((passCounter / quizTotal) * 100).toFixed() + "%";
  percentage.classList.toggle("trophy");
  heading.scrollIntoView()
  app.append(heading);
  app.append(score);
  app.append(percentage)
  //add all answers
  app.append(review())
};

const removeUlListener = parent => {
  let nodes = document.querySelectorAll('#answers > li')
  nodes.forEach(li => {
    li.removeEventListener("click", checkAns);
  })
};

const review = () => {
  let container = createElement('div');
      container.id = 'review'
  let heading = createElement('h1');
      heading.innerHTML = "Review"
  container.append(heading);
  quizes.forEach((item, i) => {
    let {question, correct_answer} = item;
    let div = createElement('div');
    let quiz_p = createElement('h3', question);
    let ans_p = createElement('p', correct_answer);
    //if wrong answer was provided: color red;
    if (gotwrongAns.includes(i+1)) ans_p.classList.add('red');
    else ans_p.classList.add('green')
    div.append(quiz_p);
    div.append(ans_p);
    container.append(div);
  })
  return container
}
//button events
startButton.addEventListener("click", () => {
  init();
  generate();
});
