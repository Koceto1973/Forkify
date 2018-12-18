// app controller

import Search from './models/Search';
import * as searchView from './views/SearchView';
import {elements} from './views/base';

// global app state variable
const state = {};

const controlSearch = async () => {
    // get the query from the view
    const query= searchView.getInput(); 

    if (query) {
        // new search, add it to state
        state.search = new Search(query);

        // prepare UI for the result
        searchView.clearSearchField();
        searchView.clearResults();

        // search for resipes
        await state.search.getResults();
    }

    // results to UI
    // console.log(state.search.result);
    searchView.renderRecipes(state.search.result);    
}

elements.searchForm.addEventListener('submit',event => {
    event.preventDefault(); // prevent the event from activation, so we wait search results first
    controlSearch();
});