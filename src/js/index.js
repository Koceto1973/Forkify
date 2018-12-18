// app controller

import Search from './models/Search';

// global app state variable
const state = {};

const controlSearch = async () => {
    // get the query from the view
    const query='pizza'; 

    if (query) {
        // new search, add it to state
        state.search = new Search(query);

        // prepare UI for the result

        // search for resipes
        await state.search.getResults();
    }

    // results to UI
    console.log(state.search.result);
}

document.querySelector('.search').addEventListener('submit',event => {
    event.preventDefault(); // prevent the event from activation, so we wait serch results first
    controlSearch();
});