import {elements} from './v_shortcuts';

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
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
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

// only one row for recipe title
const limitRecipeTitle = (recipe_title, limit = 17) => {
    if (recipe_title.length>limit) {
        let recipe_titleInWords = recipe_title.split(' ');
        if (recipe_titleInWords[0]>limit) {
            if (recipe_titleInWords.length === 1) { 
                return recipe_titleInWords[0]; // title is only one long word
            } else {  
                return recipe_titleInWords[0] + '...'; // title is more than one long word
            }
        }
         // first word is short
        const newTitle = [];
        recipe_title.split(' ').reduce((accumulator, current)=>{
            if(accumulator+current.length <= limit) {
                newTitle.push(current);
            }

            return accumulator+current.length;
        },0);

        return `${newTitle.join(' ')} ...`;
    }

    return recipe_title;
}