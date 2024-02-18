const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const {token} = req.cookies

    if(!token) {
      res.status(403).json({data: "User needs to be signed in"})
    }
  
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "defaultsecrectkey")
    if(!decodedToken) {
      res.status(403).json({data: "User needs to be signed in"})
    } 
    req.id = decodedToken.id
    next()
   
}

module.exports = auth