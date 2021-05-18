"use strict"

const 
    http = require("http"),
    path = require('path'),
    fs = require("fs"),
    glob = require("glob"),
    nStatic = require("node-static"),
    fileServer = new nStatic.Server("./www")

http.createServer((req, res) => {
    req.addListener("end", () => {
        fileServer.serve(req, res, (e, result) => {
            if (req.url === '/favicon.ico') {
                // removes the favicon requests 
                // otherwise the can interfere with the router check
                res.writeHead(200, {'Content-Type': 'image/x-icon'} )
            } else if (req.url === "/") {
                console.log("Main page rendering")
                // getAllRecipes((data) => {
                //     res.recipes = data
                // })
                fileServer.serveFile("/main.html", 200, {}, req, res)
            } else if (req.url === "/recipes") {
                res.writeHead(200,{"Content-Type" : "application/json"})
                getAllRecipes((data) => {
                    // console.log(data)
                    res.write(JSON.stringify(data))
                    res.end()
                })
            } else if (e && (e.status === 404)) { 
                console.log("Error page rendering")
                fileServer.serveFile("/404.html", 404, {}, req, res)
            }
        })
    }).resume()
}).listen(8080)

/**
 * Retrieves all json files from the data folder.
 * Transforms the files into json objects and stores them in an array.
 * @param {*} callback 
 */
 function getAllRecipes(callback) {
    let dataPath = path.resolve(__dirname, './www/data')
    // console.log(dataPath)
    let recipes = []
    glob("*.json", {cwd: dataPath}, (err, files) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(files)
            for (let file of files) {
                // console.log(file)
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