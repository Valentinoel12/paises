const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'admin',
    password: 'admin123',
    database: 'paises_7A'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos paises_7A');
});

// READ (Listar todos)
app.get('/paises', (req, res) => {
    db.query('SELECT * FROM paises', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// CREATE (Crear un país)
app.post('/paises', (req, res) => {
    const { pais_descripcion } = req.body;
    db.query('INSERT INTO paises (pais_descripcion) VALUES (?)', [pais_descripcion], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: results.insertId, pais_descripcion });
    });
});

// UPDATE (Modificar país)
app.put('/paises/:id', (req, res) => {
    const { id } = req.params;
    const { pais_descripcion } = req.body;
    db.query('UPDATE paises SET pais_descripcion = ? WHERE pais_id = ?', [pais_descripcion, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'País actualizado correctamente' });
    });
});

// DELETE (Eliminar país)
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
