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
let zonaPpal= "";
let btnconfirmar = "";

pantalla = document.body.id;

async function iniciarPagina() {
    try {

        if (localStorage.getItem("primerIngreso") === "false" || !localStorage.getItem("primerIngreso")) {

            productos = await cargarProductos();
            localStorage.setItem("productos",JSON.stringify(productos));
            localStorage.setItem("carrito",JSON.stringify([]));s
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
            zonaForm.addEventListener('submit', validarCheckOut);
            //zonaPpal.addEventListener("click", checkout);
            break;

        case "pass":

            zonaPass = document.getElementById("loginForm");
            zonaPass.addEventListener("submit", login);
            break;
    }
}

iniciarPagina();
