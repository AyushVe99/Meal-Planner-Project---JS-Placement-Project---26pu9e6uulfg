WebFont.load({
  google: {
    families: ["Cookie:regular"]
  }
});
const API_KEY = "a02399d93f914654a7bec3bc12eba59f";
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const activityInput = document.getElementById("activity");
const submit = document.getElementById("submitBtn");
const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
const ingredientSection = document.getElementById("ingredients");
const stepsSection = document.getElementById("steps");
const equipmentSection = document.getElementById("equipment");
const recipeSection = document.getElementById("recipe-section");


const getCalorie = () => {
  let height = heightInput.value;
  let weight = weightInput.value;
  let age = ageInput.value;
  let gender= genderInput.value;
  let activity = activityInput.value;
  let bmr;

  if (height === "" || height <= 0 || weight === "" || weight <= 0 || age === "" || age <= 0) {
    alert(
      "All input field should not be empty and should not have negetive value"
    );
    return;
  }

  if (gender === "female") {
    bmr = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
  } else if (gender === "male") {
    bmr = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
  }
let calories;
  // Daily Calorie Requirement
  if (activity === "light") {
    calories =bmr*1.375;
  } else if (activity === "moderate") {
   calories= bmr*1.55;
  } else if (activity === "active") {
    calories=bmr*1.725;
  }

  getMeals(calories);
};

const getMeals = async (calories) => {
  document.getElementById("loader").style.display = "block";
  const url = `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${calories}&apiKey=${API_KEY}&includeNutrition=true`;

  let datas;
  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      datas = data;
    });
  generateMealsCard(datas);
  document.getElementById("loader").style.display = "none";
};

const generateMealsCard = (datas) => {
  let cards = ``;
  mealsDetails.innerHTML = `
  <h1>Nutrients</h1>
  <div class="d-flex justify-content-center">
      <p class="px-2">Calories : ${datas?.nutrients?.calories}</p>
      <p class="px-2">Carbohydrates : ${datas.nutrients?.carbohydrates}</p>
      <p class="px-2">Fat : ${datas.nutrients?.fat}</p>
      <p class="px-2">Protein : ${datas.nutrients?.protein}</p>
  </div>
  `;
  datas.meals.map(async (data) => {
    const url = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    let imgURL;
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        imgURL = data.image;
      });
      console.log(data);
    cards += `
        <div class="col-md-4 d-flex justify-content-center mb-2">
            <div class="card baseBlock" style="width: 18rem;">
                <img src=${imgURL} class="card-img-top"
                    alt="meal 1">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p>Preparation Time - ${data.readyInMinutes}</p>
                    <button class="btn btn-outline-primary" onClick="btnRecipe(${data.id})" >Get Recipe</button>
                </div>
            </div>
        </div>
        `;
    cardContainer.innerHTML = cards;
  });
};

const btnRecipe = async (data) => {
  recipeSection.innerHTML = "";
  ingredientSection.innerHTML = "";
  stepsSection.innerHTML = "";
  equipmentSection.innerHTML = "";
  const url = `https://api.spoonacular.com/recipes/${data}/information?apiKey=${API_KEY}&includeNutrition=false`;
  let information;

  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      information = data;
    });

  recipeSection.textContent = `${information.title} Recipe`;

  //   Ingridents
  let htmlData = ``;
  let inCardDiv = document.createElement("div");
  inCardDiv.classList.add("carddesign", "card", "h-100");
  let inCardBody = document.createElement("div");
  inCardBody.classList.add("card-body");
  let inOverlay = document.createElement("div");
  inOverlay.classList.add("overlay");
  let ul = document.createElement("ul");
  information.extendedIngredients.map((ingre) => {
    htmlData += `
        <li>${ingre.original}</li>
        `;
  });
  ul.innerHTML = htmlData;
  let ingreH1 = document.createElement("h3");
  ingreH1.textContent = "INGREDIENTS";
  inCardBody.appendChild(inOverlay);
  inCardBody.appendChild(ingreH1);
  inCardBody.appendChild(ul);
  inCardDiv.appendChild(inCardBody);
  ingredientSection.appendChild(inCardDiv);

  //   Steps
  let stepsHtml = ``;
  let stCardDiv = document.createElement("div");
  stCardDiv.classList.add("carddesign", "card", "h-100");
  let stCardBody = document.createElement("div");
  stCardBody.classList.add("card-body");
  let stOverlay = document.createElement("div");
  stOverlay.classList.add("overlay");
  let stepsOl = document.createElement("ol");
  information.analyzedInstructions[0].steps.map((step) => {
    stepsHtml += `
        <li>${step.step}</li>
        `;
  });
  stepsOl.innerHTML = stepsHtml;
  let stepsH1 = document.createElement("h3");
  stepsH1.textContent = "STEPS";
  stCardBody.appendChild(stOverlay);
  stCardBody.appendChild(stepsH1);
  stCardBody.appendChild(stepsOl);
  stCardDiv.appendChild(stCardBody);
  stepsSection.appendChild(stCardDiv);

  // equipmentSection
  const urlEquip = `https://api.spoonacular.com/recipes/${data}/equipmentWidget.json?apiKey=${API_KEY}&includeNutrition=false`;
  let equip;

  await fetch(urlEquip)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      equip = data;
    });

  let equipData = ``;
  let eqCardDiv = document.createElement("div");
  eqCardDiv.classList.add("carddesign", "card", "h-100");
  let eqCardBody = document.createElement("div");
  eqCardBody.classList.add("card-body");
  let eqOverlay = document.createElement("div");
  eqOverlay.classList.add("overlay");
  let equipUl = document.createElement("ul");
  equip.equipment.map((equip) => {
    equipData += `
            <li>${equip.name}</li>
            `;
  });
  equipUl.innerHTML = equipData;
  let equipH1 = document.createElement("h3");
  equipH1.textContent = "EQUIPMENT";
  eqCardBody.appendChild(eqOverlay);
  eqCardBody.appendChild(equipH1);
  eqCardBody.appendChild(equipUl);
  eqCardDiv.appendChild(eqCardBody);
  equipmentSection.appendChild(eqCardDiv);
};

submit.addEventListener("click", getCalorie);

async function initialMeal(){
  const url=`https://api.spoonacular.com/mealplanner/generate?apiKey=a02399d93f914654a7bec3bc12eba59f&timeFrame=day`
  const api=await fetch(url);
  const resp=await api.json();
  return resp;
}
async function intialMealData(data){
  cardContainer.innerHTML=" ";
  data.map(async (data)=>{
    const mealURL=`https://api.spoonacular.com/recipes/${data.id}?apiKey=a02399d93f914654a7bec3bc12eba59f&includeNutrition=false`
    const respMeal=await fetch(mealURL);
    const res= await respMeal.json();
    generateHTML(res,data.id);
  })
  
}
async function generateInitialMeal(){
  const data=await initialMeal()
  await intialMealData(data.meals);
}
generateInitialMeal();