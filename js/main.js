/*if (localStorage.getItem("primerIngreso") === "false" || !(localStorage.getItem("primerIngreso")) ){
    const productosIniciales= [
        {
            id: 0,
            nombre: "monitor",
            cantStock: 50,
            precio: 300
        },
        {
            id: 1,
            nombre: "teclado",
            cantStock: 50,
            precio:10
        },
        {
            id: 2,
            nombre: "impresora",
            cantStock: 55,
            precio:150
        },
        {
            id: 3,
            nombre: "mouse",
            cantStock: 50,
            precio:50 
        },
        {
            id: 4,
            nombre: "auriculares",
            cantStock: 50,
            precio:350
        }
    ];
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
    localStorage.setItem("carrito", JSON.stringify([]));
    localStorage.setItem("ventas", JSON.stringify([]));
    localStorage.setItem("primerIngreso", "true");
}

const productos = JSON.parse(localStorage.getItem("productos"));
const carrito = JSON.parse(localStorage.getItem("carrito"));
const ventas = JSON.parse(localStorage.getItem("ventas"));
const pantalla = document.body.id;

let contenedorCarrito = "";
let contenedorStock = "";   
let btnAgregar= "";
let zonaForm = "";
let zonaPass = "";
let zonaPpal= "";

setTimeout(() => {
    informarDescuentos();
}, 2000);


switch (pantalla){
    case "ppal":
        contenedorCarrito = document.getElementById("contenedor-carrito")
        contenedorStock = document.getElementById("contenedor-stock") 
        generaPantalla ("cardStock", contenedorStock, productos);
        generaPantalla ("carrito", contenedorCarrito, carrito);
        contenedorStock.addEventListener('click', sumarCarrito);
        contenedorCarrito.addEventListener('click',(e) => sumarArticulo(e, pantalla));
        contenedorCarrito.addEventListener('click',(e) => restarArticulo(e, pantalla));
        contenedorCarrito.addEventListener('click',(e) => eliminarProductoCarrito(e, pantalla));
        contenedorCarrito.addEventListener('click',(e) => checkout(e, pantalla)); 
    break;
    case "admin":
        btnAgregar = document.getElementById("btn-agregar");
        contenedorStock = document.getElementById("contenedor-stock")
        contenedorAdminProd = document.getElementById("adminProd")
        generaPantalla ("cardStock", contenedorStock, productos);  
        contenedorStock.addEventListener('click', (e) => {
            eliminarArticulo(e, productos);
        });
        contenedorStock.addEventListener('click', ActualizarArticulo);
        btnAgregar.addEventListener('click', (e) => {
            cargarActiculo(e, productos,contenedorStock);
        });
        resumenVentas(ventas);
    break;
    case "checkout":
        contenedorCarrito = document.getElementById("contenedor-carrito")
        zonaForm = document.getElementById("zona-form")
        zonaPpal= document.getElementById("ppal-checkout");
        generaPantalla ("carrito", contenedorCarrito, carrito);     
        contenedorCarrito.addEventListener('click',(e) => sumarArticulo(e, pantalla));
        contenedorCarrito.addEventListener('click',(e) => restarArticulo(e, pantalla));
        contenedorCarrito.addEventListener('click',(e) => eliminarProductoCarrito(e, pantalla));
        zonaForm.addEventListener('click', checkout);
        zonaPpal.addEventListener('click', checkout);
    break;  
    case "pass":
        zonaPass = document.getElementById("loginForm")
        zonaPass.addEventListener('submit', login);
    break;
}
*/
//


async function cargarProductos() {
    try {
        const respuesta = await fetch("../files/productos.json");

        if (!respuesta.ok) {
            throw new Error(`Error en la fetch: ${respuesta.status}`);
        }

        return await respuesta.json();
    }
    catch (error) {
        console.error(
            "hubo un problema al consultar productos",
            error.message
        );
    }
}

let productos = [];
let carrito = [];
let ventas = [];

let contenedorCarrito = "";
let contenedorStock = "";
let btnAgregar = "";
let zonaForm = "";
let zonaPass = "";
let zonaPpal = "";

const pantalla = document.body.id;

async function iniciarPagina() {
    try {

        if (localStorage.getItem("primerIngreso") === "false" || !localStorage.getItem("primerIngreso")) {

            productos = await cargarProductos();
            localStorage.setItem("productos",JSON.stringify(productos));
            localStorage.setItem("carrito",JSON.stringify([]));
            localStorage.setItem("ventas",JSON.stringify([]));
            localStorage.setItem("primerIngreso","true");
        }

        productos = JSON.parse(localStorage.getItem("productos"));
        carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        ventas = JSON.parse(localStorage.getItem("ventas")) || [];
        iniciarPantalla();

    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

function iniciarPantalla() {

    setTimeout(() => {informarDescuentos();}, 2000);

    switch (pantalla) {

        case "ppal":

            contenedorCarrito =document.getElementById("contenedor-carrito");
            contenedorStock = document.getElementById("contenedor-stock");
            generaPantalla("cardStock",contenedorStock,productos);

            generaPantalla("carrito",contenedorCarrito,carrito);
            contenedorStock.addEventListener("click",sumarCarrito);
            contenedorCarrito.addEventListener("click",e => sumarArticulo(e, pantalla));
            contenedorCarrito.addEventListener("click",e => restarArticulo(e, pantalla));
            contenedorCarrito.addEventListener("click",e => eliminarProductoCarrito(e, pantalla));
            contenedorCarrito.addEventListener("click",e => checkout(e, pantalla));
            break;

        case "admin":

            btnAgregar = document.getElementById("btn-agregar");
            contenedorStock = document.getElementById("contenedor-stock");
            contenedorAdminProd = document.getElementById("adminProd");

            generaPantalla("cardStock",contenedorStock,productos);
            contenedorStock.addEventListener("click", e => eliminarArticulo(e, productos));
            contenedorStock.addEventListener("click", ActualizarArticulo);
            btnAgregar.addEventListener("click", e => cargarActiculo(e, productos, contenedorStock));
            resumenVentas(ventas);
            break;

        case "checkout":

            contenedorCarrito = document.getElementById("contenedor-carrito");
            zonaForm = document.getElementById("zona-form");
            zonaPpal = document.getElementById("ppal-checkout");

            generaPantalla("carrito",contenedorCarrito,carrito);
            contenedorCarrito.addEventListener("click", e => sumarArticulo(e, pantalla));
            contenedorCarrito.addEventListener("click", e => restarArticulo(e, pantalla));
            contenedorCarrito.addEventListener("click", e => eliminarProductoCarrito(e, pantalla));
            zonaForm.addEventListener("click", checkout);
            //zonaPpal.addEventListener("click", checkout);
            break;

        case "pass":

            zonaPass = document.getElementById("loginForm");
            zonaPass.addEventListener("submit", login);
            break;
    }
}

iniciarPagina();