"use strict"

const recipeList = document.getElementById('recipeList')
const searchBar = document.getElementById('searchBar')
const modal = document.getElementById("recipeModal")
let recipes = []

searchBar.addEventListener('keyup', (e) => {
  let searchString = e.target.value.toLowerCase()
  let filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(searchString) ||
      recipe.tags.join(" ").includes(searchString) ||
      recipe.author.name.toLowerCase().includes(searchString) ||
      recipe.ingredients.join(" ").includes(searchString)
    )
  })
  displayRecipes(filteredRecipes)
})

const loadRecipes = async() => {
  try {
    let res = await fetch("/recipes")
    recipes = await res.json()
    // console.log(recipes)
    displayRecipes(recipes)
  } 
  catch (err) {
    console.error(err)
  }
}

const displayRecipes = (recipes) => {
  let htmlString = recipes
    .map((recipe) => {
      return `
        <li class="recipe" id="${recipe.title.replace(/\s/g, '')}">
          <div class="recipeHeader">
            <h2>${recipe.title}</h2>
            <p class="description">${recipe.description}</p>
            <a class="author" target="_blank" href="${recipe.author.url}">${recipe.author.name}</a>
            <span class="tags">${recipe.tags}</span>
          </div>
          <div class="moreinfo">
            <hr>
            <h3> Ingredients </h3>
            <div class="ingredients">
              <p class="servings">Makes ${recipe.servings} servings.</p>
              <p>${recipe.ingredients.join("</p><p>")}</p>
            </div>
            <h3> Directions </h3>
            <div class="directions"><p>${recipe.directions.join("</p><p>")}</p></div>
            <hr>
            <a class="source" target="_blank" href="${recipe.source_url}">Sourced from AllRecipes.com</a>
          </div>
        </li>`
    })
    .join('')
  recipeList.innerHTML = htmlString

  // Adding an event listener to collapsibles
  let recipehead = document.getElementsByClassName("recipeHeader")
  //console.log(recipeDOM)
  for (let i = 0; i < recipehead.length; i++) {
    // console.log(recipehead[i])
    recipehead[i].addEventListener("click", () => {
      // console.log("Click")
      let moreInfo = recipehead[i].nextElementSibling
      // console.log(moreInfo)
      if (moreInfo.style.display === "block") {
        moreInfo.style.display = "none"
      } else {
        moreInfo.style.display = "block"
      }
    })
  }
}

loadRecipes()
