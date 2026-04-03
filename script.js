const searchBtn = document.getElementById('search-btn');
const search = document.getElementById('search');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');

function searchMeal() {
    single_mealEl.innerHTML = '';
    const term = search.value;
    
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
                    mealsEl.innerHTML = '';
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal" data-mealID="${meal.idMeal}">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `).join('');
                }
            });
    } else {
        alert('Please enter a search term');
    }
}

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
            mealsEl.innerHTML = '';
            resultHeading.innerHTML = '';
        });
}

function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    single_mealEl.innerHTML = `
        <div class="single-meal-card">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>Area: ${meal.strArea}</p>` : ''}
            </div>
            <div class="main-text">
                <p>${meal.strInstructions}</p>
                <h3>Ingredients:</h3>
                <ul class="ingredients">
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    single_mealEl.scrollIntoView({ behavior: "smooth" });
}

searchBtn.addEventListener('click', searchMeal);
search.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchMeal(); });

mealsEl.addEventListener('click', e => {
    const mealInfo = e.composedPath().find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }
});
