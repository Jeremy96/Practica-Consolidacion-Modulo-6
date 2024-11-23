// Framework que maneja las peticiones HTTP
import express, { json } from 'express';
// Módulo que maneja el sistema de archivos.
import { existsSync, writeFileSync, readFileSync } from 'fs';
// Aqui se instancia de Express.
const app = express()
// Puerto del servidor
const PORT = 3000
// Ruta del archivo JSON
const path = './anime.json'
app.use(json()); 

// Función para leer el archivo JSON y retornarlo como un objeto
const cargarAnime = () =>{
    if(!existsSync(path)){
        writeFileSync(path, JSON.stringify([]))
    }
    const data = readFileSync(path, "utf-8")
    return JSON.parse(data)
}

// Función para escribir datos en el archivo JSON
const escribirAnime  = (data) =>{
    writeFileSync(path, JSON.stringify(data, null, 2))
}

// Ruta POST para crear nuevos animes con datos como nombre, género, año y autor.
app.post("/animes", (req, res) => {
    const animes = cargarAnime();
    const identificador = String(Math.max(...Object.keys(animes).map(Number)) + 1 || 1);
    const nuevoAnime = { ...req.body };
    animes[identificador] = nuevoAnime;
    escribirAnime(animes);
    res.status(201).json({ id: identificador, ...nuevoAnime });
});

// Ruta GET para obtener todos los animes.
app.get("/animes",(req, res)=>{
    const animes = cargarAnime()
    res.send(animes)
})

// Ruta GET para obtener un anime especifico por su ID
app.get("/animes/:id", (req, res) => {
    const animes = cargarAnime();
    const anime = animes[req.params.id];
    if (!anime) return res.status(404).json({ error: "Anime no encontrado" });
    res.json({ id: req.params.id, ...anime });
});

// Ruta GET para obtener un anime especifico por su nombre
app.get("/animes/nombre/:nombre", (req, res) => {
    const animes = cargarAnime();
    const anime = Object.entries(animes).find(([, data]) => data.nombre.toLowerCase() === req.params.nombre.toLowerCase());
    if (!anime) return res.status(404).json({ error: "Anime no encontrado" });
    res.json({ id: anime[0], ...anime[1] });
});

// Ruta PUT para actualizar un anime por su ID
app.put("/animes/:id", (req, res) => {
    const animes = cargarAnime();
    if (!animes[req.params.id]) return res.status(404).json({ error: "Anime no encontrado" });
    animes[req.params.id] = { ...animes[req.params.id], ...req.body };
    escribirAnime(animes);
    res.json({ id: req.params.id, ...animes[req.params.id] });
  });

// Ruta DELETE para eliminar un anime por su ID
app.delete("/animes/:id", (req, res) => {
    const animes = cargarAnime();
    if (!animes[req.params.id]) return res.status(404).json({ error: "Anime no encontrado" });
    const animeEliminado = { id: req.params.id, ...animes[req.params.id] };
    delete animes[req.params.id];
    escribirAnime(animes);
    res.json(animeEliminado);

});

// Mensaje del servidor funcionando en la consola
app.listen(PORT, () => {
    console.log(`Servidor de API Anime corriendo en puerto ${PORT}`)
})

export {app};