import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    try {
        if (!token) {
            res.status(401).send({
                message: "Access Denied. No token provided."
            })
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({
            message: "Invalid token."
        })
    }
}