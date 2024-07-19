## Run json server

json-server --port <port> --watch db.json

## new react app

npm create vite@latest <name> -- --template react

## add this to package.json

scripts -> "server": "json-server -p3001 --watch db.json"

## add express and nodemon

npm install express || npm install --save-dev nodemon

### add this to packages.json to run nodemon in dev

"scripts": {
"start": "node index.js",
"dev": "nodemon index.js",
"test": "echo \"Error: no test specified\" && exit 1"}
