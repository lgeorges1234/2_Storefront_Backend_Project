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
|   id          |   id              |   id          |
|   firstName   |   Product id      |   name        |
|   lastName    |   Quantity        |   price       |
|   password    |   User id         |   category    |
|               |   status*         |               |

* status can be either: ACTIVATE or COMPLETE


---

## Dependencies

Project is created with:
* "bcrypt": "^5.0.1",
* "body-parser": "^1.19.0",
* "db-migrate": "^0.11.13",
* "db-migrate-pg": "^1.2.2",
* "dotenv": "^14.3.2",
* "express": "^4.17.2",
* "jsonwebtoken": "^8.5.1",
* "pg": "^8.5.1",
* "prettier": "^2.5.1",
* "typescript": "^4.1.3"
---

## User actions

A user can create an order and then add, remove, update, edit and delete products from this order.
It can also access dashboard queries such as :
- get the five most popular products,
- get all products that composed a category,

> A user is authenticated thanks to a jwt token. He obtains this token first when he is created and then when he goes through authentication process.

An authenticated user can : 
- create and delete products from the database Products, 
- edit all existing users,
- create and delete users,
- get all current orders by user
A dashboard query allows him to get current orders by user

---


## API calls

#### Products

|  Actions |  Route |  Request  | Auth |
| ------------- |-------------| -----|-----|
|  Index :       | '/products'  | [GET]  |  -  |
| Show :        | '/products/:id' | [GET]  |  -  |
|  Create :  | '/products'  | [POST]  |  required  |
|  Delete :  | '/products/:id' |  [DELETE]  |  required  |
|  Top 5 most popular products :  |  '/five_most-wanted'  | [GET]  |  -  |
|  Products by category | '/products_by_category/:category' |  [GET]  |  -  |

#### Users

|  Actions |  Route |  Request  | Auth |
| ------------- |-------------| -----|-----|
|  Index :       | '/users'  | [GET]  |  required  |
|  Show :        | '/users/:id' | [GET]  |  required  |
|  Create :  | '/users'  | [POST]  |  required  |
|  Delete :  | '/users/:id' |  [DELETE]  |  required  |
|  Authenticate  |  '/users/authenticate'  |  [POST]  |  -  |

#### Orders

|  Actions |  Route |  Request  | Auth |
| ------------- |-------------| -----|-----|
|  Index :       | '/orders'  | [GET]  |  -  |
| Show :        | '/orders/:id' | [GET]  |  -  |
|  Create :  | '/orders'  | [POST]  |  required  |
|  Delete :  | '/orders/:id' |  [DELETE]  |  required  |
|  Current Order by user | '/current_orders_per_user'  | [GET]  |  required  |
|  IndexProduct  |  '/orders/products'  |  [GET]  |  -  |
|  EditProduct  |  '/orders/:id/products'  |  [GET]  |  -  |
|  AddProduct  |  '/orders/:id/products'  |  [POST]  |  -  |
|  UpdateProduct  |  '/orders/:id/products/:product_id  |  [PATCH]  |  -  |
|  RemoveProduct  |  '/orders/:id/products/:product_id  |  [DELETE]  |  -  |


### Example of API calls:

>`{current_IP}/api/image?filename=aFilename`

>`{current_IP}/api/image?filename=aFilename&width=350`

>`{current_IP}/api/image?filename=aFilename&width=350&height=250`


### Available Filenames :

* encenadaport
* fjord
* icelandwaterfall
* palmtunnel
* santamonica
---

## Available Scripts

#### Run server
`npm run start`

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





