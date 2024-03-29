// Función para cargar los productos desde un archivo JSON local utilizando Fetch
async function cargarProductos() {
    try {
        const response = await fetch('productos.json'); // Se obtiene la respuesta del archivo JSON
        if (!response.ok) {
            throw new Error('No se pudo cargar la lista de productos.'); // Se lanza un error si la respuesta no es exitosa
        }
        const data = await response.json(); // Se convierte la respuesta a formato JSON
        guardarAlmacenamientoLocal('productos', data); // Se guardan los productos en el almacenamiento local
        productos = data; // Se asignan los productos a la variable 'productos'
        visualizarProductos(); // Se llama a la función para mostrar los productos en el DOM
    } catch (error) {
        console.error('Error al cargar los productos:', error); // Se muestra un mensaje de error en la consola si falla la carga
    }
}

// Funciones para almacenar y traer los datos que se almacenan en el almacenamiento local
function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar)); // Se guarda un valor en el almacenamiento local
}

function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave)); // Se obtiene un valor del almacenamiento local y se convierte a formato JSON
    return datos; // Se retorna el valor obtenido
}

let productos = obtenerAlmacenamientoLocal('productos') || []; // Se inicializa la variable 'productos' obteniendo los datos del almacenamiento local o una lista vacía si no hay datos

// Variables que traemos de nuestro html
const informacionCompra = document.getElementById('informacionCompra'); // Se obtiene el elemento del DOM con el id 'informacionCompra'
const contenedorCompra = document.getElementById('contenedorCompra'); // Se obtiene el elemento del DOM con el id 'contenedorCompra'
const productosCompra = document.getElementById('productosCompra'); // Se obtiene el elemento del DOM con el id 'productosCompra'
const contenedor = document.getElementById('contenedor'); // Se obtiene el elemento del DOM con el id 'contenedor'
const carrito = document.getElementById('carrito'); // Se obtiene el elemento del DOM con el id 'carrito'
const numero = document.getElementById("numero"); // Se obtiene el elemento del DOM con el id 'numero'
const header = document.querySelector("#header"); // Se obtiene el elemento del DOM con la etiqueta 'header'
const total = document.getElementById('total'); // Se obtiene el elemento del DOM con el id 'total'
const body = document.querySelector("body"); // Se obtiene el elemento del DOM con la etiqueta 'body'
const x = document.getElementById('x'); // Se obtiene el elemento del DOM con el id 'x'

// Variables que vamos a usar en nuestro proyecto
let lista = []; // Se inicializa una lista para almacenar los productos seleccionados
let valortotal = 0; // Se inicializa una variable para almacenar el valor total de la compra

// Scroll de nuestra página
window.addEventListener("scroll", function () {
    // Se agrega un evento de scroll a la ventana
    if (contenedor.getBoundingClientRect().top < 10) {
        header.classList.add("scroll"); // Se agrega una clase al encabezado si el contenedor está cerca de la parte superior de la página
    } else {
        header.classList.remove("scroll"); // Se remueve la clase si el contenedor no está cerca de la parte superior
    }
});

window.addEventListener('load', () => {
    cargarProductos(); // Se llama a la función para cargar los productos cuando la página se carga completamente
    contenedorCompra.classList.add("none"); // Se agrega una clase CSS para ocultar el contenedor de compra al cargar la página
});

// Función para mostrar los productos en el contenedor principal
function visualizarProductos() {
    contenedor.innerHTML = ""; // Se limpia el contenido del contenedor principal
    for (let i = 0; i < productos.length; i++) {
        // Se itera sobre la lista de productos y se agregan al contenedor principal con su información
        if (productos[i].existencia > 0) {
            contenedor.innerHTML += `<div><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio">$${productos[i].valor}</p><button onclick=comprar(${i})>Comprar</button></div></div>`;
        } else {
            contenedor.innerHTML += `<div><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio">$${productos[i].valor}</p><p class="soldOut">Sold Out</p></div></div>`;
        }
    }
}

// Función para agregar un producto al carrito de compras
function comprar(indice) {
    lista.push({ nombre: productos[indice].nombre, precio: productos[indice].valor }); // Se agrega el producto seleccionado a la lista de compras
    let van = true;
    let i = 0;
    while (van == true) {
        // Se busca el producto en la lista de productos y se actualiza su existencia
        if (productos[i].nombre == productos[indice].nombre) {
            productos[i].existencia -= 1; // Se decrementa la existencia del producto seleccionado
            if (productos[i].existencia == 0) {
                visualizarProductos(); // Se actualiza la visualización de los productos en el DOM si la existencia llega a cero
            }
            van = false; // Se detiene el bucle
        }
        guardarAlmacenamientoLocal("productos", productos); // Se guardan los productos actualizados en el almacenamiento local
        i += 1; // Se incrementa el índice
    }
    numero.innerHTML = lista.length; // Se actualiza el número de productos en el carrito en el DOM
    numero.classList.add("diseñoNumero"); // Se agrega una clase CSS para el diseño del número de productos en el carrito
    return lista; // Se retorna la lista de productos en el carrito
}

// Evento click para abrir el carrito de compras
carrito.addEventListener("click", function(){
    body.style.overflow = "hidden"; // Se desactiva el scroll de la página
    contenedorCompra.classList.remove('none'); // Se muestra el contenedor de compra
    contenedorCompra.classList.add('contenedorCompra'); // Se agrega una clase CSS al contenedor de compra
    informacionCompra.classList.add('informacionCompra'); // Se agrega una clase CSS a la información de compra
    mostrarElemtrosLista(); // Se llama a la función para mostrar los elementos en la lista de compras
});

// Función para mostrar los elementos en la lista de compras
function mostrarElemtrosLista() {
    productosCompra.innerHTML = ""; // Se limpia el contenido de la lista de productos en el carrito
    valortotal = 0; // Se reinicia el valor total de la compra
    for (let i = 0; i < lista.length; i++){
        // Se itera sobre la lista de productos en el carrito y se muestran en el contenedor de compra
        productosCompra.innerHTML += `<div><div class="img"><button onclick=eliminar(${i}) class="botonTrash"><img src="/img/carrito/trash.png"></button><p>${lista[i].nombre}</p></div><p> $${lista[i].precio}</p></div>`;
        valortotal += parseInt(lista[i].precio); // Se suma el precio de cada producto al valor total
    }
    total.innerHTML = `<p>Valor Total</p> <p><span>$${valortotal}</span></p>`; // Se muestra el valor total en el DOM
}

// Función para eliminar un producto del carrito de compras
function eliminar(indice){
    let van = true;
    let i = 0;
    while (van == true) {
        // Se busca el producto en la lista de productos y se actualiza su existencia
        if (productos[i].nombre == lista[indice].nombre) {
            productos[i].existencia += 1; // Se incrementa la existencia del producto eliminado
            lista.splice(indice, 1); // Se elimina el producto de la lista de compras
            van = false; // Se detiene el bucle
        }
        i += 1; // Se incrementa el índice
    }
    guardarAlmacenamientoLocal("productos", productos); // Se guardan los productos actualizados en el almacenamiento local
    numero.innerHTML = lista.length; // Se actualiza el número de productos en el carrito en el DOM
    if (lista.length == 0){
        numero.classList.remove("diseñoNumero"); // Se remueve la clase CSS si la lista de compras está vacía
    }
    visualizarProductos(); // Se actualiza la visualización de los productos en el DOM
    mostrarElemtrosLista(); // Se actualiza la lista de compras en el DOM
}

// Evento click para cerrar el carrito de compras
x.addEventListener("click", function(){
    body.style.overflow = "auto"; // Se activa el scroll de la página
    contenedorCompra.classList.add('none'); // Se oculta el contenedor de compra
    contenedorCompra.classList.remove('contenedorCompra'); // Se remueve una clase CSS del contenedor de compra
    informacionCompra.classList.remove('informacionCompra'); // Se remueve una clase CSS de la información de compra
});
