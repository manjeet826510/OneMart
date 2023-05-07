# MERN amazona

# Lessons
1. Introduction
2. Install tools
3. Create react app
4. Create git repository
5. List Products
    1. create products array
    2. add product images
    3. render products
    4. style products
6. Add routing
    1. npm i react-router-dom
    2. create route for home screen
    3. create route for product screen
7. Create Node.JS Server
    1. run npm init in amazona/backend folder
    2. Update package.json set type: module to use ES6 module imports/ to use import instead of require
    3. create server.js
    4. npm install express
    5. Add .js to imports
    6. create express app
    7. move data.js from frontend to backend
    8. create route for /api/products
    9. run npm start
    10. npm install nodemon --save-dev
    11. put "start": "nodemon server.js", in scripts in backend package.json file
    12. run npm start
8. Fetch products from backend
    1. set proxy in frontend package.json so that frontend can access backend
    2. npm install axios in frontend
    3. use state hook
    4. use effect hook
    5. use reducer hook
9. Manage State by Reducer Hook
    1. define reducer
    2. update fetch data
    3. get state from useReducer
10. Add bootstrap UI Framework
    1. npm install react-bootstrap bootstrap
    2. update App.js
11. Create Product and Rating Component
    1. create Product component with Card
    2. create Rating component
    3. Use Rating component in Product component
12. Create Product Details Screen
    1. fetch product from backend
    2. create 3 columns for image, info and action
13. Create Loading and Message Component
    1. create loading component
    2. use spinner component
    3. create message component
    4. create utils.js to define getError function
14. Implement Add to Cart
    1. Create React Context
    2. define reducer
    3. create store provider
    4. implement add to cart button click handler
15. Complete Add to Cart
    1. check exist item in the cart
    2. check count in stock in backend