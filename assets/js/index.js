console.log('GECamacho');


let listaProductos = [],
    original_productos = [],
    actualizar = [],
    homologados = [],
    family = [],
    repuestos = [],
    noEncontrados = [],
    proveedor = [];

const templateLista = document.getElementById('template-lista').content;
const fragment = document.createDocumentFragment();

function upload_doc(doc) {

    let reader = new FileReader();
    let extension = validDocument(doc.name);

    if (extension === 'otro') {
        alert("Por favor solo cargue archivos .XLS o .XLSX");
        refreshPage();
    } else {
        reader.onload = function(e) {

            if (extension === 'csv') {
                doc_text = e.target.result.split("\n"); // Dividimos texto del documento por salto de línea.
                convert_csv_to_array(doc_text);
            } else {

                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                processExcel(data);
            }
        }

        if (extension === 'csv') {
            reader.readAsText(doc);
        } else {
            reader.readAsArrayBuffer(doc);
        }
    }
    $('input[type="file"]').val('');

};

function upload_doc_vendor() {

    let reader = new FileReader();
    reader.readAsBinaryString(inputVendorDoc.files[0]);
    let extension = validDocument(inputVendorDoc.files[0].name);

    if (extension === 'otro') {
        alert("Por favor solo cargue archivos .XLS o .XLSX");
        refreshPage();
    } else {
        reader.onload = function(e) {

            var bytes = e.target.result;
            processExcelVendor(bytes);

        }
    }
    $('input[type="file"]').val('');
};


let processExcel = (data) => {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    if (doc_proveedor === true) {
        procesar_proveedor(excelRows);
    } else if (es_moto === true) {
        procesar_moto(excelRows);
    } else {
        procesar_repuestos(excelRows);
    }


}

function procesar_moto(motos) {

    let prod = {};
    arr = [];

    refs = [];
    mods = [];

    //Add the data rows from Excel file.
    for (var i = 0; i < motos.length; i++) {
        //Add the data row.
        if (motos[i]['Atributos del Valor'] !== 'FALSE' && es_moto) {
            if (i % 2 == 0) {
                prod = motos[i]
            } else {
                motos[i]['Atributos del Valor'] = motos[i]['Atributos del Valor'].replace('MODELO: ', '');
                Object.assign(prod, motos[i])
                arr.push(prod)
            }
        }
    }

    arr.forEach(element => {
        if (!(refs.includes(element['Referencia Interna']))) {
            refs.push(element['Referencia Interna'])
        }

        el = element['Atributos del Valor'].replace('MODELO: ', '');
        if (!(mods.includes(el))) {
            mods.push(el);
        }
    });
    genera_selectores(mods, refs)
    validar_seleccion(arr)
}

function procesar_repuestos(reptos) {
    repuestos = reptos;
    grVendor.style.display = 'inline-block';
    grOdoo.style.display = 'none';
}

function procesar_proveedor(archivoProveedor) {
    document.getElementById('vendor').style.display = 'none';
    document.getElementById('cards-info').style.display = 'flex';
    // grSelect2.style.display = 'flex';
    document.getElementById('confirmarTodo').style.display = 'none';

    archivoProveedor.forEach(element => {
        element['HOMOLOGACIONES'] = [];
        element['PARTE No.'] = element['PARTE No.'].replace(' ', '');
        if (element['PARTE No.'].indexOf('*') === -1) {
            proveedor.push(element)
        } else {
            proveedor[proveedor.length - 1]['HOMOLOGACIONES'].push(element['PARTE No.'].replace('*', '').trim());
        }
    });
    // console.log(proveedor);
    let i = 0;

    // Recorremos la lista de los repuestos del almacén y la comparamos con los repuestos de family,
    //  haciendo una búsqueda secuencial, dado qeu es una lista desordenada.
    repuestos.forEach(element => {
        let obj = {}

        let hay = searchElement(proveedor, element['default_code']);

        if (hay == -1) {
            noEncontrados.push(element)
        } else if (element['default_code'] === proveedor[hay]['PARTE No.']) {
            obj['id'] = element['id']
            obj['default_code'] = element['default_code']
                // obj['refFamily'] = proveedor[hay]['PARTE No.']
                // obj['name'] = element['name']
                // obj['nombreFamily'] = proveedor[hay]['DESCRIPCIÓN']
            obj['precio'] = proveedor[hay]['PRECIO SUGERIDO AL PÚBLICO INCLUIDO IMPUESTOS']
            family.push(obj)
        } else if (proveedor[hay]['HOMOLOGACIONES'].includes(element['default_code'])) {
            obj['id'] = element['id']
            obj['default_code'] = element['default_code']
            obj['refFamily'] = proveedor[hay]['PARTE No.']
            obj['name'] = element['name']
            obj['nombreFamily'] = proveedor[hay]['DESCRIPCIÓN']
            obj['precio'] = proveedor[hay]['PRECIO SUGERIDO AL PÚBLICO INCLUIDO IMPUESTOS']
            obj['homologado'] = proveedor[hay]['HOMOLOGACIONES']
            homologados.push(obj)
        }
        i++;
    });

    document.getElementById('cant-finded').innerHTML = family.length;
    document.getElementById('cant-homolo').innerHTML = homologados.length;
    document.getElementById('cant-no-finded').innerHTML = noEncontrados.length;
    let cards = document.getElementsByClassName('widget-49-meeting-time')
    for (let a = 0; a < cards.length; a++) {
        const element = cards[a];
        element.innerHTML = 'de ' + proveedor.length;
    }

    let bts = document.getElementsByClassName('descargar')
    for (let a = 0; a < bts.length; a++) {
        const element = bts[a];
        element.style.display = 'inline-block';
    }
}




//Corvertimos el texto separado por comas del archivo en un array
const convert_csv_to_array = (rows) => {
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
            productos[i][j] = productos[i][j].replace(new RegExp('\r', 'g'), ''); // Quitamos la regExp

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
    var dict_productos = productos.map(function(values) {
        return keys.reduce(function(o, k, i) {
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

    grSelect1.style.display = 'flex';
    grSelect1.setAttribute('class', 'row g-2');

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
    document.getElementById('odoo').style.display = 'none';
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
function validar_seleccion(productos) {
    original_productos = productos.slice();
    document.getElementById('agregar-info').addEventListener('click', e => {

        let obj = Array.from(document.querySelectorAll('#groupRefsModels input')).reduce((acc, input) => ({...acc, [input.name]: input.value }), {});

        if (obj.referencia && obj.modelo && obj.precio) {
            let esCorrecto = false;
            productos.forEach(element => {
                if (element['Referencia Interna'] === obj.referencia && element['Atributos del Valor'] === obj.modelo) {
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
                alert('¡Revise la referencia y el modelo!')
            }
        } else {
            alert('¡Los datos deben completarse!');
        }
    })
    document.getElementById('return-page').addEventListener('click', () => refreshPage());
}

// Se consultan los datos que hay en el arreglo inicial de productos y se
// guardan para crear una tabla en base a sus valores
function obtener_datos(productos) {
    let headers = ['id', 'referencia', 'nombre', 'color', 'modelo']
    productos = generar_objeto(productos, headers);
    original_productos = productos.slice();
    document.getElementById('agregar-info').addEventListener('click', e => {

        let obj = Array.from(document.querySelectorAll('#groupRefsModels input')).reduce((acc, input) => ({...acc, [input.name]: input.value }), {});

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
                if (!listaProductos.find(o => o.referencia === obj.referencia && o === obj.modelo)) {
                    // console.log(o);
                    agregarProducto(obj);
                } else {
                    alert('¡El producto fue ingresado en la lista!')
                }
            } else {
                alert('¡Revise la referencia y el modelo!')
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
        Array.prototype.remove = Array.prototype.remove || function() {
            this.splice(0, this.length);
        };
        listaProductos.remove();
        items.innerHTML = ''
    });
}



$(document).on('click', 'button#confirmar', function(e) {
    newProducto = {}
    actualizar.splice(0)
    if (listaProductos.length !== 0) {
        tablaProducto.style.display = 'none';
        grSelect1.style.display = 'none';
        btnDescargar.style.display = 'inline-block';

    } else {
        alert('¡No hay elementos agregados a la lista!')
    }
});


btnGenerarEncontrados.onclick = (e) => {

    id = '', precio = '';

    let i = 0;
    actualizar.splice(0)

    let fila = 1;
    family.forEach(elemento => {
        newProducto = {}

        if (fila == 1) {
            newProducto['company'] = company;
            newProducto['Lista de precios'] = getListName(inicio);
            newProducto['Política de descuento'] = 'Descuento incluido en el precio';
            newProducto['item_ids/applied_on'] = 'Variantes de producto';
            newProducto['Líneas de la lista de precios/Variantes de producto/ID externo'] = elemento['id'];
            newProducto['item_ids/min_quantity'] = 1;
            newProducto['item_ids/date_start'] = inicio;
            newProducto['item_ids/date_end'] = fin;
            newProducto['item_ids/compute_price'] = 'Fixed Price';
            newProducto['item_ids/fixed_price'] = parseInt(elemento['precio'].replace(',', ''));
            actualizar.push(newProducto);

        } else {
            // delete newProducto['id'];
            newProducto['company'] = '';
            newProducto['Lista de precios'] = '';
            newProducto['Política de descuento'] = '';
            newProducto['item_ids/applied_on'] = 'Variantes de producto';
            newProducto['Líneas de la lista de precios/Variantes de producto/ID externo'] = elemento['id'];
            newProducto['item_ids/min_quantity'] = 1;
            newProducto['item_ids/date_start'] = inicio;
            newProducto['item_ids/date_end'] = fin;
            newProducto['item_ids/compute_price'] = 'Fixed Price';
            newProducto['item_ids/fixed_price'] = parseInt(elemento['precio'].replace(',', ''));
            actualizar.push(newProducto);
        }
        fila++;
    });

    csvData = objectToCsv(actualizar);
    actualizar = Object.assign({}, actualizar);

    download(csvData);

};


btnDescargar.onclick = (e) => {
    newProducto = {}
    id = '';
    actualizar.splice(0);
    if (listaProductos.length !== 0) {

        let fila = 1;
        listaProductos.forEach(lista => {
            original_productos.forEach(original => {
                if (lista.referencia === original['Referencia Interna'] && lista.modelo === original['Atributos del Valor']) {
                    id = original['ID']
                    delete original['Atributos del Valor'];
                    delete original['Nombre'];
                    delete original['Referencia Interna'];
                    delete original['Es vehículo'];
                    delete original['Tipo de producto'];
                    newProducto = original;
                    if (fila == 1) {
                        delete newProducto['ID'];
                        newProducto['company'] = company;
                        newProducto['Lista de precios'] = getListName(inicio);
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
                        delete newProducto['ID'];
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
                    fila++;
                }
            });
        });
        csvData = objectToCsv(actualizar);
        actualizar = Object.assign({}, actualizar);
        refreshPage();
        download(csvData);

    } else {
        alert('¡No hay elementos agregados a la lista!')
    }
};