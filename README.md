# GE-Camacho

Página web que permite la generación de listas de precios de manera automática utilizando HTML/CSS, Bootstrap y Vanilla Javascript.
En el que se implementa algoritmo de búsqueda secuencial para la comparación de archivos y se utilizan Workers para permitir la liberación del main thread de la página, evitando así el bloqueo UI de la misma.

## Funcionamiento
1. Los usuarios cargan el archivo de motocicletas o repuestos (previamente descargado del software ERP ODOO).
2. Seleccionan el tipo producto que desean actualizar (motocicletas o repuestos).
3. Si seleccionan motocicletas deben escoger modelos, referencias y el precio de las mismas.
4. Si seleccionan repuestos deben cargar la lista de precios del proveedor. 
5. Para el punto anterior, el sistema utiliza el algoritmo de búsqueda secuencial para comparar de manera eficiente las referencias en cada una de las listas.
6. Finalmente, el usuario procede a descargar el documento CSV, generado por la página para proceder a importarlo nuevamente en ODOO y de esta forma crear una nueva lista de precios.
