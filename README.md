### Responsibilities:
- Authentication
- Implement all API endpoints in routes: 
    - Controller's functionalities for users, products, orders
- Data models (Schemas) for users, products, orders
- Implement event listeners to handle interaction at pages: users.html, products.html, and orders.html
- Write JSDoc for all exported functions
- Fix ESLint errors and warnings
- Fix all critical and serious issues related to accessibility
- Code coverage
- Fix bugs, vulnerabilities and code smells when analysing in SonarQube
- Deploy this web application on Heroku  
- Write documentations
- Draw UML diagram


## WebDev1 coursework assignment  

A simple web shop with vanilla HTML, CSS. Heroku link to the website: https://webdev04.herokuapp.com/. In order to log in, one can use the following username and password:  
- As admin: admin@email.com and _1234567890_  
- As customer: customer@email.com and _0987654321_  

Or registering as a [new user](https://webdev04.herokuapp.com/register.html) and log in with that new created account


## The project structure  

```
.
├── index.js                        --> Starting point of the application  
├── routes.js                       --> Handle backend  
├── auth                            --> Authorization  
│   └──  auth.js                    --> Function handling authorization of log in user  
├── controllers                     --> Controllers  
│   ├── orders.js                   --> Controller for order  
│   ├── products.js                 --> Controller for product  
│   └── users.js                    --> Controller for user  
├── models                          --> Models  
│   ├── product.js                  --> Model for product  
│   ├── user.js                     --> Model for user  
│   ├── order.js                    --> Model for order  
│   └── db.js                       --> mongoose set up     
├── public                          --> View  
│   ├── css                         --> Style for HTML elements
│   |   └── styles.css              --> Define styles in this file
│   ├── img                         --> Products' images  
│   ├── js                          --> Scripts for event listeners 
│   │   ├── adminUsers.js           --> Handle actions in the list of user page
│   │   ├── cart.js                 --> Handle actions in the shopping cart page
│   │   ├── product.js              --> Handle actions in the products page
│   │   ├── register.js             --> Handle actions in the registration page
│   │   └── utils.js                --> Helper functions for handling requests, responses, products, users, carts (used by the above files)
│   ├── 404.html                    --> Front-end of error page
│   ├── cart.html                   --> Front-end of order page
│   ├── index.html                  --> Front-end of homepage
│   ├── products.html               --> Front-end of products page
│   ├── register.html               --> Front-end of registration page
│   └── users.html                  --> Front-end of users page
├── setup                           --> Database
|   ├── create-orders.js            --> Populate database with orders' data
|   ├── products.json               --> Product data
|   ├── reset-db.js                 --> Populate database with data of users and products
|   └── users.json                  --> User data
├── test                            --> Tests  
│   ├── auth                        --> Authorization test
|   |   └── auth.test.js            --> All tests about authorization
│   ├── controllers                 --> Controller test  
│   │   ├── products.test.js        --> Product test 
|   |   └── users.test.js           --> User test
|   ├── models                      --> Model test
|   |   ├── db.test.js              --> Test for getting database url
|   |   └── user.test.js            --> Test of user's model
|   └── utils                       --> Test of utility functions
|   |    ├── requestUtils.test.js   --> Test for helper functions handling request 
|   |    └── responseUtils.test.js  --> Test for helper functions handling response
|   ├── routes.test.js              --> Test for all actions in route
|   ├── setup.test.js               --> Test database setup, connection
|   └── ui.test.js                  --> Test of front-end/UI 
├── utils                           --> Utility functions, intended to be used by other modules  
│   ├── render.js                   --> Utilities for rendering  
│   ├── requestUtils.js             --> Utilities for request  
│   ├── responseUtils.js            --> Utilities for response  
│   └── users.js                    --> Utilities for request  
├── package.json                    --> Manage project's dependencies, scripts, version  
└── README.md                       --> Documentation (This file)

```


## The architecture 

1. **MVC**    
    The web application is built based on a pattern in software design called MVC (short for Model-View-Controller) to implement UI, data and controlling logic. The idea of MVC is to make the implementation and concern of logic and display separate from each other, and thus help divide the work between developers more easily, increase the productivity of coding process and make maintenance more easily.  
    In particular, all users’ interaction, UI, displaying information are handled in View (implementation is in ./public/). Controller is like the brain of the web app since it controls the logic of the application: users’ interaction with the model and how the web application should display the information to the users (implementation is in ./controllers/). The last piece is the Model. This is where data is stored and retrieves from the database, and more importantly, it doesn’t know anything about the front-end (implementation is in ./models/).

2. **REST**  
    The application is also designed based on another architectural style called REST (REpresentational State Transfer) in which the server provides access to resources depending on users’ role (customer vs admin) through URIs and the client can access these resources by making a request and the web will make a RESTful API call to fetch resources to render the page.

3. **Data Models**  
- User:
    - Model: User
    - Attributes: id, name, emaill, password, role
    - Description: Store available users' and new registered users' information
    - Connection to other models: Attribute _id_ of this model is used in **Order** model as _customerId_
- Product:
    - Model: Product
    - Attribute: id, name, description, price, image
    - Description: Store available products (and its information) customers can buy
    - Connection to other models: Attribute _id_ of this model is used in **Order** model as _productId_
- Order:
    - Model: Order
    - Attribute: customerId, items ((productId, name, description, price), quantity)
    - Description: Store purchased items' information of users.  
    - Connection to other models: _customerId_ and _productId_ are ids from **User** and **Product** models respectively.  
      
To put it simply, **User** buys **Product(s)** and view his/her **Order**. 

4. **UML diagram**  
- MVC architecture

![Screenshot_2021-05-07_211331](/uploads/e287ba47ea63688e55cc1c01f3b8e341/Screenshot_2021-05-07_211331.png)

- Sequence diagram

![image](/uploads/a60d7b34cf378f97f721b1b2ae8134b8/image.png)


## Testing

Tests created by course's personnel covers mostly everything, and here are some of the issues and theirs corresponding Mocha test files. The full list/board of issues can be found [here](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues)

| Id | Issues | Tests |
| ------ | ------ | ------ |
| 1 | [Viewing a single user: GET /api/users/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/15) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 2 | [Updating users: PUT /api/users/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/16) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 3 | [Deleting users: DELETE /api/users/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/17) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 4 | [Viewing a single product: GET /api/products/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/18) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 5 | [Updating products: PUT /api/products/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/19) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 6 | [Deleting products: DELETE /api/products/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/20) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 7 | [Create a new product: POST /api/products](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/21) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 8 | [Updating products: PUT /api/products/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/22) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 9 | [Viewing a single order: GET /api/orders/{id}](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/23) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |
| 10 | [Create a new order: POST /api/orders](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/issues/24) | [routes.test.js](https://course-gitlab.tuni.fi/webdev1-spring-2021/group04/-/blob/master/test/routes.test.js) |


## Security concerns

### Injection Attack
- Cross-site Scripting (XSS): Attacker formats input in a way that JavaScript code gets executed when that page is shown to victims.  
For example, user input should not be trusted since it may contains code that can get executed. Hence, in my web application, user inputs like email, image's url are validated by matching validation patterns. 
- SQL injection attack: hijack control over the web application database

To mitigate the problem, server's response to the CORS requests include headers like Access-Control-Allow-Headers, Access-Control-Allow-Methods. Besides, requests body are stringified before they are made.

### Brute force attack  
Attackers can try so many passwords and hope that they can eventually "guessing" a right combination characters that matches the password and hence steal data from user. Hence, when storing user information, only password with at least 10 characters are allowed to use, and then it is hashed with [bcrypt](https://www.npmjs.com/package/bcrypt) which incorporates a salt to protect against rainbow table attacks ("guessing" a passowrd so that after being put into the hash function, it can results in the same hash with the stored hash password).
