// app controller

import Search from './models/m_search';
import * as searchView from './views/v_search';
import {elements, showLoaderIndicator, clearLoaderIndicator} from './views/v_shortcuts';

// global app state variable
const app_state = {};

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
        searchView.clearResults();
        showLoaderIndicator(elements.searchResult);

        // search for resipes
        await app_state.search.getResults();
    }

    // results to UI
    // console.log(app_state.search.result);
    clearLoaderIndicator();
    searchView.renderRecipes(app_state.search.result);    
}

elements.searchForm.addEventListener('submit',event => {
    event.preventDefault(); // prevent the event from activation, so we wait search results first
    controlSearch();
});