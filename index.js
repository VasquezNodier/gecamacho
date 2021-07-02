console.log('GECamacho');

let listaProductos = [];
let original_productos = [];
let actualizar = [];
let empresas = ['Nelson Damián Camacho Suarez', 'Cesar Darío Camacho Suarez', 'MWO S.A.S', 'Mundo Cross Bogotá S.A.S', 'Moto World Oriente S.A.S.']


const item = document.getElementById('items');
const templateLista = document.getElementById('template-lista').content;
const fragment = document.createDocumentFragment();

var lista_referencias = document.getElementById('referencias');
var lista_modelos = document.getElementById('modelos');
let selector = document.getElementById('selectors');
let tablaProducto = document.getElementById('div-table');
let selector2 = document.getElementById('selectors2');
let company = document.getElementById('company');

item.addEventListener('click', e => { borrarFila(e) })

//Aquí se carga el documento y la información.
document.getElementById('btnUpload').onclick = function () {
    // Se valida si el se pulsa el botón "Cargar" sin un archivo y si el archivo no contiene el formato ".CSV"
    if ($('#fileToUpload').get(0).files.length == 0) {
        refreshPage();
        alert('¡Por favor cargue el archivo primero!');
    }

    let fileUpload = $('#fileToUpload').get(0);
    let files = fileUpload.files;
    let reader = new FileReader();

    if (files[0].name.toLowerCase().lastIndexOf('.csv') == -1) {
        refreshPage();
        alert("Por favor solo cargue archivos .CSV");
    } else {
        reader.onload = function (e) {
            doc_text = e.target.result.split("\n"); // Dividimos texto del documento por salto de línea.
            convert_to_array(doc_text);

        }
        reader.readAsText($("#fileToUpload")[0].files[0]);
    }
    $('input[type="file"]').val('');
};

// Refrescar la página
const refreshPage = () => window.location.reload();

//Corvertimos el texto separado por comas del archivo en un array
const convert_to_array = (rows) => {
    let list_moto = [];
    let productos = [];
    let cells = []
    for (let i = 0; i < rows.length; i++) {
        cells = rows[i].split(",");
        if (i % 2 == 1) {
            list_moto = cells
        } else {
            list_moto += "," + cells
            productos.push(list_moto.split(',')); // Convertimos cada linea en un segundo array

        }
    }
    productos.shift(); // Eiminamos el primer elemento de la lista (que corresponde al encbezado)

    for (let i = 0; i < productos.length; i++) {
        for (let j = 0; j < productos[i].length; j++) {
            productos[i][j] = productos[i][j].replace(new RegExp('"', 'g'), ''); // Quitamos las commillas de más
            productos[i][j] = productos[i][j].replace(new RegExp('\r', 'g'), '');// Quitamos la regExp

        }
        productos[i].splice(4, 3); // Elmininamos la posición 4 del arreglo en la que hay 3 elementos vacíos
        if (productos[i][1]) {
            productos[i][1] = productos[i][2].replace('MOTO ', '');
        }
        if (productos[i][3].includes('COLOR: ') && productos[i][4].includes('MODELO: ')) {
            productos[i][3] = productos[i][3].replace('COLOR: ', '');
            productos[i][4] = productos[i][4].replace('MODELO: ', '');
        }

    }
    let lst_referencias = [];
    let lst_modelos = [];
    productos.forEach(element => {
        lst_referencias.push(element[1]);
        lst_modelos.push(element[4]);
    });
    obtener_datos(productos);
    genera_selectores(lst_modelos, lst_referencias);
}

// Se crea un array de objetos
const generar_objeto = (productos, keys) => {
    //Convertimos el array actual de productos a un array de objetos
    var dict_productos = productos.map(function (values) {
        return keys.reduce(function (o, k, i) {
            o[k] = values[i];
            return o;
        }, {});
    });
    return dict_productos;
}

// Se generan los campos de selección en base al filtrado de modelos y referencias.
function genera_selectores(modelos, referencias) {
    referencias = filtrar_items(referencias).sort();
    modelos = filtrar_items(modelos).sort();

    selector.style.display = 'flex';
    selector.setAttribute('class', 'row g-2');

    var options = '';
    for (var i = 0; i < referencias.length; i++) {
        options += '<option value="' + referencias[i] + '" />';
    };
    lista_referencias.innerHTML = options;

    var options = '';
    for (var i = 0; i < modelos.length; i++) {
        options += '<option value="' + modelos[i] + '" />';
    };
    lista_modelos.innerHTML = options;
    document.getElementById('upload').style.display = 'none';
}

// Se filtra la lista de referencias y modelos para quitar los repetidos.
function filtrar_items(params) {
    let list = params.filter((item, index) => {
        return params.indexOf(item) === index;
    });
    return list

}

// Se consultan los datos que hay en el arreglo inicial de productos y se 
// guardan para crear una tabla en base a sus valores
function obtener_datos(productos) {
    let headers = ['id', 'referencia', 'nombre', 'color', 'modelo']
    productos = generar_objeto(productos, headers);
    original_productos = productos.slice();
    document.getElementById('agregar-info').addEventListener('click', e => {

        let obj = Array.from(document.querySelectorAll('#selectors input')).reduce((acc, input) => ({ ...acc, [input.name]: input.value }), {});

        if (obj.referencia && obj.modelo && obj.precio) {
            let esCorrecto = false;
            productos.forEach(element => {
                if (element.referencia == obj.referencia && element.modelo == obj.modelo) {
                    esCorrecto = true;
                    $('input[type="text"]').val('');
                    $('input[type="number"]').val('');
                }
            });
            if (esCorrecto == true) { // Se utiliza la bandera para agregar el producto a la lista
                if (!listaProductos.find(o => o.referencia === obj.referencia && o.modelo === obj.modelo)) {
                    agregarProducto(obj);
                } else {
                    alert('¡El producto fue ingresado en la lista!')
                }
            } else {
                alert('¡Información no válida!')
            }
        } else {
            alert('¡Los datos deben completarse!');
        }
    })
    document.getElementById('return-page').addEventListener('click', () => refreshPage());
}

// Agregamos los productos seleccionados a un array.
const agregarProducto = (element) => {
    listaProductos.push(element);
    pintarTabla();
}

// Pintamos la tabla HTML con base en el array de los productos seleccionados
function pintarTabla() {
    items.innerHTML = '';
    tablaProducto.style.display = 'block';

    listaProductos.forEach(element => {
        templateLista.querySelectorAll('td')[0].textContent = element.referencia;
        templateLista.querySelectorAll('td')[1].textContent = element.modelo;
        templateLista.querySelectorAll('td')[2].textContent = element.precio.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        templateLista.querySelector('#eliminar-fila').dataset.id = listaProductos.indexOf(element);

        let clone = templateLista.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    $(document).on('click', '#vaciar-todo', () => {
        Array.prototype.remove = Array.prototype.remove || function () {
            this.splice(0, this.length);
        };
        listaProductos.remove();
        items.innerHTML = ''
    });
}

const borrarFila = e => {
    if (e.target.classList.contains('eliminar-fila')) {
        let id = e.target.dataset.id;
        listaProductos.splice(id, 1);
    }
    pintarTabla();
}

$(document).on('click', 'button#confirmar', function (e) {
    newProducto = {}
    actualizar.splice(0)
    if (listaProductos.length !== 0) {
        if (window.confirm("Revise muy bien todas las referencias que desea actualizar")) {
            tablaProducto.style.display = 'none';
            selectors.style.display = 'none';
            selectors2.style.display = 'flex';
            var options = '';
            for (var i = 0; i < empresas.length; i++) {
                options += '<option value="' + empresas[i] + '" />';
            };
            company.innerHTML = options;
        }
    } else {
        alert('¡No hay elementos agregados a la lista!')
    }
});

$(document).on('click', 'a#confirmarTodo', function (e) {
    let company = document.getElementById('input-company').value;
    let inicio = document.getElementById('start-date').value;
    let fin = document.getElementById('end-date').value;
    newProducto = {}
    id = '';
    actualizar.splice(0)
    if (company && inicio && fin) {
        if (empresas.indexOf(company) !== -1) {
            if (comparaFecha(inicio, fin)) {
                if (listaProductos.length !== 0) {
                    if (window.confirm("Revise muy bien las fechas!")) {
                        let aux = 1;
                        listaProductos.forEach(lista => {
                            original_productos.forEach(original => {
                                if (lista.referencia === original.referencia && lista.modelo === original.modelo) {
                                    id = original.id
                                    delete original.color;
                                    delete original.modelo;
                                    delete original.nombre;
                                    delete original.referencia;
                                    newProducto = original;
                                    newProducto['id'] = 'test';
                                    if (aux == 1) {
                                        delete newProducto.id;
                                        newProducto['company'] = company;
                                        newProducto['Lista de precios'] = getNombreLista(inicio);
                                        newProducto['Política de descuento'] = 'Descuento incluido en el precio';
                                        newProducto['item_ids/applied_on'] = 'Variantes de producto';
                                        newProducto['Líneas de la lista de precios/Variantes de producto/ID externo'] = id;
                                        newProducto['item_ids/min_quantity'] = 1;
                                        newProducto['item_ids/date_start'] = inicio;
                                        newProducto['item_ids/date_end'] = fin;
                                        newProducto['item_ids/compute_price'] = 'Fixed Price';
                                        newProducto['item_ids/fixed_price'] = lista.precio;
                                        actualizar.push(newProducto);
                                        
                                    } else {
                                        delete newProducto.id;
                                        newProducto['company'] = '';
                                        newProducto['Lista de precios'] = '';
                                        newProducto['Política de descuento'] = '';
                                        newProducto['item_ids/applied_on'] = 'Variantes de producto';
                                        newProducto['Líneas de la lista de precios/Variantes de producto/ID externo'] = id;
                                        newProducto['item_ids/min_quantity'] = 1;
                                        newProducto['item_ids/date_start'] = inicio;
                                        newProducto['item_ids/date_end'] = fin;
                                        newProducto['item_ids/compute_price'] = 'Fixed Price';
                                        newProducto['item_ids/fixed_price'] = lista.precio;
                                        actualizar.push(newProducto);
                                    }
                                    aux++;
                                }
                            });
                        });
                        csvData = objectToCsv(actualizar);
                        actualizar = Object.assign({}, actualizar)
                        download(csvData);
                    }
                } else {
                    alert('¡No hay elementos agregados a la lista!')
                }
            } else {
                alert('¡La fecha es incorrecta!');
            }
        } else {
            alert('¡Empresa incorrecta!')
        }
    } else {
        alert('¡Completa todos los campos!')
    }

});

function comparaFecha(fecha1, fecha2) {
    fecha1 = new Date(fecha1);
    fecha2 = new Date(fecha2);
    if (fecha1 < fecha2) {
        return true;
    } else {
        return false;
    }
}

function getNombreLista(inicio) {
    const segundos = Date.now();
    inicio = new Date(inicio);

    let nombre = 'Precios ';
    let periodo = '', mes = '', hora = '', dia = '';

    if (inicio.getUTCDate() > 15) {
        periodo = 'L2';
    } else {
        periodo = 'L1';
    }
    if (inicio.getUTCDate() > 9) {
        dia = inicio.getUTCDate();
    } else {
        dia = '0'+inicio.getUTCDate();
    }
    if (inicio.getMonth() + 1 > 9) {
        mes = inicio.getMonth() + 1;
    } else {
        mes = '0' + (inicio.getMonth() + 1);
    }

    if (inicio.getHours() > 9) {
        hora = inicio.getHours();
    } else {
        hora = '0' + inicio.getHours();
    }

    nombre += mes + '-' + periodo + ' ' + dia + hora;
    return nombre;
}

// Creamos el csv a partir de la lista final de productos para actualizar
function objectToCsv(lista) {

    const csvRows = [];
    // Headers
    const headers = Object.keys(lista[0]);
    csvRows.push(headers.join(','));
    // Ciclo en filas
    for (const row of lista) {
        const values = headers.map(header => {
            // const escaped = row[header].replace(/"/g,'\\"')
            return `${row[header]}`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
    //CSV
}

// Descargamos el documento con el nombre product.csv
const download = function (data) {
    const blob = new Blob(["\uFEFF" + data], { type: '"text/csv; charset=utf-8"' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('class', 'btn btn-success')
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'product.csv');
    document.getElementById('descarga').appendChild(a);
    a.click();
    document.getElementById('descarga').removeChild(a);
    refreshPage();
};
