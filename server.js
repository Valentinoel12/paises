const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a la base de datos MySQL local
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'paises_7A'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos paises_7A');
});

// 1. READ: Obtener todos los países
app.get('/paises', (req, res) => {
    db.query('SELECT * FROM paises', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREATE: Agregar un nuevo país
app.post('/paises', (req, res) => {
    const { pais_descripcion } = req.body;
    db.query('INSERT INTO paises (pais_descripcion) VALUES (?)', [pais_descripcion], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: results.insertId, pais_descripcion });
    });
});

// 3. UPDATE: Actualizar un país por ID
app.put('/paises/:id', (req, res) => {
    const { id } = req.params;
    const { pais_descripcion } = req.body;
    db.query('UPDATE paises SET pais_descripcion = ? WHERE pais_id = ?', [pais_descripcion, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'País actualizado correctamente' });
    });
});

// 4. DELETE: Eliminar un país por ID
app.delete('/paises/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM paises WHERE pais_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'País eliminado correctamente' });
    });
});

app.listen(3000, () => {
    console.log('Servidor CRUD corriendo en http://localhost:3000');
});
