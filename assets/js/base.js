function _(el) {
    return document.getElementById(el);
}

let company, inicio, fin;

const cargarEmpresas = () => {
    let options = '';
    for (var j = 0; j < empresas.length; j++) {
        options += '<option value="' + empresas[j] + '" />';
    };
    lstCompany.innerHTML = options;
}



const getCompanyAndDates = () => {
    company = _('input-company').value;
    inicio = _('start-date').value;
    fin = _('end-date').value;
    if (company && inicio && fin) {
        if (empresas.indexOf(company) !== -1 && comparaFecha(inicio, fin)) {
            return true;
        } else {
            alert('Los datos ingresados son incorrectos!');
            return false;
        }
    } else {
        alert('Complete los campos!');
        return false;

    }
}


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

// Descargamos el documento con el nombre product.csv
const download = function(data) {
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

const comparaFecha = (fecha1, fecha2) => {
    fecha1 = new Date(fecha1);
    fecha2 = new Date(fecha2);
    if (fecha1 <= fecha2) {
        return true;
    } else {
        return false;
    }
}

const getListName = (inicio) => {
    const segundos = Date.now();
    inicio = new Date(inicio);

    let nombre = 'Precios ';
    let periodo = '',
        mes = '',
        hora = '',
        dia = '';

    if (inicio.getUTCDate() > 15) {
        periodo = 'L2';
    } else {
        periodo = 'L1';
    }
    if (inicio.getUTCDate() > 9) {
        dia = inicio.getUTCDate();
    } else {
        dia = '0' + inicio.getUTCDate();
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

// Verificar si se ingresa un archivo con la extensión apropiada.
const validDocument = (name) => {
    if (name.lastIndexOf('.csv') != -1) {
        return 'csv';
    } else if (name.lastIndexOf('.xlsx') != -1) {
        return 'xlsx';
    } else {
        return 'otro';
    }
}