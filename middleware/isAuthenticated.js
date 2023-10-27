const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Authorization required" })
    }
    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        req.tokenInfo = _id;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ error: "Unauthorized request" });  
    };
};

module.exports = { isAuthenticated };