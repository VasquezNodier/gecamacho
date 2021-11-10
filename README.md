# GE-Camacho

Página web que permite la generación de listas de precios de manera automática utilizando HTML/CSS, Bootstrap y Vanilla Javascript.
En el que se implementa algoritmo de búsqueda secuencial para la comparación de archivos y se utilizan Workers para permitir la liberación del main thread de la página, evitando así el bloqueo UI de la misma.

## Instrucciones

1. Seleccionar la empresa, la fecha de inicio y la fecha fin, para la lista. En esta sección es necesario realizar la selección de los 3 input que aparecen en la vista, ya que de lo contrario no va a poder continuar con la operación.
2. Seleccionar el tipo de producto que desea actualizar. Es necesario elegir cual es el tipo de elemento al que se le va a realizar la lista de precios (Motocicletas o Repuestos).
3. Adjuntar documento que se descargó de ODOO. .Para descargar el documento en ODOO, es necesario dirigirse a `Inventarios/Datos Principales/Variantes de producto`


### Cración de lista de precios de Moticicletas


4. Si seleccionan motocicletas deben escoger modelos, referencias y el precio de las mismas, además debe seleccionar si la motocicleta contiene impuesto de consumo o no.
5. Finalmente, el usuario procede a descargar el documento CSV, generado por la página para proceder a importarlo nuevamente en ODOO y de esta forma crear una nueva lista de precios.

### Cración de lista de precios de Repuestos

4. Si seleccionan repuestos deben cargar la lista de precios del proveedor. 
5. El sistema utiliza el algoritmo de búsqueda secuencial para comparar de manera eficiente las referencias en cada una de las listas.
6. Finalmente, el usuario procede a descargar el documento CSV, generado por la página para proceder a importarlo nuevamente en ODOO y de esta forma crear una nueva lista de precios.