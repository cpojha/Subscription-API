const errorMiddleware = (error, req, res, next) => {
    try {
        let err = {...error};
        err.message = error.message;
        console.log(err);
// Mongoose bad ObjectId
        if (error.name === 'CastError') {
            const message = `Resource not found. Invalid: ${error.path}`;
           err = new Error(message, 404);
        }
// mongoose duplicate key
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
            err = new Error(message, 400);
        }
// Mongoose validation error
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(value => value.message);
            err = new Error(message.join(','), 400);
        }

// mongoose connection err

        if (error.name === 'MongoNetworkError') {
            const message = 'MongoDB connection error';
            err = new Error(message, 500);
        }
        

        res.status(err.statusCode || 500).json({
            success: false,
            error: err.message || 'Server Error'
        });

        res.status(error.statuscode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;