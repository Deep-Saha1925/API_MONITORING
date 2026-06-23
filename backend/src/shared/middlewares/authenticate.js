import ResponseFormat from "../utils/responseFormatter.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const authenticate = async (req, res, next) => {
    try {
        let token = null;

        if(req.cookies && req.cookies.authToken) {
            token = req.cookies.authToken;
        }

        if(!token) {
            return res.status(401).json(ResponseFormat.error("Authentication token is missing", 401));
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const {userId, email, username, role, clientId} = decoded;
        req.user = {userId, email, username, role, clientId};

        next();

    }catch (error) {
        logger.error("Authentication error", {
            error: error.message,
            path: req.path,
        });

        if(error.name === "TokenExpiredError") {
            return res.status(401).json(ResponseFormat.error("Authentication token has expired", 401));
        }

        return res.status(401).json(ResponseFormat.error("Invalid authentication token", 401));
    }
}

export default authenticate;