// app controller

import Search from './models/m_search';
import Recipe from './models/m_recipe';
import * as searchView from './views/v_search';
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

        // search for resipes
        await app_state.search.getResults();
    }

    // results to UI
    // console.log(app_state.search.result);
    clearLoaderIndicator();
    searchView.renderRecipes(app_state.search.result);    
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

};



// // recipe check
// let r = new Recipe(46956);
// r.getRecipe();
// console.log(r);