"use strict"

const fs = require("fs")
const glob = require("glob")
const path = require("path")

/**
 * Retrieves all json files from the data folder.
 * Transforms the files into json objects and stores them in an array.
 * @param {*} callback 
 */
function getAllRecipes(callback) {
    let dataPath = path.resolve(__dirname, '../www/data')
    // console.log(dataPath)
    let recipes = []
    glob("*.json", {cwd: dataPath}, (err, files) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(files)
            for (let file of files) {
                // console.log(file)
                // console.log(dataPath+"/"+file)
                let filePath = dataPath+"/"+file
                let raw = fs.readFileSync(filePath)   
                let recipe = JSON.parse(raw)
                // console.log(recipe)
                recipes.push(recipe)           
            }
        }
        // console.log(recipes)
        callback(recipes)
    })
}

getAllRecipes((data) => {console.log(data)})

module.exports = getAllRecipes