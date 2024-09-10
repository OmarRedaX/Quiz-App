// select html element
const category = document.querySelector("#categoryMenu");
const level = document.querySelector("#difficultyOptions");
const questionsNumber = document.querySelector("#questionsNumber");
const Btn = document.querySelector("#startQuiz");
// select form
const form = document.querySelector("#quizOptions");
const rowData = document.querySelector("#rowData");
// global variables
let myQuiz;
let questions;

// class Quiz
class Quiz {
  constructor({ category, level, questionsNumber }) {
    this.category = category;
    this.level = level;
    this.questionNum = questionsNumber;
    this.score = 0;
  }

  //   prepare
  prepareUrl() {
    return `https://opentdb.com/api.php?amount=${this.questionNum}&category=${this.category}&difficulty=${this.level}`;
  }

  //   call api
  async callApi() {
    const response = await fetch(this.prepareUrl());
    const data = await response.json();
    return data.results;
  }

  //   finalResult
  funalReuslt() {
    let cartona = `
   <div class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
 <h2 class="mb-0 text-center">
  ${
    this.score === questions.length
      ? "done"
      : `your score ${this.score} from ${questions.length}`
  }
</h2>
<button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
</div>
    `;
    rowData.innerHTML = cartona;

    // create new quiz
    let aginBtn = document.querySelector(".again");
    aginBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

// current question class
class Current {
  constructor(index) {
    this.index = index;
    this.category = questions[index].category;
    this.question = questions[index].question;
    this.correct = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.allAsnwers = [this.correct, ...this.incorrect_answers].sort();
    this.isAnswerd = false;
  }

  //   display
  display() {
    let x;
    let cartona = `
         <div
             class="question shadow-lg col-md-8 offset-md-2  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
             <div class="w-100 d-flex justify-content-between">
             <span class="btn btn-category">${this.category}</span>
             <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${
      questions.length
    } Questions</span>
             </div>
             <h2 class="text-capitalize h4 text-center">${this.question} </h2>
             <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
                   ${(x = this.allAsnwers.map((e) => `<li>${e}</li>`).join(""))}
             </ul>
             <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${
               myQuiz.score
             }</h2>
             </div>
      `;
    rowData.innerHTML = cartona;

    // select li to add check method
    let allLi = document.querySelectorAll("ul li");
    allLi.forEach((e) => {
      e.addEventListener("click", () => {
        this.checkAnswer(e);
      });
    });
  }

  //   check answer
  checkAnswer(choice) {
    if (!this.isAnswerd) {
      this.isAnswerd = true;
      if (choice.innerHTML === this.correct) {
        choice.classList.add("correct", "animate__animated", "animate__pulse");
        myQuiz.score++;
      } else {
        choice.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
      //   get next question
      setTimeout(() => {
        this.getNext();
      }, 1000);
    }
  }

  //   get next question
  getNext() {
    this.index++;
    if (this.index < questions.length) {
      let next = new Current(this.index);
      next.display();
    } else {
      // caal funcal resul
      myQuiz.funalReuslt();
    }
  }
}

// function
const start = async () => {
  const value = {
    category: category.value,
    level: level.value,
    questionsNumber: questionsNumber.value,
  };

  //create test
  myQuiz = new Quiz(value);

  // prepare Url
  myQuiz.prepareUrl();

  //   call api
  questions = await myQuiz.callApi();

  //   hide form
  form.classList.add("d-none");

  //   current quiestion
  const currentQ = new Current(0);
  currentQ.display();
};

Btn.addEventListener("click", start);
