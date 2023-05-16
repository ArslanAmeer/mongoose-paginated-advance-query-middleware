const ErrorResponse = require('./utils/errorResponse');

const advanceQueryResults = (model, populate) => async (req, res, next) => {
	const reqQuery = { ...req.query };

	if (nullCheck(reqQuery)) {
		return next(new ErrorResponse('One or more field is Empty, Null or Undefined', 405));
	}

	const removeFields = ['select', 'sort', 'page', 'limit'];
	removeFields.forEach((param) => delete reqQuery[param]);

	let queryStr = JSON.stringify(reqQuery);
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

	let query = model.find(JSON.parse(queryStr));

	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		if(Array.isArray(populate)) {
			populate.forEach(pop => {
				query = query.populate(pop);
			});
		} else {
			query = query.populate(populate);
		}
	}

	const results = await query;

	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	};

	next();
};

module.exports = advanceQueryResults;

function nullCheck(obj) {
	for (let key in obj) {
		if (obj[key] === null || obj[key] === '' || obj[key] === 'undefined') {
			return true;
		}
	}
	return false;
}
