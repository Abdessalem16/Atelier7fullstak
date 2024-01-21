const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

// Middleware pour prendre en charge le corps des requêtes JSON
app.use(express.json());

// Route pour récupérer la liste des films
app.get("/list_movies", (req, res) => {
    fs.readFile(__dirname + '/' + 'movies.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});

// Route pour ajouter un nouveau film
app.post("/add_movie", (req, res) => {
    const newMovie = req.body;

    fs.readFile(__dirname + '/' + 'movies.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const movies = JSON.parse(data);
            movies.push(newMovie);

            fs.writeFile(__dirname + '/' + 'movies.json', JSON.stringify(movies), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to the file:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.status(201).send('Movie added successfully');
                }
            });
        }
    });
});

// Route pour éditer un film
app.put("/edit_movie/:id", (req, res) => {
    const movieId = parseInt(req.params.id);
    const updatedMovie = req.body;

    fs.readFile(__dirname + '/' + 'movies.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const movies = JSON.parse(data);
            const index = movies.findIndex(movie => movie.id === movieId);

            if (index !== -1) {
                movies[index] = { ...movies[index], ...updatedMovie };

                fs.writeFile(__dirname + '/' + 'movies.json', JSON.stringify(movies), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing to the file:', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send('Movie updated successfully');
                    }
                });
            } else {
                res.status(404).send('Movie not found');
            }
        }
    });
});

// Route pour supprimer un film
app.delete("/delete_movie/:id", (req, res) => {
    const movieId = parseInt(req.params.id);

    fs.readFile(__dirname + '/' + 'movies.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const movies = JSON.parse(data);
            const updatedMovies = movies.filter(movie => movie.id !== movieId);

            fs.writeFile(__dirname + '/' + 'movies.json', JSON.stringify(updatedMovies), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to the file:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send('Movie deleted successfully');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
