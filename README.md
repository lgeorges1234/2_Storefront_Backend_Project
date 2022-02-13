# online storefront backend API

## Table of contents

* [General info](#general-info)
* [Dependencies](#dependencies)
* [User actions](#users-action)
* [API call](#api-call)
* [Available Scripts](#available-scripts)
---

## General info

|    API to access a products store database. |
| :------------- |

The database is composed of three tables  : Users,  Orders and Products.

|  Users |  Orders |  Products  |
| ------------- |-------------| -----|
|   firstName   |   product id      |   name        |
|   lastName    |   quantity        |   price       |
|   password    |   user id         |   category    |
|               |   status*         |               |

> status can be either: ACTIVE or COMPLETE


---

## Dependencies

Project is created with:
* bcrypt: ^5.0.1,
* body-parser: ^1.19.0,
* db-migrate: ^0.11.13,
* db-migrate-pg: ^1.2.2,
* dotenv: ^14.3.2,
* express: ^4.17.2,
* jsonwebtoken: ^8.5.1,
* pg: ^8.5.1,
* prettier: ^2.5.1,
* typescript: ^4.1.3
---

## User actions

A user can create an order and then add, remove, update, edit and delete products from this order.
It can also access dashboard queries such as :
- get the five most popular products,
- get all products by category,

An authenticated user can : 

- create and delete products from the database Products, 
- edit all existing users,
- create and delete users,
- get all current orders by user

A dashboard query allows him to get current orders by user

> A user is authenticated thanks to a jwt token. The token is obtained first when he is created and then when he goes through authentication process.
---


## API calls

#### Products

|  Actions |  Route |  Request  | Auth |
| ------------- |-------------| -----|-----|
|  Index :       | /products  | [GET]  |  -  |
|  Show :        | /products/:id | [GET]  |  -  |
|  Create :  | /products  | [POST]  |  required  |
|  Delete :  | /products/:id |  [DELETE]  |  required  |
|  Top 5 most popular products :  |  /five_most-wanted  | [GET]  |  -  |
|  Products by category | /products_by_category/:category  |  [GET]  |  -  |

### Example of API calls:

>[GET] `{current_IP}/products/5`                -    show the fith product of the database

>[POST] `{current_IP}/products`                 -    attach to the body's request the new product data and the jwt token to create a new product 

>[GET] `{current_IP}/products_by_category/car`  -    list all products of the 'car' category

#### Users

|  Actions |  Route |  Request  | Auth |
| ------------- |-------------| -----|-----|
|  Index :       | /users  | [GET]  |  required  |
|  Show :        | /users/:id | [GET]  |  required  |
|  Create :  | /users  | [POST]  |  required  |
|  Delete :  | /users/:id |  [DELETE]  |  required  |
|  Authenticate  |  /users/authenticate  |  [POST]  |  -  |

>[DELETE] `{current_IP}/users/5`                -    delete the fith user of the database. A jwt token must be set in the header

>[POST] `{current_IP}/users`                    -    attach to the body's request new user's data to create a new user and receive a jwt token

>[POST] `{current_IP}/users/authenticate`       -    attach to the body's request user's data to authenticate and receive a jwt token 


#### Orders

|  Actions |  Route |  Request  | Auth |
| ------------- |-------------| -----|-----|
|  Index :       | /orders  | [GET]  |  -  |
| Show :        | /orders/:id | [GET]  |  -  |
|  Create :  | /orders  | [POST]  |  required  |
|  Delete :  | /orders/:id |  [DELETE]  |  required  |
|  Current Order by user : | /current_orders_per_user/5  | [GET]  |  required  |
|  Index all orders and associated products :  |  /orders/products  |  [GET]  |  -  |
|  Edit products from an order :   |  /orders/:id/products  |  [GET]  |  -  |
|  Add product to an order : |  /orders/:id/products  |  [POST]  |  -  |
|  Update quantity to an order "  |  /orders/:id/products/:product_id  |  [PATCH]  |  -  |
|  Remove product  from an order : |  /orders/:id/products/:product_id  |  [DELETE]  |  -  |


### Example of API calls:

>[POST] `{current_IP}/orders`                                 -    attach to the body's request a new order's data to create a new order

>[GET] `{current_IP}/current_orders_per_user`                 -    get all current orders for user 5. A jwt token must be set in the header

>[PATCH] `{current_IP}/orders/4/products/2`                   -    attach to the body's request the product 2 in the order 4 with the updated quantity


## Available Scripts

#### Run server
`npm run start`

#### Run and update the server when files change
`npm run watch`

#### Build application
`npm run build`

#### Build with TypeScript and run all Tests
`npm run test`

#### Run jasmine tests
`npm run jasmine --silent`

#### Run eslint
`npm run eslint`

`npm run eslint:fix  to apply fixes`

#### Run prettier
`npm run prettier`

`npm run prettier:fix  to apply fixes`
```





