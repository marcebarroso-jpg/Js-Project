
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
        }
        else{
            const modalElement = document.getElementById("sinStock");
            if (modalElement) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.show();
            }
        }
}

//resta un articulo del carrito
function restarArticulo(e, pantalla){
    if (e.target.classList.contains("btn-menos")) {
        const resultado = buscarProd(productos, obtieneId(e.target.classList[3]))
        const resultadoCarrito = buscarProd(carrito, obtieneId(e.target.classList[3]))
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

//resta un articulo del carrito
function sumarArticulo(e, pantalla){
    if (e.target.classList.contains("btn-mas")) {
        const resultado = buscarProd(productos, obtieneId(e.target.classList[3]))
        const resultadoCarrito = buscarProd(carrito,obtieneId(e.target.classList[3]))
        vender(carrito, resultado, resultadoCarrito);
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
    if (e.target.classList.contains("btn-eliminarCarrito")) {
        const resultado = buscarProd(productos, obtieneId(e.target.classList[3]))
        const resultadoCarrito = buscarProd(carrito, obtieneId(e.target.classList[3]))
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
    if (e.target.classList.contains("btn-carrito")) {
        const resultado = buscarProd(productos, obtieneId(e.target.classList[3]))
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
function crearStockHTML(clase,  producto, pantalla) {
    let contenedor = document.createElement("div");
    let funcion = "";
    let btn_clase = "";
    let btn_MasyMenos = "";
    const {id, nombre, cantStock, precio} = producto;
    contenedor.className = `card ${clase}`;
    contenedor.id=`StockProd${producto.id}`;
    pantalla === "admin" ? funcion = "Elminar" : funcion = "Agregar al carrito";
    pantalla === "admin" ? btn_clase = "btn-eliminar" : btn_clase = "btn-carrito";
    if (pantalla === "admin") {
        btn_MasyMenos = `<a class="btn btn-primary btn-mas id-${parseInt(id)}"  id="btn-mas">+</a>
         <a class="btn btn-primary btn-menos id-${parseInt(id)}"  id="btn-menos">-</a>`
    }
    contenedor.innerHTML = 
        `<div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">Cant. Stock: ${cantStock}</p>
            <p class="card-text">precio: ${precio}</p>
            ${btn_MasyMenos}
            <a class="btn btn-primary ${btn_clase} id-${parseInt(id)}" id="btn-Carrito"
            data-bs-toggle="modal" data-bs-target="#delProd">${funcion}</a>
        </div>`             
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
        <a class="btn btn-primary btn-mas id-${parseInt(id)}"  id="btn-mas">+</a>
        <a class="btn btn-primary btn-menos id-${parseInt(id)}"  id="btn-menos">-</a>
        <a class="btn btn-primary btn-eliminarCarrito id-${parseInt(id)}" id="btn-menos">Quitar</a>
    </div>`;
    contenedorCarrito.appendChild(contenedor);
}


//Crea dinamicamente el boton de Finalizar compra
function generarCheckout (contenedor){

    let contenedorFooter = document.createElement("div");
    contenedorFooter.className = 'Checkout';
    contenedorFooter.id=`checkout`;
    contenedorFooter.innerHTML = 
    `<a class="btn btn-primary btn-Checkout" href="./pages/checkout.html">Finalizar Comprar</a>`;
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


// dibuja la pantalla para ofrecer el resumen de la comprar 
function checkout(e){
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
    if (e.target.classList.contains("btn-confirmar")) {

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
                <button type="button" class="btn btn-primary btn-final" data-bs-toggle="modal" data-bs-target="#modalCompra">
                    Confirmar compra
                </button>
            </aside>
        </div>
        <div class="modal fade" id="modalCompra" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">      
                    <div class="modal-header">
                        <h5 class="modal-title">Compra confirmada</h5>
                    </div>
                    <div class="modal-body">
                        Tu compra fue realizada exitosamente.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;  
       // zonaPpal.replaceWith(pantalla);

        const modal = document.getElementById("modalCompra");
        modal.addEventListener("hidden.bs.modal", () => {
            guardarVenta(carrito,datos,totalCarrito);
            
            window.location.href = "../index.html";
        });
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
    altaProducto(articulo, stock, precio)
    generaPantalla("cardStock", contenedor, productos, pantalla);
    guardarLocalStorage("productos", productos);
} 

//funcion para eliminar  un articulo
function eliminarArticulo(e, productos){
    const prod = e.target.closest(".cardStock");
    if (e.target.classList.contains("btn-eliminar")) {
        bajaProducto(productos,obtieneId(e.target.classList[3]))
        bajaProducto(carrito, obtieneId(e.target.classList[3]))
        prod.remove();
        guardarLocalStorage("productos", productos);
        guardarLocalStorage("carrito", carrito);
    }
    
};

//funcion para eliminar  un articulo
function eliminarArticuloxId(productos,id){
    bajaProducto(productos, id)
    bajaProducto(carrito, id)
    guardarLocalStorage("productos", productos);
    guardarLocalStorage("carrito", carrito);
    
};

//resta un articulo del stock
function ActualizarArticulo(e){
    const resultado = buscarProd(productos, obtieneId(e.target.classList[3]))    
    e.target.classList.contains("btn-mas")   && resultado.cantStock++ ;
    e.target.classList.contains("btn-menos") && resultado.cantStock--;
    if (resultado.cantStock <= 0) {
        eliminarArticuloxId(productos,resultado.id);
    } 
    
    
    generaPantalla("cardStock",contenedorStock, productos);        
    guardarLocalStorage("productos", productos);
}

//resta un articulo del carrito
function sumarArticulo(e, pantalla){
    if (e.target.classList.contains("btn-mas")) {
        const resultado = buscarProd(productos, obtieneId(e.target.classList[3]))
        const resultadoCarrito = buscarProd(carrito,obtieneId(e.target.classList[3]))
        vender(carrito, resultado, resultadoCarrito);
        generaPantalla("carrito", contenedorCarrito, carrito);
        if (pantalla === "ppal") {
            generaPantalla("cardStock",contenedorStock, productos);        
        }
        guardarLocalStorage("carrito", carrito);
        guardarLocalStorage("productos", productos);
    }   
}

function obtieneId (clase){
    return (parseInt(clase.split("-")[1]))
}

function verificarUsuario(user, pass){
    const userOK= "Mbarroso"
    const passOK = "1234"
    return (userOK === user) && (passOK === pass);
}
function login(e){
    e.preventDefault()
    let user = "";
    let pass = "";
    const form = document.getElementById('loginForm');
    const modal= document.createElement("div");
    const datos = new FormData(form);
    user = datos.get("usuario")
    pass = datos.get("password")
    (verificarUsuario(user, pass)) && (window.location.href = "admin.html");
      
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
                <p>Se produjo un error en ${pantalla}. 
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


function informarDescuentos() {
    const modalElement = document.getElementById("descuentos");
    if (modalElement) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
}