import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided. Please login." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid or expired token. Please login again." });
    }
};
