// app controller

import Search from './models/m_search';
import Recipe from './models/m_recipe';
import * as searchView from './views/v_search';
import * as recipeView from './views/v_recipe';
import {elements, showLoaderIndicator, clearLoaderIndicator} from './views/v_shortcuts';

// global app state variable
const app_state = {};

// search controller
const controlSearch = async () => {
    // get the query from the view
    const query= searchView.getInput();
    // console.log(query); 

    if (query) {
        // new search, add it to state
        app_state.search = new Search(query);
        // console.log(app_state.search);

        // prepare UI for the result
        searchView.clearSearchField();
        searchView.clearResults();     // clear search results
        elements.searchResultPages.innerHTML = '';  // clear search results pagination
        showLoaderIndicator(elements.searchResult);

        try {
            // search for resipes
            await app_state.search.getResults();

            // results to UI
            // console.log(app_state.search.result);
            searchView.renderRecipes(app_state.search.result);
        } catch(error) {
            alert('Error processing search for recipes!');
            console.log(error);
        };
        
        clearLoaderIndicator();
    }

        
};

elements.searchForm.addEventListener('submit',event => {
    event.preventDefault(); // prevent the event from activation, so we wait search results first
    controlSearch();
});

elements.searchResultPages.addEventListener('click',event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto,10);
        elements.searchResultPages.innerHTML = '';
        searchView.clearResults();
        searchView.renderRecipes(app_state.search.result,goToPage);  
    }
});

// recipe controller
const controlRecipe = async () => {
    // get the id from url
    const id = window.location.hash.replace('#','');
    console.log('recipe controller:' + id);

    if (id) {
        // prepare ui for changes
        recipeView.clearRecipe();
        showLoaderIndicator(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object
        app_state.recipe = new Recipe(id);

        try {
            // get recipe data
            await app_state.recipe.getRecipe();
            console.log('resipe from API:');
            console.log(app_state.recipe);
            
            // calc servings and time, parse ingredients
            app_state.recipe.cookTime();
            app_state.recipe.calcServings();
            state.recipe.parseIngredients();
            console.log('resipe after parsing ingredients:');
            console.log(app_state.recipe);

            // render recipe
            clearLoaderIndicator();
            recipeView.renderRecipe(app_state.recipe);

        } catch(error) {
            alert('Error processing recipe!');
            console.log(error);
        }
        
    }
};

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


// // recipe check
// let r = new Recipe(46956);
// r.getRecipe();
// console.log(r);