import { useState } from "react";
import axios from "axios";

const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientItem, setIngredientItem] = useState("");
  const [recipe, setRecipe] = useState(null); // single recipe instead of array
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setIngredientItem(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!ingredientItem.trim()) return;
    setIngredients((prev) => [...prev, ingredientItem.trim()]);
    setIngredientItem("");
  }

  async function fetchRecipe() {
    setLoading(true);
    try {
      // First: find recipes by ingredients
      const res = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients: ingredients.join(","),
            number: 6,
            apiKey: import.meta.env.VITE_SPOONACULAR_KEY,
          },
        }
      );

      if (res.data.length > 0) {
        
        const randomRecipe = res.data[Math.floor(Math.random() * res.data.length)];

        
        const detailRes = await axios.get(`https://api.spoonacular.com/recipes/${randomRecipe.id}/information`,
          {
            params: {
              apiKey: import.meta.env.VITE_SPOONACULAR_KEY,
              includeNutrition: false,
            },
          }
        );

        setRecipe(detailRes.data);
      } else {
        setRecipe(null);
        alert("No recipes found with those ingredients.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching recipe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="bg-black text-white overflow-x-hidden">
        <h1 className="text-center text-2xl py-4 font-bold">MY CHEF BOOK</h1>
      </header>

      <main className="bg-gray-100 text-2xl px-8 py-4 min-h-[100vh] overflow-x-hidden">
        <p>Type in the food ingredients(list at least three)</p>
        <form
          onSubmit={handleSubmit}
          className="gap-4 flex space-x-3 flex-wrap"
        >
          <input
            type="text"
            className="border-gray-700 border-2 rounded-lg px-3"
            value={ingredientItem}
            onChange={handleChange}
          />
          <button
            className="bg-black text-white rounded-lg p-3"
            type="submit"
          >
            + Add
          </button>
        </form>

        <div>
          <p>The ingredients typed are listed below</p>
          <ul className="list-disc px-8">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {ingredients.length >= 3 && (
          <div className="bg-gray-300 p-8 flex flex-col space-y-4 rounded-lg mt-5">
            <p>Click on this button to get a recipe</p>
            <button
              className="text-left w-fit bg-orange-500 rounded-lg text-white px-4 py-2"
              onClick={fetchRecipe}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get recipe"}
            </button>
          </div>
        )}

        {recipe && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold text-xl mb-2">{recipe.title}</h3>
            <img
              src={recipe.image}
              alt={recipe.title}
              className="rounded-lg mb-4"
              width="250"
            />
            <h4 className="font-semibold mb-2">Cooking Steps:</h4>
            <ol className="list-decimal px-6">
              {recipe.analyzedInstructions.length > 0
                ? recipe.analyzedInstructions[0].steps.map((step) => (
                    <li key={step.number} className="mb-2">
                      {step.step}
                    </li>
                  ))
                : "No steps available"}
            </ol>
          </div>
        )}
      </main>
    </>
  );
};

export default App;
