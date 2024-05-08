import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import chalk from "chalk";
import _ from "lodash";

const app = express();
const PORT = process.env.PORT || 3000;
let users = []; //Array para almacenar los usuarios

app.get("/randomuser", async (req, res) => {
    try {
        const response = await axios.get("https://randomuser.me/api/"); //Conecta con la API de randomuser
        const user = response.data.results[0]; //Obtiene un usuario
        const name = user.name.first; //Obtiene el nombre del usuario
        const lastname = user.name.last; //Obtiene el apellido del usuario
        const id = uuidv4().slice(0, 6); //Asigna un id aleatorio
        const date = moment().format('MMMM Do YYYY, h:mm:ss a'); //Obtiene la fecha y hora actual
        const gender = user.gender; //Obtiene el genero del usuario
        const newUser = { gender, name, lastname, id, date }; //Crea un objeto con los datos del usuario
        users.push(newUser); //Guarda el usuario en el array
        const [male, female] = _.partition(users, user => user.gender === 'male'); //Divide los usuarios por genero
        const mensaje = 
        `Mujeres:
            <ol>
            ${female.map(user => `<li>Nombre: ${user.name} - Apellido: ${user.lastname} - ID: ${user.id} - Timestamp: ${user.date}</li>`).join('')}
            </ol>
        Hombres:
            <ol>
            ${male.map(user => `<li>Nombre: ${user.name} - Apellido: ${user.lastname} - ID: ${user.id} - Timestamp: ${user.date}</li>`).join('')}
            </ol>` //Muestra los datos de los usuarios
        res.send(mensaje); //Envia el mensaje
        console.log(chalk.blue.bgWhite(mensaje)) //Muestra el mensaje en consola
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
})

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));