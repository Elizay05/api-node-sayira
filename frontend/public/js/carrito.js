document.addEventListener('DOMContentLoaded', () => {
    verBolsa();
})

function obtenerBolsa(){
    let bolsa = JSON.parse(localStorage.getItem('bolsa')) || [];
    return bolsa;
}


function verBolsa(){
    let bolsa = obtenerBolsa();
    let bolsaContainer = document.getElementById('container-bag');
    let contenedorTotal = document.getElementById('contenedor-total');
    let btnPagar = document.getElementById('btn-pagar');
    let btnVaciar = document.getElementById('btn-vaciar');

    bolsaContainer.innerHTML = '';

    if (bolsa.length === 0) {
        bolsaContainer.innerHTML = '<p>Tu bolsa de compras esta vacía</p>';
        contenedorTotal.classList.add('d-none');
        btnPagar.classList.add('d-none');
        btnVaciar.classList.add('d-none');

    }else{
        bolsa.forEach(producto => {
            let card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${producto.imagenes}" class="img-fluid rounded-start h-100" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body pl-2 pt-1">
                            <p class="card-text fw-bold m-0">${producto.nombre}</p>
                            <small class="card-text">Precio unitario: <b>$ ${producto.precio}</b></small>
                            <div class="d-flex justify-content-between mt-2">
                                <input class="form-control text-center w-50" id="input-${producto.id}" oninput="actualizarBolsa('${producto.id}')" type="number" value="${producto.cantidad}" min="1">
                                <button class="btn btn-danger" onclick="eliminarDeBolsa('${producto.id}')"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            bolsaContainer.appendChild(card);
        });

        contenedorTotal.classList.remove('d-none');
        btnPagar.classList.remove('d-none');
        btnVaciar.classList.remove('d-none');
    }

    let totalProductosBolsa = document.getElementById('totalProductosBolsa');
    totalProductosBolsa.innerText = 'Productos: (' + bolsa.length + ')';

    let badgeTotalBolsa = document.getElementById('badgeTotalBolsa');
    badgeTotalBolsa.innerText = bolsa.length

    actualizarTotal();
}


function agregarBolsa(_id, referencia, nombre, descripcion, precio, stock, imagenes, habilitado){
    let bolsa = JSON.parse(localStorage.getItem('bolsa')) || [];
    
    let producto = {
        'id': _id,
        'referencia': referencia,
        'nombre': nombre,
        'descripcion': descripcion,
        'precio': precio,
        'stock': stock,
        'imagenes': imagenes,
        'cantidad': 1,
        'habilitado': habilitado
    }

    let index = bolsa.findIndex(producto => producto.id === _id);
    if(index === -1){
        bolsa.push(producto);
    }else{
        bolsa[index].cantidad += 1;
    }

    localStorage.setItem('bolsa', JSON.stringify(bolsa));

    console.log(bolsa);

    verBolsa();
    let offCanvasBag = new bootstrap.Offcanvas(document.getElementById('offcanvasBag'));
    offCanvasBag.show();
}


function actualizarBolsa(_id) {
    let bolsa = obtenerBolsa();
    let inputCantidad = document.getElementById(`input-${_id}`);
    let nuevaCantidad = parseInt(inputCantidad.value, 10);

    console.log(inputCantidad.value);

    let index = bolsa.findIndex(producto => producto.id === _id);
    if (index !== -1 && nuevaCantidad > 0) {
        bolsa[index].cantidad = nuevaCantidad;
    } else if (index !== -1 && nuevaCantidad <= 0) {
        eliminarDeBolsa(index);
    }

    localStorage.setItem('bolsa', JSON.stringify(bolsa));

    verBolsa();
}

function actualizarTotal(){
    let bolsa = obtenerBolsa();
    let total = 0;

    bolsa.forEach(producto => {
        total += (producto.precio * producto.cantidad);
    });

    document.getElementById('totalBolsa').innerText = '$ ' + total;
}

function eliminarDeBolsa(_id){
    let bolsa = obtenerBolsa();
    let index = bolsa.findIndex(producto => producto.id === _id);
    
    if(index === -1){
        return;
    }else{
        bolsa.splice(index, 1);
    }

    localStorage.setItem('bolsa', JSON.stringify(bolsa));

    verBolsa();
}


function vaciarBolsa(){
    localStorage.removeItem('bolsa');
    verBolsa();
}



//ELIMINAR PRODUCTO

function eliminarProducto(id){
    $.ajax({
        url: `/api/productos/${id}`,
        type: 'DELETE',
        success: function(result){
            console.log(result);
            window.location.href = `${result}`;
        },error: function(err){
            console.log(err);
        }
    })
}