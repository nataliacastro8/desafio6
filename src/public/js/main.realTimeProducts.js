const socket = io();

const contenidoh = document.getElementById("contenidoh");


socket.on("realTimeProducts", (data) =>{
    let salida = ``;

    data.forEach(item => {
        salida += `<div class="col md-4">
            <div class="card">
                <img src="${item.thumbnail}" class="img-fluid" alt="${item.title}">
                <div class="card-body text-center">
                    <p class="card-text">${item.title}<br>${item.price}</p>
                </div>
            </div>
        </div>`;
    });

    contenidoh.innerHTML = salida;

});

const agregarProducto = () => {
    const title = document.getElementById("title").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const price = document.getElementById("price").value;
    const product = {title:title, thumbnail:thumbnail, price:price};

    socket.emit("nuevoProducto", product);
}

const btnAgregarProducto = document.getElementById("btnAgregarProducto");
btnAgregarProducto.onclick = agregarProducto;

const eliminarProducto = () => {
    const idProduct = document.getElementById("idProduct").value;

    socket.emit("eliminarProducto", idProduct);
}

const btnEliminarProducto = document.getElementById("btnEliminarProducto");
btnEliminarProducto.onclick = eliminarProducto;