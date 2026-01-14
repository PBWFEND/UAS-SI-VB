const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const diaryController = require('../controllers/diary.controller')
const { body } = require('express-validator')

router.use(auth)

router.get('/', diaryController.getAll)
router.delete('/:id', diaryController.delete)
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Mata Kuliah wajib diisi'),
    body('content').notEmpty().withMessage('Isi Catatan wajib diisi')
  ],
  diaryController.create
)

router.put(
  '/:id',
  [
    body('title').notEmpty(),
    body('content').notEmpty()
  ],
  diaryController.update
)


module.exports = router
