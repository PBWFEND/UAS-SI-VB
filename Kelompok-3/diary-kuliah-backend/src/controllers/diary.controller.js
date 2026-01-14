const prisma = require('../utils/prisma')

exports.getAll = async (req, res) => {
  try {
    const diaries = await prisma.diary.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(diaries)
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil diary' })
  }
}

const { validationResult } = require('express-validator')
exports.create = async (req, res) => {
  const { title, content } = req.body

  if (!title || !content) {
    return res.status(400).json({
      message: 'Judul dan isi wajib diisi'
    })
  }

  try {
    const diary = await prisma.diary.create({
      data: {
        title,
        content,
        userId: req.user.id
      }
    })

    res.status(201).json(diary)
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat diary' })
  }
}

exports.update = async (req, res) => {
  const id = Number(req.params.id)
  const { title, content } = req.body

  const diary = await prisma.diary.findUnique({ where: { id } })

  if (!diary || diary.userId !== req.user.id) {
    return res.status(403).json({ message: 'Akses ditolak' })
  }

  const updated = await prisma.diary.update({
    where: { id },
    data: { title, content }
  })

  res.json(updated)
}

exports.delete = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const diary = await prisma.diary.findUnique({
      where: { id }
    })

    if (!diary || diary.userId !== req.user.id) {
      return res.status(403).json({
        message: 'Akses ditolak'
      })
    }

    await prisma.diary.delete({ where: { id } })

    res.json({ message: 'Diary dihapus' })
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus diary' })
  }
}
