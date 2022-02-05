# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index : GET   '/products'
- Show : GET    '/products/{:id}'
- Create [token required] :     POST '/products'
- [OPTIONAL] Top 5 most popular products :  GET '/five_most-wanted'
- [OPTIONAL] Products by category (args: product category)  GET '/products_by_category'

#### Users
- Index [token required]    GET '/users'
- Show [token required]     GET '/users/{:id}
- Create N[token required]  POST '/users

#### Orders
- Current Order by user (args: user id)[token required] GET '/current_orders_per_user'
- [OPTIONAL] Completed Orders by user (args: user id)[token required]   GET '/completed_order_per_user'

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

net stop postgresql-x64-13


yarn add jasmine-spec-reporter@7.0.0
