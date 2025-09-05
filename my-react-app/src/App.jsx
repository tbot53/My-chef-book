import { useState } from "react";
import axios from "axios";

const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientItem, setIngredientItem] = useState("");
  const [recipe, setRecipe] = useState(null);
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
        const randomRecipe =
          res.data[Math.floor(Math.random() * res.data.length)];

        const detailRes = await axios.get(
          `https://api.spoonacular.com/recipes/${randomRecipe.id}/information`,
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
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md">
        <h1 className="text-center text-3xl md:text-4xl py-5 font-extrabold tracking-wide">
          🍳 My Chef Book
        </h1>
      </header>

      {/* Main Content */}
      <main className="bg-gray-50 px-6 md:px-12 py-8 min-h-[100vh]">
        <p className="text-lg md:text-xl font-medium text-gray-800 mb-4">
          Type in your ingredients (list at least three):
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 items-center mb-6"
        >
          <input
            type="text"
            placeholder="Enter an ingredient..."
            className="flex-1 min-w-[200px] border-gray-300 border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            value={ingredientItem}
            onChange={handleChange}
          />
          <button
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl px-5 py-2 font-semibold shadow hover:scale-105 transition"
            type="submit"
          >
            + Add
          </button>
        </form>

        {/* Ingredient List */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700 mb-2">
            Ingredients you’ve added:
          </p>
          <ul className="list-disc pl-6 text-gray-800 space-y-1">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="capitalize">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Fetch Recipe Button */}
        {ingredients.length >= 3 && (
          <div className="bg-orange-100 border-l-4 border-orange-500 p-6 rounded-xl mb-6">
            <p className="mb-3 text-gray-800 font-medium">
              Ready? Get a recipe idea based on your ingredients:
            </p>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-3 font-semibold transition w-fit"
              onClick={fetchRecipe}
              disabled={loading}
            >
              {loading ? "Cooking up ideas..." : "🍲 Get Recipe"}
            </button>
          </div>
        )}

        {/* Recipe Display */}
        {recipe && (
          <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="font-bold text-2xl mb-4 text-gray-900">
              {recipe.title}
            </h3>
            <img
              src={recipe.image}
              alt={recipe.title}
              className="rounded-lg mb-6 w-full max-w-md mx-auto shadow"
            />
            <h4 className="font-semibold text-lg mb-3 text-gray-800">
              Cooking Steps:
            </h4>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              {recipe.analyzedInstructions.length > 0
                ? recipe.analyzedInstructions[0].steps.map((step) => (
                    <li key={step.number}>{step.step}</li>
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
