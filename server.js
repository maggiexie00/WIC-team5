// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.message;
    let response;

    if (userInput.toLowerCase().includes("recipe")) {
        response = await getRecipe(userInput);
    } else if (userInput.toLowerCase().includes("nutrition")) {
        response = await getNutrition(userInput);
    } else {
        response = "I can help you with recipes and nutrition information. Ask me about a recipe or nutrition!";
    }

    res.json({ response });
});

const getRecipe = async (query) => {
    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                query: query.replace("recipe", "").trim(),
                apiKey: SPOONACULAR_API_KEY
            }
        });

        const recipes = response.data.results;

        if (recipes.length) {
            const recipe = recipes[0];
            return `How about trying the recipe for ${recipe.title}? You can find it here: ${recipe.sourceUrl}`;
        } else {
            return "I couldn't find any recipes matching your query. Please try again with a different recipe name.";
        }
    } catch (error) {
        return "There was an error retrieving the recipe information.";
    }
};

const getNutrition = async (query) => {
    try {
        const response = await axios.get(`https://api.spoonacular.com/food/ingredients/search`, {
            params: {
                query: query.replace("nutrition", "").trim(),
                apiKey: SPOONACULAR_API_KEY
            }
        });

        const ingredients = response.data.results;

        if (ingredients.length) {
            const ingredientId = ingredients[0].id;
            const ingredientInfo = await axios.get(`https://api.spoonacular.com/food/ingredients/${ingredientId}/information`, {
                params: { apiKey: SPOONACULAR_API_KEY }
            });

            const nutrition = ingredientInfo.data.nutrition.nutrients;
            const calories = nutrition.find(n => n.name === 'Calories').amount;
            return `The ingredient ${ingredients[0].name} contains ${calories} calories.`;
        } else {
            return "I couldn't find any nutrition information for your query. Please try again with a different food item.";
        }
    } catch (error) {
        return "There was an error retrieving the nutrition information.";
    }
};

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
