const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Panggil rute auth

dotenv.config();
const app = express();
app.use(express.json());

// Gunakan rute auth
app.use('/api/auth', authRoutes);
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Server UAS Aktif!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server aktif di http://localhost:${PORT}`);
});