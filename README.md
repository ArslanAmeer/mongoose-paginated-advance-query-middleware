<p align="center" float="left">
     <img src="./js-mongoose-express-middleware.png" alt="mongoose-paginated-advance-query-middleware" width="380">
</p>

# Mongoose Paginated Advanced Query Middleware

This middleware for Express.js allows you to easily implement advanced querying, sorting, field selection, and pagination on your Mongoose models.

## Why Use It?

If you are building a REST API with Express.js and Mongoose, you'll often need to implement features such as querying, sorting, field selection, and pagination. Implementing these features manually for every route can be time-consuming and error-prone. This middleware abstracts away these complexities so you can implement these features with just a few lines of code.

## Installation

Before you can use the Mongoose Paginated Advanced Query Middleware, you need to install it. You can do this using npm:

```bash
npm install mongoose-paginated-advance-query-middleware
```

## Usage

After installation, you can require the middleware in your file:

```javascript
const advanceQueryResults = require('mongoose-paginated-advance-query-middleware');
```

You can then use it in your routes:

```javascript
app.get('/api/data', advanceQueryResults(Model), (req, res, next) => {
  res.status(200).json(res.advanceQueryResults);
});
```

Replace `Model` with the Mongoose model for which you want to get the advanced results.

The middleware function accepts two parameters: 

1. `model`: The Mongoose model to apply the advanced results on. This is a required parameter.

2. `populate`: An array of objects specifying the paths to populate. Each object should have a `path` property and an optional `select` property. This parameter is optional.

Here's an example of using the middleware with the `populate` parameter:

```javascript
app.get(
  '/api/data', 
  advanceQueryResults(Model, [{ path: 'field1', select: 'subfield1' }, { path: 'field2' }]), 
  (req, res, next) => {
    res.status(200).json(res.advanceQueryResults);
  }
);
```

Another example with complex or nested object `populate`:

```javascript
app.get(
  '/api/data', 
  advanceQueryResults(Model, [{ path: 'field1', select: 'subfield1', populate: { path: 'field1', select:'subfield1'} },
  { path: 'field2' }]),
  (req, res, next) => {
    res.status(200).json(res.advanceQueryResults);
  }
);
```

The middleware adds an `advanceQueryResults` object to the response (`res`) object. This object has the following properties:

- `success`: A boolean indicating whether the operation was successful.
- `count`: The number of documents returned.
- `pagination`: An object containing information about the next and previous pages (if they exist).
- `data`: An array containing the documents returned.

## Features

### Field Selection

By using the `select` query parameter, you can specify which fields you want to be returned in the data. For example:

```http
GET /api/users?select=name,email
```

### Sorting

You can sort the results using the `sort` query parameter. The value of this parameter should be the field you want to sort by. For example:

```http
GET /api/users?sort=name
```

To sort in descending order, prepend the field name with a `-`.

```http
GET /api/users?sort=-name
```

### Pagination

The middleware supports pagination through the `page` and `limit` query parameters. For example:

```http
GET /api/users?page=2&limit=10
```

### Filtering

The middleware supports several comparison operators for filtering: `gt` (greater than), `gte` (greater than or equal), `lt` (less than), `lte` (less than or equal), and `in` (in array). For example:

```http
GET /api/users?age[gt]=20
```

```http
GET /api/users?role[in]=admin,user
```

### Combination of Features

You can combine several features in a single request. For example:

```http
GET /api/users?role=admin&sort=-name&select=name,email&page=2&limit=10
```

## Dependencies

Mongoose Paginated Advanced Query Middleware depends on:

- Express.js: A web application framework for Node.js.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.

## License

This middleware is licensed under the ISC license.

## Author

This middleware was created by [Arslan Ameer](https://arslanameer.com).


## Contributing

Contributions are always welcome! Please feel free to open an issue or create a pull request if you have any improvements or feature requests on the [GitHub repository](https://github.com/ArslanAmeer/mongoose-paginated-advance-query-middleware).
