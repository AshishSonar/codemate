const express = require('express')
const profileRouter = express.Router()

const {userAuth} = require('../middlewares/auth')
const {validateEditProfileData} = require('../utils/validation')

profileRouter.get("/profile/view",userAuth, async(req, res) => {
  try {
         const userData = req.userData
        res.send(userData)
  } catch (err) {
    res.status(400).send("ERROR:" +err.message  )
  }
});


profileRouter.patch('/profile/edit', userAuth,  async (req, res)=> {
    try{
        if(!validateEditProfileData) {
            throw new Error("Invalid Edit Request")
        }
        const loggedInUser = req.userData

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

        await loggedInUser.save()

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        })


    }catch(err){
    res.status(400).send("ERROR:" +err.message  )
    }
})

module.exports = profileRouter