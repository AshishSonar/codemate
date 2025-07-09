const jwt = require('jsonwebtoken')
const User = require('../models/user')


const userAuth = async (req, res, next) => {
  try {
      const cookies = req.cookies;
             const {token} = cookies
            if(!token){
                return res.status(401).send("Please Login!")
            }
    
             const decodedMessage =await jwt.verify(token, 'Hi@297842TOKEN')

             const {_id} = decodedMessage

             const userData = await User.findById(_id)

        if(!userData){
            return res.status(401).send("User does not exist. Please Signup!")
        }

        req.userData = userData
    next();
  } catch (err) {
     res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
    userAuth
}
