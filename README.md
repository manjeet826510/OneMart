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
16. Create Cart Screen
    1. create 2 columns
    2. display items list
    3. create action column
17. Complete Cart Screen
    1. click handler for inc/dec item
    2. click handler for remove item
    3. Storing cartItems in local storage
    4. click handler for checkout
    5. add to cart implement for product.js
18. Create Signin Screen
    1. create signin form
    2. add  email and password
    3. add signin button
19. Connect To MongoDB Database
    1. create atlas mongodb database
    2. install local mongodb database
    3. npm install mongoose
    4. connect to mongodb database 
20. Seed Sample Data
    1. create Product model
    2. create seed route
    3. create product route
    4. use route in server.js
    5. seed sample product
    6. put product related routes in productRoutes
21. Seed Sample Users
    1. create user model
    2. seed sample users
    3. install bcryptjs
    4. add users in data.js
    5. create user routes
22. Create signin backend API
    1. create signin api in server.js and create userRoutes and install express-async-handler
    2. npm install jsonwebtoken 
    3. define generateToken
23. Complete Signin Screen
    1. handle submit action
    2. save token in store and local storage
    3. show user name in header