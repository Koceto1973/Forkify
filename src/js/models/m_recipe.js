import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${proxy}https://food2fork.com/api/get?key=${key}&rId=${this.id}`)
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.image = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch ( error ) {
            console.log('error getting recipe:' + error);
        }
    }

    // rough approximation
    cookTime() {
        ingredientsNumber = this.ingredients.length;
        const periods15min = Math.ceil(ingredientsNumber/3);
        this.time = periods15min*15;
    }

    // meals number
    calcServings() {
        this.servings = 4;
    }
}