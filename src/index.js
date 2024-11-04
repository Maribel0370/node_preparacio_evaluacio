// Carga de los módulos
const express = require('express')
const app = express()

// para gestionar las rutas de nuestras carpetas donde estaran los recursos estaticos
const path = require('node:path')


// Obtener el núemro del puerto
process.loadEnvFile()
const PORT = process.env.PORT
console.log(PORT);

// Cargar los datos
const datos = require('../data/customers.json')
const { CompressionStream } = require('stream/web')
//console.log(datos);

// Ordenar por apellido del cliente (descendente A-Z)
datos.sort((a, b) => a.surname.localeCompare(b.surname, "es-Es"))
// console.log(datos);


// para utulizar la ruta estatica
app.use(express.static(path.join(__dirname, "../public")))

// Ruta HOME = raiz o inicial
app.get("/" , (req, res) => {
    //console.log("Estamos en /");
    res.sendFile(__dirname + "/index.html")

})

// Ruta API Global
app.get("/api", (req, res) => {
    res.json(datos)
})

// Ruta para filtrar los clinetes por el apellido
app.get("/api/apellido/:cliente_apellido", (req, res) => {
    const apellido = req.params.cliente_apellido.toLocaleLowerCase()
    //console.log(apellido);
    const filroClientes = datos.filter(cliente => cliente.surname.toLocaleLowerCase() == apellido)
    // console.log(filroClientes);
    if(filtroClientes.length == 0) {
        return res.status(404).send("Cliente no encontrado")
     
    }
    res.json(filroClientes)
    
})

// Ruta para filtrar por nombre y apellido: api/nombre_apellido/John/Bezzos
 app.get("/api/nombre_apellido/:cliente_nombre/:cliente_apellido", (req, res) => {
    const nombre = req.params.cliente_nombre.toLocaleLowerCase()
    const apellido = req.params.cliente_apellido.toLocaleLowerCase()
    // console.log(nombre, apellido);
    const filroClientes = datos.filter(cliente => cliente.name.toLocaleLowerCase() == nombre && cliente.surname.toLocaleLowerCase() == apellido)
    // console.log(filroClientes);
    if(filroClientes.length == 0) {
        return res.status(404).send("Cliente no encontrado")
     
    }
    res.json(filroClientes)
    
})

// Ruta para filtrar por nombre y por las primeras letras del apellido
// api/nombre/barbara?apellido=Jo
 app.get("/api/nombre/:nombre", (req, res) => {
    const nombre = req.params.nombre.toLocaleLowerCase()
    const apelllido = req.query.apellido
    // Si no se incluye el apellido vadrá undefined
    // mostraremos un filtro solo por el nombre
    if(apellido == undefined){
        // Si no tenemos el apellido filtrar solo por el nombre
        const filtroClientes = datos.filter(cliente => cliente.name.toLocaleLowerCase() == nombre)
        return res.json(filtroClientes)

        // Nos aseguramos que el array con los clientes no esté vacio
        if(filtroClientes.length ==0) {
            return res.status(404).send("Cliente no encontrado")
        }
        // Devolver el filtro solo por el nombre del cliente
        return res.json(filtroClientes)

    }
    // console.log(nombre, apellido);

    // Para saber cuantas letras tiene el apellido escrito por el usuario
    
    const letras = (apellido.length)

    const filtroClientes = datos.filter(cliente => cliente.surname.slice(0, letras).toLocaleLowerCase() == apellido && cliente.name.toLocaleLowerCase() == nombre)
    
// Si no se encuentra coincidencias, mostrar un mensaje
    if(filtroClientes.length == 0) {
        return res.status(404).send("Cliente no encontrado")
    }
// Devolver los datos filtrados
    res.json(filtroClientes)
 
})

// Filtrar por la marca : qué productos se han comprado de nuna marca en concreto
// api/marca/:marca
app.get("/api/marca/:marca", (req, res) => {
    const marca = req.params.marca.toLowerCase()
    // console.log(marca);
    const filtroMarca = datos.flatMap(cliente => cliente.compras.filter(compra => compra.marca.toLowerCase() == marca))
    // console.log(filtroProductos);
    if(filtroMarca.length == 0) {
        return res.status(404).send(`No se ha realizado ninguna compra de ${marca}`)
     
    }
    res.json(filtroMarca)


})



// Cargar la página 404
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "../public/404.html")))



// Poner el puerto en escucha
app.listen(PORT, () => console.log(`Server runnig on http://localhost:${PORT}`))




