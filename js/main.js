
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



function iniciarPantalla() {

    

    switch (pantalla) {

        case "ppal":
            setTimeout(() => {alertaDescuentos();}, 2000);
            contenedorCarrito =document.getElementById("contenedor-carrito");
            contenedorStock = document.getElementById("contenedor-stock");
            generaPantalla("cardStock",contenedorStock,productos);
            generaPantalla("carrito",contenedorCarrito,carrito);
            contenedorStock.addEventListener("click",sumarCarrito);
            contenedorCarrito.addEventListener("click",e => sumarArticulo(e, pantalla));
            contenedorCarrito.addEventListener("click",e => restarArticulo(e, pantalla));
            contenedorCarrito.addEventListener("click",e => eliminarProductoCarrito(e, pantalla));
            break;

        case "admin":

            btnAgregar = document.getElementById("btn-agregar");
            contenedorStock = document.getElementById("contenedor-stock");
            contenedorAdminProd = document.getElementById("adminProd");

            generaPantalla("cardStock",contenedorStock,productos);
            contenedorStock.addEventListener("click", e => eliminarArticulo(e, productos));
            contenedorStock.addEventListener("click", actualizarArticulo);
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
            zonaPpal.addEventListener("click", volverHome);
            break;

        case "pass":
            zonaPass = document.getElementById("loginForm");
            zonaPass.addEventListener("submit", login);
            break;
    }
}

iniciarPagina();
