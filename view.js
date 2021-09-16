let empresas = ['Nelson Damián Camacho Suarez', 'Mundo Cross LTDA', 'MWO S.A.S', 'Mundo Cross Bogotá S.A.S', 'Moto World Oriente S.A.S.']

let lstCompany = _('company');

let btnContinuar = _('btnContinuar');
let btnMoto = _('btnType-moto');
let btnRepuestos = _('btnType-repuestos');
let btnOdooUp = _('odoo-btnUpload');
let btnVendorUp = _('vendor-btnUpload');
let btnAgregar = _('agregar-info');
let btnReturn = _('return-page');
let btnConfirmar = _('confirmar');
let btnDescargar = _('confirmarTodo');
let btnGenerarEncontrados = _('generar-encontrados');
let btnGenerarHomologados = _('generar-homologados');
let btnGenerarNoEncontrados = _('generar-noEncontrados');

let grOdoo = _('odoo');
let grVendor = _('vendor');
let grSelect1 = _('groupRefsModels');
let grSelect2 = _('groupCompanyDates');
let grMotoRepu = _('btnType');
let tablaProducto = _('div-table');
let btnCard = document.getElementsByClassName('descarga')

let inputOdooDoc = _('odoo-fileInput');
let inputVendorDoc = _('vendor-fileInput');

let progressBar = _('progress');
var esMoto = false;

var lista_referencias = _('referencias');
var lista_modelos = _('modelos');

var odooFile;

cargarEmpresas();

btnContinuar.onclick = () => {
    if (getCompanyAndDates()) {
        _('btnType').style.display = 'flex';
        grSelect2.style.display = 'none';
    } else {
        console.log('no');
    }
}

btnMoto.onclick = () => {
    _('titulo').innerHTML = 'Actualización de precios de Motocicletas';
    change_visual();
    es_moto = true
}

btnRepuestos.onclick = () => {
    _('titulo').innerHTML = 'Actualización de precios de Repuestos';
    change_visual();
    es_moto = false
}

//Change visual elements
function change_visual() {
    grMotoRepu.style.display = 'none';
    grOdoo.style.display = 'inline-block';

}