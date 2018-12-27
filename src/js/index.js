// app controller

// imports
import Search from './models/m_search';
import Recipe from './models/m_recipe';
import List from './models/m_shopping';
import Likes from './models/m_likes';
import * as searchView from './views/v_search';
import * as recipeView from './views/v_recipe';
import * as listView from './views/v_shopping';
import * as likesView from './views/v_likes';
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
        recipeView.clearRecipe();
        showLoaderIndicator(elements.searchResult);

        try {
            // search for resipes
            await app_state.search.getResults();

            // results to UI
            // console.log(app_state.search.result);
            searchView.renderRecipes(app_state.search.result);
        } catch(error) {
            alert('Error processing search for recipes!');
            console.log('index.js/ search controller: Error processing search for recipes!');
            console.log(error);
        };
        
        clearLoaderIndicator();
    }

        
};

elements.searchForm.addEventListener('submit',event => {
    event.preventDefault(); // do not submit the form
    controlSearch();
});

elements.searchResultPages.addEventListener('click',event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto,10);
        elements.searchResultPages.innerHTML = '';
        searchView.clearResults();
        recipeView.clearRecipe();
        searchView.renderRecipes(app_state.search.result,goToPage);  
    }
});

// recipe controller
const controlRecipe = async () => {
    // get the id from url
    const id = window.location.hash.replace('#','');
    // console.log('recipe controller:' + id);

    if (id) {
        // prepare ui for changes
        recipeView.clearRecipe();
        showLoaderIndicator(elements.recipe);

        // Highlight selected search item
        if (app_state.search) searchView.highlightSelected(id);

        // create new recipe object
        app_state.recipe = new Recipe(id);

        try {
            // get recipe data
            await app_state.recipe.getRecipe();
            // console.log('resipe from API:');
            // console.log(app_state.recipe);
            
            // calc servings and time, parse ingredients
            app_state.recipe.cookTime();
            app_state.recipe.calcServings();
            app_state.recipe.parseIngredients();
            // console.log('resipe after parsing ingredients:');
            // console.log(app_state.recipe);

            // render recipe
            clearLoaderIndicator();
            recipeView.renderRecipe(app_state.recipe);

        } catch(error) {
            alert('Error processing recipe!');
            console.log('index.js/ recipe controller: Error processing recipe!');
            console.log(error);
        }
        
    }
};

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

// list controller
const controlList = () => {
    // Create a new list IF there in none yet
    if (!app_state.list) app_state.list = new List();

    // Add each ingredient to the list and UI
    app_state.recipe.ingredients.forEach(el => {
        const item = app_state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// likes controller
const controlLike = () => {
    if (!app_state.likes) app_state.likes = new Likes();
    const currentID = app_state.recipe.id;
    
    // User has NOT yet liked current recipe
    if (!app_state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = app_state.likes.addLike(
            currentID,
            app_state.recipe.title,
            app_state.recipe.author,
            app_state.recipe.image
        );
        console.log(newLike);

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        app_state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(app_state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    app_state.likes = new Likes();
    
    // Restore likes
    app_state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(app_state.likes.getNumLikes());

    // Render the existing likes ( watch out the node list )
    Array.prototype.forEach.call(app_state.likes, like => likesView.renderLike(like));    // ok for IE
});

// Handling recipe buttons clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (app_state.recipe.servings > 1) {
            app_state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(app_state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        app_state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(app_state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    } 
});
