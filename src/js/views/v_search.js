import {elements} from './v_shortcuts';

export const getInput = () => {
    return elements.searchInput.value;
}

export const renderRecipes = (recipes, pageNumber =1, perPage = 10) => {
    // render results of current page
    const start = (pageNumber-1)*perPage;
    const end = start + perPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination butttons
    renderButtons(pageNumber,recipes.length,perPage);
}

// pagination buttons
const renderButtons = (pageNumber, resultsNumber, perPage) => {
    const pagesNumber = Math.ceil(resultsNumber/perPage);
   	
	if ( pagesNumber !== 1 ) {

        let button;
		
        if ( pageNumber === 1 ) {
            // show next button
            console.log('showing next');
            button = createPageButton(pageNumber,'next');
		} else if ( pageNumber === pagesNumber ) {
            // show previous button
            console.log('swowing previous');
            button = createPageButton(pageNumber,'prev');
        } else if ( pagesNumber>2 ) { // show both buttons
            console.log('showing both');
            button = `
                        ${createPageButton(pageNumber,'next')}

                        ${createPageButton(pageNumber,'prev')}
                     `;
        }

        elements.searchResultPages.insertAdjacentHTML('afterbegin',button);
	}
}

const createPageButton = (pageNumber, buttonType) =>
	`
		<button class="btn-inline results__btn--${buttonType}" data-goto=${buttonType === 'prev' ? pageNumber-1: pageNumber+1}>
				<svg class="search__icon">
					<use href="img/icons.svg#icon-triangle-${buttonType === 'prev' ? 'left': 'right'}"></use>
				</svg>
				<span>Page ${buttonType === 'prev' ? pageNumber-1: pageNumber+1}</span>
        </button>
    `;

const hidePageButton = () => {
	// todo
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
    
    if ( recipe_title.length>limit ) {

        let recipe_titleInWords = recipe_title.split(' ');

        if ( recipe_titleInWords[0].length>limit ) {

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