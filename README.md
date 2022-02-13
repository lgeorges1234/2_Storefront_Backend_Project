# online storefront API

## Table of contents

* [General info](#general-info)
* [Dependencies](#dependencies)
* [User actions](#users-action)
* [API call](#api-call)
* [Available Scripts](#available-scripts)
---

## General info

|    API to a product store database. |
| :------------- |

The database is composed of three tables  : Users,  Orders and Products.

### Users

- id
- firstName
- lastName
- password

### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

### Products

-  id
- name
- price
- category

---

## Dependencies

Project is created with:
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "db-migrate": "^0.11.13",
    "db-migrate-pg": "^1.2.2",
    "dotenv": "^14.3.2",
    "express": "^4.17.2",
    "jsonwebtoken": "^8.5.1",
    "pg": "^8.5.1",
    "prettier": "^2.5.1",
    "typescript": "^4.1.3"
---

## User actions

A user can create an order and then add, remove, update, edit and delete products from this order.
It can also access dashboard queries such as :
> get the five most popular products,
> get all products that composed a category,

A user is authenticated thanks to a jwt token. He obtains this token first when he is created and then when he goes through authentication process.
An authenticated user can : 
> create and delete products from the database Products, 
> edit all existing users,
> create and delete users,
> get all current orders by user
A dashboard query allows him to get current orders by user

---


## API calls

#### Products
> Index :                   'products/' [GET]
> Show :                    '/products/:id' [GET]
> Create [token required] : '/products' [POST]
> Delete [token required] : '/products/:id' [DELETE]
> Top 5 most popular products : 
                            '/five_most-wanted' [GET]
> Products by category (args: product category): 
                            '/products_by_category/:id' [GET]

#### Users
- Index [token required]    '/users' [GET]
- Show [token required]     '/users/:id' [GET]
- Create [token required]   '/users' [POST]
- Delete [token required]   '/users/:id' [DELETE]
- Authenticate              '/users/authenticate' [POST]

#### Orders
- Index                     '/orders' [GET]
- Show                      '/orders/:id' [GET]
- Create                    '/orders' [POST]
- Delete                       '/orders/:id' [DELETE]
- Current Order by user (args: user id)[token required] 
                            '/current_orders_per_user' [GET]
 order_products
- IndexProduct              '/orders/products' [GET]
- EditProduct               '/orders/:id/products' [GET]
- AddProduct                '/orders/:id/products' [POST]
- UpdateProduct                '/orders/:id/products/:product_id [PATCH]
- RemoveProduct             '/orders/:id/products/:product_id' [DELETE]


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





