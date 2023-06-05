import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  update,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

let inputEl = document.getElementById("inputs");
let inputToEl = document.getElementById("inputTo");
let inputFromEl = document.getElementById("inputFrom");
let btnEl = document.getElementById("btn");
let endorsementsLi = document.getElementById("endorsementEl");

const appSettings = {
  databaseURL: "https://we-are-champions-3-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsDB = ref(database, "endorsements");

btnEl.addEventListener("click", function () {
  let inputValue = inputEl.value;
  let inputTo = inputToEl.value;
  let inputFrom = inputFromEl.value;

  if (inputValue && inputTo && inputFrom) {
    const endorsement = {
      from: inputFrom,
      to: inputTo,
      message: inputValue,
      rating: 0,
    };
    console.log(endorsement);
    push(endorsementsDB, endorsement);
  } else {
    alert("We will like to get an endorsement from you");
  }
  inputEl.value = "";
  inputFromEl.value = "";
  inputToEl.value = "";
});

onValue(endorsementsDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementsArray = Object.entries(snapshot.val());
    clearBooksListEl();
    for (let i = 0; i < endorsementsArray.length; i++) {
      let endorsementsList = endorsementsArray[i];
      let endorsementsKey = endorsementsList[0];
      let endorsementsValue = endorsementsList[1];

      appendItemToEndorsementListEl(endorsementsList);
    }
  } else {
    endorsementsLi.innerHTML = "No endorsements yet";
  }
});

function clearBooksListEl() {
  endorsementsLi.innerHTML = " ";
}

function appendItemToEndorsementListEl(item) {
  console.log(item);
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("div");
  let ratingDiv = document.createElement("div");
  let firstFrom = document.createElement("h4");
  let secondTo = document.createElement("h4");
  let p = document.createElement("p");
  let number = document.createElement("h4");
  let ratings = document.createElement("div");
  let likeImage = document.createElement("img");
  likeImage.src = "./412.png";

  newEl.setAttribute("id", "endorsementsDiv");
  ratingDiv.setAttribute("id", "ratings");
  ratings.setAttribute("id", "ratingsInnerDiv");
  likeImage.setAttribute("id", "ratingsImg");

  p.textContent = itemValue.message;
  firstFrom.textContent = `From ${itemValue.from}`;
  secondTo.textContent = `To ${itemValue.to}`;
  number.textContent = itemValue.rating;

  ratings.append(likeImage);
  ratings.append(number);
  ratingDiv.append(secondTo);
  ratingDiv.append(ratings);
  newEl.append(firstFrom);
  newEl.append(p);
  newEl.append(ratingDiv);
  console.log(itemValue);

  likeImage.addEventListener("click", function () {
    itemValue.rating = itemValue.rating + 1;
    number.textContent = itemValue.rating;
    console.log(itemValue.rating);

    update(ref(database, `endorsements/${itemID}`), {
      rating: itemValue.rating,
    });
  });

  // newEl.addEventListener("dblclick", function () {
  //   let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`);
  //   remove(exactLocationOfItemInDB);
  // });

  endorsementsLi.insertBefore(newEl, endorsementsLi.children[0]);
}
