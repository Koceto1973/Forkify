import {elements} from './base';

export const getInput = () => {
    return elements.searchInput.value;
}

export const renderRecipes = (recipes) => {
    recipes.forEach(element => {
        renderRecipe(element);
    });
}

// rendering single recipe is not exported
const renderRecipe = (recipe) => {
    const recipeMarkupItem = `
        <li>
            <a class="results__link " href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultList.insertAdjacentHTML("beforeend",recipeMarkupItem);
}

export const clearSearchField = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
}