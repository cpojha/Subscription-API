import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1});
        if(decision.isDenied) {
if(decision.reason.isRateLimit()){
            return res.status(429).send("Rate limit exceeded. Please try again later.");
        
}        }

if(decision.reason.isBot()){
    return res.status(403).send("Bots are not allowed.");
}
next();

    } catch (error) {
        console.error(`ARCJET error: ${error}`);
        next(error);
    }
    next();
}
export default arcjetMiddleware;