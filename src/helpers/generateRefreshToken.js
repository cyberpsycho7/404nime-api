const jwt = require("jsonwebtoken")

const generateRefreshToken = (id, login, roles) => {
    const payload = {
        id,
        login,
        roles
    }

    console.log(process.env.JWT_REFRESH_SECRET);
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"})
}

module.exports = generateRefreshToken