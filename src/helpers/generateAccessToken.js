const jwt = require("jsonwebtoken")

const generateAccessToken = (id, login, roles) => {
    const payload = {
        id,
        login,
        roles
    }
    console.log(process.env.JWT_ACCESS_SECRET);
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "5m"})
}

module.exports = generateAccessToken