const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')

router.get('/profile', auth, (req, res) => {
  res.json(req.user)
})

module.exports = router
