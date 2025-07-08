const express = require('express')
const requestRouter = express.Router()

const {userAuth} = require('../middlewares/auth')

requestRouter.post('/sendconnectionrequest', userAuth, (req,res)=>{

  const userData = req.userData
  res.send(userData.firstName + 'sent connection request')
})

module.exports = requestRouter
