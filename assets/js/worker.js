let homologados = [],
    family = [],
    noEncontrados = [];

self.addEventListener('message', function(evt) {
    let proveedor = evt.data.prov;
    let repuestos = evt.data.reps;

    console.log(proveedor);
    
    let i = 0;
    
    // Recorremos la lista de los repuestos del almacén y la comparamos con los repuestos de family,
    //  haciendo una búsqueda secuencial, dado qeu es una lista desordenada.
    repuestos.forEach(element => {
        let obj = {}
        let homo = {}

        let hay = searchElement(proveedor, element['Referencia Interna']);

        if (hay == -1) {
            noEncontrados.push(element)

        } else if (element['Referencia Interna'] === proveedor[hay]['PARTE No.']) {
            obj['id'] = element['ID']
            obj['default_code'] = element['Referencia Interna']
            obj['precio'] = proveedor[hay]['PRECIO SUGERIDO AL PÚBLICO INCLUIDO IMPUESTOS']
            family.push(obj)
        } else if (proveedor[hay]['HOMOLOGACIONES'].includes(element['Referencia Interna'])) {
            obj['id'] = element['ID']
            obj['default_code'] = element['Referencia Interna']
            obj['precio'] = proveedor[hay]['PRECIO SUGERIDO AL PÚBLICO INCLUIDO IMPUESTOS']

            family.push(obj)
            homo['ID ODOO'] = element['ID']
            homo['REFERENCIA ODOO'] = element['Referencia Interna']
            homo['NOMBRE ODOO'] = element['Nombre']
            homo['REFERENCIA FAMILY'] = proveedor[hay]['PARTE No.']
            homo['NOMBRE FAMILY'] = proveedor[hay]['DESCRIPCIÓN']
            homo['PRECIO'] = parseInt(proveedor[hay]['PRECIO SUGERIDO AL PÚBLICO INCLUIDO IMPUESTOS'].replace(',', ''));


            homologados.push(homo)
        }
        i++;

        let porc = Math.round((i / repuestos.length) * 100)

        if (porc % 5 == 0) {
            self.postMessage({
                find: family,
                nofind: noEncontrados,
                homo: homologados,
                porcentaje: porc
            })
        }

    });
})

//Búsqueda secuencial en el arreglo de productos del proveedor
function searchElement(arreglo, texto) {
    let found = false;
    let position = -1;
    let index = 0;

    while (!found && index < arreglo.length) {
        if (arreglo[index]['PARTE No.'] == texto) {
            found = true;
            position = index;
        } else if (arreglo[index]['HOMOLOGACIONES'].includes(texto)) {
            found = true;
            position = index;
        } else {
            index += 1;
        }
    }
    return position;
}