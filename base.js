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

const comparaFecha = (fecha1, fecha2) => {
    fecha1 = new Date(fecha1);
    fecha2 = new Date(fecha2);
    if (fecha1 <= fecha2) {
        return true;
    } else {
        return false;
    }
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