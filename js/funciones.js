
function guardarLocalStorage(clave, datos){
    localStorage.setItem(clave, JSON.stringify(datos));
}  

function buscarProd (productos, id) {
    return productos.find(producto => producto.id === parseInt(id))
}

function vender(carrito, producto, prodCarrito){
    /*  descontar de stock
        carrito: 1ra vta - genero carrito
                sgte vta - sumo 1 stoc de carrito */
        if (producto.cantStock > 0){
            producto.cantStock--;
            if (!(carrito.some(prod => prod.id === parseInt(prodCarrito.id)))) {
                    carrito.push(prodCarrito);
            }
            else{
                prodCarrito.cantStock++;    
            }
            Toastify({
                        text: `${producto.nombre} agregado al carrito`,
                        duration: 2000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "#198754"
                        }
                    }).showToast();
        }
        else{
            Toastify({
                        text: "Producto sin stock",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "#dc3545"
                        }
                    }).showToast();
            /*const modalElement = document.getElementById("sinStock");
            if (modalElement) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.show();
            }*/
        }
}

//resta un articulo del carrito
function restarArticulo(e, pantalla){
    if (obtieneTipoBoton(e.target.id) === "btn-menos") { 
        const resultado = buscarProd(productos, obtieneId(e.target.id))
        const resultadoCarrito = buscarProd(carrito, obtieneId(e.target.id))
        if (resultadoCarrito.cantStock > 1){
            resultadoCarrito.cantStock--;
            resultado.cantStock++;
        }
        else{
            carrito.splice(carrito.indexOf(resultadoCarrito),1)
            resultado.cantStock++;
        }
        generaPantalla("carrito", contenedorCarrito, carrito);
        if (pantalla === "ppal") {
            generaPantalla("cardStock",contenedorStock, productos);        
        }
        guardarLocalStorage("carrito", carrito);
        guardarLocalStorage("productos", productos);
    }   
}




//elimina articulo del carrito (del array y de la pantalla)
function eliminarProductoCarrito(e, pantalla){
    if (obtieneTipoBoton(e.target.id) === "btn-eliminarCarrito") {
        const resultado = buscarProd(productos, obtieneId(e.target.id))
        const resultadoCarrito = buscarProd(carrito, obtieneId(e.target.id))
        carrito.splice(carrito.indexOf(resultadoCarrito),1)
        resultado.cantStock = resultado.cantStock + resultadoCarrito.cantStock;
    }
    generaPantalla("carrito", contenedorCarrito, carrito);
    if (pantalla === "ppal") {
        generaPantalla("cardStock",contenedorStock, productos);
    }
    guardarLocalStorage("carrito", carrito);
    guardarLocalStorage("productos", productos);
}



//crea un nuevo articulo en el carrito, descuenta de producto
function sumarCarrito(e){
    if (obtieneTipoBoton(e.target.id) === "btn-carrito") {
        const resultado = buscarProd(productos, obtieneId(e.target.id))
        if (!(carrito.some(prod => prod.id === parseInt(resultado.id)))) {
            let articuloVendido = new Producto
            articuloVendido = {...resultado, cantStock: 1}
            vender( carrito, resultado, articuloVendido);
        }
        else{
            let articuloCarrito = buscarProd(carrito, resultado.id)
            vender(carrito, resultado, articuloCarrito);
        
        }    
        generaPantalla("carrito", contenedorCarrito, carrito);
        generaPantalla("cardStock",contenedorStock, productos);
        guardarLocalStorage("carrito", carrito);
        guardarLocalStorage("productos", productos);
    }   
}


//Crea dinamicamente la pantalla de prod en stock
// se incluye el id del producto en el id del boton "+", "-" y "eliminar" o "agregar"
function crearStockHTML(clase,  producto, pantalla) {
    let contenedor = document.createElement("div");
    let funcion = "";
    let elemntID = "";
    let btn_clase = "";
    let btn_MasyMenos = "";
    let btn_accion = "";
    let paramBoots ="";
    const {id, nombre, cantStock, precio} = producto;
    contenedor.className = `card ${clase}`;
    contenedor.id=`StockProd${producto.id}`;
    pantalla === "admin" ? elemntID = "btn-Elminar" : elemntID = "btn-carrito";
    pantalla === "admin" ? funcion = "Elminar" : funcion = "Agregar al carrito";
    pantalla === "admin" ? btn_clase = "btn-eliminar" : btn_clase = "btn-carrito";
    if (pantalla === "admin") {
        btn_MasyMenos = `
        <a class="btn btn-primary btn-mas" id="btn-mas-${parseInt(id)}">+</a>
        <a class="btn btn-primary btn-menos" id="btn-menos-${parseInt(id)}">-</a>`
        btn_accion = `
            <a class="btn btn-primary ${btn_clase} " id="${elemntID}-${parseInt(id)}"`
        paramBoots=`
            data-bs-toggle="modal" data-bs-target="#delProd"`;
    }
    btn_accion = `
            <a class="btn btn-primary ${btn_clase} " id="${elemntID}-${parseInt(id)}"
            ${paramBoots} >${funcion}</a>
        `;
    contenedor.innerHTML = 
        `<div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">Cant. Stock: ${cantStock}</p>
            <p class="card-text">precio: ${precio}</p>
            ${btn_MasyMenos}
            ${btn_accion}
        </div>`;              
    contenedorStock.appendChild(contenedor);
}

//creo el apartado de total de carrito
function totalCarrito(totalCarrito){
    let contenedor = document.createElement("div");
    contenedor.className="card total_carrito";
    contenedor.innerHTML=
       `<div class="card-body">
            <h6 class="card-title">Total Carrito</h6>
            <p class="card-text">precio: ${totalCarrito}</p>
       </div>`;
    contenedorCarrito.appendChild(contenedor);
}

//Crea dinamicamente la pantalla de carrito de compras
function crearCarritoHTML(clase, producto) {
    let contenedor = document.createElement("div");
    const {id, nombre, cantStock, precio} = producto;
    contenedor.className = `card ${clase}`;
    contenedor.id=`carrito${id}`;
    
    contenedor.innerHTML = 
    `<div class="card-body">
        <h6 class="card-title">${nombre}</h6>
        <p class="card-text">Cant: ${cantStock}</p>
        <p class="card-text">precio: ${precio}</p>
        <p class="card-text" hidden>${id}</p>
        <a class="btn btn-primary btn-mas"  id="btn-mas-${parseInt(id)}">+</a>
        <a class="btn btn-primary btn-menos"  id="btn-menos-${parseInt(id)}">-</a>
        <a class="btn btn-primary btn-eliminarCarrito" id="btn-eliminarCarrito-${parseInt(id)}">Quitar</a>
    </div>`;
    contenedorCarrito.appendChild(contenedor);
}


//Crea dinamicamente el boton de Finalizar compra
function generarCheckout (contenedor){

    let contenedorFooter = document.createElement("div");
    contenedorFooter.className = 'Checkout';
    contenedorFooter.id=`checkout`;
    contenedorFooter.innerHTML = 
    `<a class="btn btn-primary btn-Checkout" id="btn-checkout" href="./pages/checkout.html">Finalizar Comprar</a>`;
    contenedor.appendChild(contenedorFooter);
}


//genera las pantalla de stock o carrito segun parametros
function generaPantalla (clase,contenedor, productos){
    contenedor.innerHTML = ""
    switch (clase) {
        case "cardStock":
        productos.forEach(producto=>{
            crearStockHTML(clase, producto, pantalla)   
        })
        break;
        case "carrito":
            productos.forEach(producto=>{
            crearCarritoHTML(clase, producto)
            }
        )
        if (productos.length > 0 ){
            totalCarrito(carrito.reduce((acumulador, producto) => {
                    return acumulador + producto.precio * producto.cantStock;
                }, 0));
            pantalla === "ppal" ? generarCheckout(contenedor) : "";    
        }
        break;
    }
}

function validarsoloLetras(data){
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return soloLetras.test(data)
}

function validarletrasynumeros(data){
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\/-]+$/;
    return regex.test(data)
}

function validarEmail(data){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(data);
}


function validarCheckOut(e){
    e.preventDefault();
    const form = document.getElementById('contactoForm');
    const datos = new FormData(form);

    let validaOK = true;

    const nombre = document.getElementById("nombre");
    if(!validarsoloLetras(datos.get("nombre").trim())){
        nombre.classList.add("is-invalid")
        nombre.classList.remove("is-valid")
        validaOK = false;
    }
    else{
        nombre.classList.remove("is-invalid")
        nombre.classList.add("is-valid")
    };
    const apellido = document.getElementById("apellido");
    if(!validarsoloLetras(datos.get("apellido").trim())){
        apellido.classList.add("is-invalid")
        apellido.classList.remove("is-valid")
        validaOK = false;
    }
    else{
        apellido.classList.remove("is-invalid")
        apellido.classList.add("is-valid")
    };

    const direccion = document.getElementById("direccion");
    if(!validarletrasynumeros(datos.get("direccion"))){
        direccion.classList.add("is-invalid")
        direccion.classList.remove("is-valid")
        validaOK = false;
    }
    else{
        direccion.classList.remove("is-invalid")
        direccion.classList.add("is-valid")
    };
    const email = document.getElementById("email");
    if(!validarEmail(datos.get("email").trim())){
        email.classList.add("is-invalid")
        email.classList.remove("is-valid")
        validaOK=false;
    }
    else{
        email.classList.remove("is-invalid")
        email.classList.add("is-valid")
    };


    if (validaOK){
        checkout();
    }
    else{ 
        const modal = new bootstrap.Modal(document.getElementById("errorCampos"));
        modal.show();

    }

}

// dibuja la pantalla para ofrecer el resumen de la comprar 
function checkout(){
    //armar pantalla resumen
    // 1. datos de envio y metodo de pago 
    // 2. lista de productos
    // 3. total a pagado
    let nombre ="";
    let apellido = "";
    let direccion = ""; 
    let email= "";
    let mpago = "";
   
    const pantalla = document.getElementById("ppal-checkout"); 

        const form = document.getElementById('contactoForm');
        const datos = new FormData(form);
        
        nombre = datos.get("nombre")
        apellido = datos.get("apellido")
        direccion = datos.get("direccion")
        email = datos.get("email")
        mpago = datos.get("mpago")
        
        let prodHtml = ""
        carrito.forEach(prod => {
            prodHtml += `
            <div class="producto">
                <span>${prod.nombre} x ${prod.cantStock}</span>
                <span>$ ${prod.precio * prod.cantStock}</span>
            </div>`
        });
        let totalCarrito = carrito.reduce((acumulador, producto) => {
                    return acumulador + producto.precio * producto.cantStock;
                }, 0)

        pantalla.innerHTML= '';
        pantalla.innerHTML= 
        `<div class="checkout">
            <section class="checkout-datos">
                <h2>Datos de envío</h2>
                <div class="dato">
                    <strong>Nombre:</strong> ${nombre}
                </div>
                <div class="dato">
                    <strong>Apellido:</strong> ${apellido}
                </div>
                <div class="dato">
                    <strong>Email:</strong> ${email}
                </div>
                <div class="dato">
                    <strong>Dirección:</strong> ${direccion}
                </div>
                <h3>Método de pago</h3>
                <div class="dato">
                    ${mpago}
                </div>
            </section>
            <aside class="checkout-resumen">
                <h2>Resumen de compra</h2>
                ${prodHtml}
                <hr>
                <div class="totales total-final">
                    <span>Total</span>
                    <span> $ ${totalCarrito}</span>
                </div>  
                <button type="button" class="btn btn-primary btn-final" id="btn-confirm">
                    Confirmar compra
                </button>
            </aside>
        </div>
        `;  
       // zonaPpal.replaceWith(pantalla);        
        const btnConfirmar = document.getElementById("btn-confirm");
        btnConfirmar.addEventListener("click", () => {
            guardarVenta(carrito,datos,totalCarrito);
            Swal.fire({
                icon: "success",
                title: "Compra Confirmada",
                text: "Su Compra fue Realizada",
            }).then((result) => {
                    if (result.isConfirmed) {
                            btnConfirmar.id = "btn-volver"
                            btnConfirmar.textContent = "volver al inicio";
                    }
                        //window.location.href = "../index.html";
                    });
        });
    
}   


function volverHome(e){
    if (e.target.id === "btn-volver"){
        window.location.href = "../index.html";
    }    
}


function guardarVenta(carrito, datos, totalCarrito ){
    const venta = new Venta ;
    venta.id = venta.nextId();
    venta.fecha = new Date();
    venta.productos= []
    carrito.forEach(c => {
        venta.productos.push(c)
    });
    venta.Envio = { nombre: datos.get("nombre"),
                    apellido: datos.get("apellido"),
                    direccion: datos.get("direccion"),
                    email: datos.get("email")}
    venta.mpago = datos.get("mpago");
    venta.total = totalCarrito;
    ventas.push(venta);
    carrito.splice(0, carrito.length);
    guardarLocalStorage("carrito", carrito)
    guardarLocalStorage("ventas", ventas);
}

// alta de un nuevo producto en stock
function altaProducto(nombre, cantStock, precio){
    const producto = new Producto
    producto.id= producto.nextId()
    producto.nombre= nombre;
    producto.cantStock= parseInt(cantStock);
    producto.precio= parseInt(precio);
    productos.push(producto);
    guardarLocalStorage("productos", productos);
}

//aca va la funcion genere pantalla stock
//elimina articulo 
function bajaProducto(productos, prodId){
    const resultados = productos.filter(producto => producto.id != prodId)
    productos.splice(0, productos.length)
    resultados.forEach(resultado => {
        productos.push(resultado);
    }); 
}

function validarSoloNumeros(data){
    const regex = /^[0-9]+$/;
    return regex.test(data.trim());
}

//funcion para generar un nuevo articulo
function cargarActiculo(e, productos,contenedor){
    e.preventDefault();
    let articulo = "";
    let precio = "";
    let stock = "";
    const form = document.getElementById('AgregaProd');
    const datos = new FormData(form);
    articulo = datos.get("articulo")
    stock = datos.get("stock")
    precio = datos.get("precio")

    if( validarsoloLetras(articulo) &&
        validarSoloNumeros(stock)  &&
        validarSoloNumeros(precio)){

            altaProducto(articulo, stock, precio)
            generaPantalla("cardStock", contenedor, productos, pantalla);
            guardarLocalStorage("productos", productos);
    }
    else{
        const modal = new bootstrap.Modal(document.getElementById("errorCampos"));
        modal.show();
    }
} 



//funcion para eliminar  un articulo
function eliminarArticulo(e, productos){
    
    //const prod = e.target.closest(".cardStock");
    if (obtieneTipoBoton(e.target.id) === "btn-Elminar") {
        Swal.fire({
        title: "Seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!",
        cancelButtonText: "No"
        }).then((result) => {
                            if (result.isConfirmed) {
                                bajaProducto(productos,obtieneId(e.target.id))
                                bajaProducto(carrito, obtieneId(e.target.id))
                                
                                guardarLocalStorage("productos", productos);
                                guardarLocalStorage("carrito", carrito);
                                generaPantalla("cardStock", contenedorStock, productos, pantalla);
                                Swal.fire({
                                            title: "Borrado!",
                                            text: "Su producto ha sido borrado.",
                                            icon: "success"
                                        });
                            }
        });       
    }
    
};

//funcion para eliminar  un articulo
function eliminarArticuloxId(productos,id){
    bajaProducto(productos, id)
    bajaProducto(carrito, id)
    guardarLocalStorage("productos", productos);
    guardarLocalStorage("carrito", carrito);
    
};


function actualizarArticulo(e){
    if (obtieneTipoBoton(e.target.id) === "btn-mas"){
        const resultado = buscarProd(productos, obtieneId(e.target.id))
        resultado.cantStock++ 
        generaPantalla("cardStock",contenedorStock, productos);
    }
    if(obtieneTipoBoton(e.target.id) === "btn-menos"){    
        const resultado = buscarProd(productos, parseInt(obtieneId(e.target.id)))           
        if (resultado.cantStock > 1) {
            resultado.cantStock--;
            generaPantalla("cardStock",contenedorStock, productos);  
        }
        else    {
            Swal.fire({
            title: "Seguro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",  
            cancelButtonColor: "#d33",
            confirmButtonText: "Si!",
            cancelButtonText: "No"
            }).then((result) => {
                                if (result.isConfirmed) {
                                    eliminarArticuloxId(productos,resultado.id);
                                    generaPantalla("cardStock",contenedorStock, productos);        
                                    Swal.fire({
                                            title: "Borrado!",
                                            text: "Su producto ha sido borrado.",
                                            icon: "success"
                                            });
                                }
            });       
            
        }
    } 
    guardarLocalStorage("productos", productos);
}



//resta un articulo del carrito
function sumarArticulo(e, pantalla){
    if (obtieneTipoBoton(e.target.id) === "btn-mas") {
        const resultado = buscarProd(productos, obtieneId(e.target.id))
        const resultadoCarrito = buscarProd(carrito,obtieneId(e.target.id))
        vender(carrito, resultado, resultadoCarrito);
        generaPantalla("carrito", contenedorCarrito, carrito);
        if (pantalla === "ppal") {
            generaPantalla("cardStock",contenedorStock, productos);        
        }
        guardarLocalStorage("carrito", carrito);
        guardarLocalStorage("productos", productos);
    }   
}


function obtieneId (elementId){
    return (parseInt(elementId.split("-")[2]))
}
function obtieneTipoBoton (elementId){
    return elementId.replace(/-\d+$/, '');
}

function verificarUsuario(user, pass){
    const userOK= "Mbarroso"
    const passOK = "1234"
    if ((userOK === user) && (passOK === pass)){
        return true;
    }
    else{
        return false
    }
}
function login(e){
    e.preventDefault()
    const form = document.getElementById('loginForm');
    const datos = new FormData(form);
    user = datos.get("usuario")
    pass = datos.get("password")
    if (verificarUsuario(user, pass)) {
        window.location.href = "admin.html"
    }
    else{
        Swal.fire({
            icon: "error",
            title: "verifique Usuario y contraseña",
            text: "acceso denegado"
    });
    };
}

function detalleVentas(ventas){
    let detalle = document.getElementById("contenedor-ventas-lista");
    let htmlDetalle = "";
    let salida = "";
    let totalProd = 0;
    let medioDePago = "";
    try{
    htmlDetalle +=`
        <div class="ventas" id="ventas">
            <div id="detalle-ventas" class="detalle-ventas">
                
                <div class="tarjeta-resumen">
                    <h2>Detalle de ventas</h2>`;
        ventas.forEach(venta => {
        switch (venta.mpago) {
        case "credito":
            medioDePago = "Tarjeta de crédito";
            break;
        case "debito":
            medioDePago = "Tarjeta de débito";
            break;
        case "transferencia":
            medioDePago = "Transferencia bancaria";
            break;
        case "mercadopago":
            medioDePago = "Mercado Pago";
            break;
        }   
        htmlDetalle +=`
                <div class="tarjeta-resumen">    
                    <div class="grid-resumen">
                        <div class="item-resumen">
                            <span>Nro de Venta:</span>
                            <strong id="idVta">${venta.id}</strong>
                        </div>
                        <div class="item-resumen">
                            <span>Fecha:</span>
                            <strong id="fecha">${venta.fecha}</strong>
                        </div>
                    </div>
                    <hr>    
                    <h2>Datos del Envio</h2>
                    <div class="grid-resumen">
                        <div class="item-resumen">
                            <span>Comprador:</span>
                            <strong id="Comprador">${venta.Envio.nombre} ${venta.Envio.apellido}</strong>
                        </div>
                        <div class="item-resumen">
                            <span>Direccion:</span>
                            <strong id="fecha">${venta.Envio.direccion}</strong>
                        </div>
                        <div class="item-resumen">
                            <span>Email:</span>
                            <strong id="fecha">${venta.Envio.email}</strong>
                        </div>
                        <div class="item-resumen">
                            <span>Método de Pago:</span>
                            <strong id="fecha">${medioDePago}</strong>
                        </div>
                    </div>
                    <hr>
                    <div class="item-resumen productos">
                        <span>Productos</span>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Id Producto</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Precio Unitario</th>
                                </tr>
                            </thead>
                            <tbody>`;
        
        let i=0;
        venta.productos.forEach(prod => {
            i++;
            totalProd += parseInt(prod.cantStock)
            htmlDetalle +=`
                                <tr>
                                    <th scope="row">${i}</th>
                                    <td>${prod.id}</td>
                                    <td>${prod.nombre}</td>
                                    <td>${prod.cantStock}</td>
                                    <td>${prod.precio}</td>
                                </tr>
            `;
        });      
        htmlDetalle +=`<tbody class="table-group-divider">
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total Venta</td>
                                    <td>${parseFloat(venta.total)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>    
                </div>`;       
        
    });    
    salida = htmlDetalle;
    salida +=`
                </div>
            </div>
        </div>`;
    } catch (error) {
        salida = cargaPantallaError("Detalle de ventas", error);
    
    }finally{
        detalle.innerHTML= salida;
    }
}  

function cargaPantallaError(pantalla, error) {
    const errorHtml =  
        `<div class="Errorventas" id="Errorventas">
            <div id="detalle-ventas" class="detalle-ventas">
                <p>Se produjo un error en ${pantalla}. ${error}
                Por favor, intente nuevamente más tarde.</p>
            </div>
        </div>`;
    return errorHtml;
}

function resumenVentas(ventas){
    let totalVentas = 0;
    let totalProd = 0;
    try {
        ventas.forEach(venta => {
            totalVentas += parseFloat(venta.total);
            venta.productos.forEach(prod => {
                totalProd += parseInt(prod.cantStock)
            });
        });    

        if (ventas.length > 0){
        document.getElementById("resumen-total").textContent = `$ ${totalVentas}`;
        document.getElementById("resumen-cantidad").textContent = ventas.length;
        document.getElementById("resumen-ticket").textContent = `$ ${totalVentas / ventas.length || 0}`;
        document.getElementById("resumen-productos").textContent = totalProd;
        detalleVentas(ventas);
        }   
    }
    catch (error) {
        const errorContainer = document.getElementById("ventas"); 
        errorContainer.innerHTML = cargaPantallaError("Resumen de ventas", error);
    }
}


/*
function obtenerCotiDolar() {
    const url = 'https://dolarapi.com/v1/dolares/blue';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            Toastify({
                text: `La cotización del dólar blue es: Compra: ${data.compra} - Venta: ${data.venta}`,
                duration: 2000,
                gravity: "bottom",
                position: "left",
                style: { background: "#198754"}
                }).showToast();
                })
        .catch(error => {
            console.error('Error al obtener la cotización del dólar:', error);
        });
}

*/
function alertaDescuentos (){
    Toastify({
                text: `Aprobechas los descuentos que tenemos para ti`,
                duration: 2000,
                gravity: "top",
                position: "center",
                style: { background: "#198754"}
                }).showToast();
}


async function cargarProductos() {
    url = "./db/productos.json";
    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error en la fetch: ${respuesta.status}`);
        }

        return await respuesta.json();
    }
    catch (err) {
        console.error(
            "hubo un problema al consultar productos",
            err.message
        );
    }
}

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

    } catch (err) {
        console.error("Error al iniciar la aplicación:", err);
    }
}