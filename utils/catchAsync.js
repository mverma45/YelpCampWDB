module.exports = (func) => {
	return (req, res, next) => {
		func(req, res, next).catch(next);
	};
};
// func is what is passed in, return returns a new function that has func executed and functions that catches the errors and passes them to next.
