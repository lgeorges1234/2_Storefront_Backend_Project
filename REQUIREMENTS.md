# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index :                   'products/' [GET]
- Show :                    '/products/:id' [GET]
- Create [token required] : '/products' [POST]
- Delete [token required] : '/products/:id' [DELETE]
- [OPTIONAL] Top 5 most popular products : 
                            '/five_most-wanted' [GET]
- [OPTIONAL] Products by category (args: product category): 
                            '/products_by_category/:id' [GET]

#### Users
- Index [token required]    '/users' [GET]
- Show [token required]     '/users/:id' [GET]
- Create [token required]   '/users' [POST]
- Delete [token required]   '/users/:id' [DELETE]
- Authenticate              '/users/authenticate' [POST]

#### Orders
- Index [token required]    '/orders' [GET]
- Show [token required]     '/orders/:id' [GET]
- Create [token required]   '/orders' [POST]
- Delete [token required]   '/orders/:id' [DELETE]
- Current Order by user (args: user id)[token required] 
                            '/current_orders_per_user' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]                   '/completed_order_per_user' [GET]
// order_products
- IndexProduct              '/orders/products' [GET]
- EditProduct               '/orders/:id/products' [GET]
- AddProduct                '/orders/:id/products' [POST]
- UpdateProduct                '/orders/:id/products/:product_id [PATCH]
- RemoveProduct             '/orders/:id/products/:product_id' [DELETE]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL,
    category VARCHAR(100)
);

export type Product = {
    id?: Number,
    name: String,
    price: Number,
    category?: String
}

#### User
- id
- firstName
- lastName
- password

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    password_digest VARCHAR NOT NULL
);

export type Order = {
    id?: Number,
    firstname: String,
    lastname: String,
    password: Number
}

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15) NOT NULL,
    user_id bigint REFERENCES users(id)
);

export type Order = {
    id?: Number,
    status: String,
}

CREATE TABLE order_products(
    id SERIAL PRIMARY KEY,
    quantity integer NOT NULL,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);

export type OrderProducts = {
  id?: number;
  quantity: number;
  order_id: string;
  product_id: string;
};

