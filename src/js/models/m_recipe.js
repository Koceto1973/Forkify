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
        const ingredientsNumber = this.ingredients.length;
        const periods15min = Math.ceil(ingredientsNumber/3);
        this.time = periods15min*15;
    }

    // meals number
    calcServings() {
        this.servings = 4;
    }

    // almost all edge case
    parseIngredients() {
        // from, plurals first
        const unitsLong =  ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        // to
        const unitsShort = ['tbsp',          'tbsp',      'oz',     'oz',     'tsp',       'tsp',    'cup',  'pound'];
        const units =      [...unitsShort, 'kg', 'g'];

        // build the object by parsing the ingredients
        const newIngredients = this.ingredients.map(el => {
            // Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index]);
            });

            // Remove parentheses
            // global search to remove all (text) occurences
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            // if element is in units, take it's index
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            // proforma ingredient
            let objIng;

            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+')); // case 1-1/2
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // NO unit, 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // NO unit, NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            
            // ready to return ingredient
            // console.log(objIng);
            return objIng;
        });

        // return the built
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}