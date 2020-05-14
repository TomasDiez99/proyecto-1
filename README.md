# Proyecto 1:  HTML - CSS - Javascript - DOM

**Fecha de entrega:** 14 de Mayo de 2020 (inclusive).

Password Analyzer:

Mi propuesta es una versión de la utilidad de análisis de passwords. El usuario debe ingresar una posible contraseña en el campo central. Se puede elegir si visualizar la password ingresada o no (El navegador recordará esto). Luego de ejecutar el análisis, se mostrará debajo una tabla de dos columnas (Propiedades de la contraseña y resultados de cada propiedad) para observar las propiedades que la contraseña tiene. Sobre las dos tablas se observará una barra que indicará cuál es la "fuerza de la password", junto con un mensaje de información al respecto. En la parte inferior de la pantalla se encuentra un hipervinculo al contacto del creador de la página, la pagina de fontawesome y el departamento de Ciencias e Ingeniería de la Computación. Una sección de historial que se accede a través de un botón en la parte inferior derecha o la letra "h" y permite visualizar una tabla con los ultimos 5 (podría configurarse para ser mas o menos) passwords ingresados con sus respectivos resultados (Resultado de "fuerza de password"). Junto al botón de historial, se encuentra el botón de Limpieza de Datos, el cuál "reseteará" los datos guardados en el navegador por si el usuario lo desea. En la parte superior derecha habrá un botón para mostrar ayuda (tambien se puede acceder con la tecla de escape) y otro para switchear entre 2 modos visuales.

A los dos costados del logo (o debajo, dependiendo del tamaño de pantalla del dispositivo) se podrán observar dos espacios que pueden mostrar avisos al usuario de manera interactiva. En el lado derecho se podrá encontrar un aviso de guía sobre el uso de la página que seguirá apareciendo con cada visita hasta que el usuario lo cierre. Por el lado izquierdo aparecerá un aviso que indica recomendaciones o errores, tales como no ingresar passwords vacías o (en caso de error) informar que no se pudo encontrar un mecanismo de guardado de información en el browser, entre otros.


Consideraciones:
-Uso Bootstrap 4, iconos de fontawesome, popper.js y darkmode switch de Christian Oliff.
-Tuve un bug cuando probaba la página con Microsoft Edge, en el que mi logo se cambiaba con el modo contrario (ya que es una imagen y no responde a las propiedades css). Como solo ocurría en Edge y no en Chrome o Firefox, lo arreglé analizando el userAgent que me dice si estoy en Edge o no.
-Parece haber un bug en el que la página se bloquea si se aprieta de manera rapida la tecla Escape para abrir el modal de ayuda. Se podría arreglar con un flag que desactive el listener y que se active durante un tiempo mínimo al presionar la tecla.
-Los audios que se ejecutan durante los testeos son prototípicos.
-Sé que se recomienda el prohibir ciertos caracteres especiales para la creación de contraseñas. Se podría implementar una 'propiedad' en la que se valide la ausencia de estos caracteres.
-El mecanismo de calculo de la password es prototípico. Facilmente podría cambiar su calculo a uno mas complejo cambiando los returns de las propiedades por numeros en vez de booleans.
-La pagina no se probó en otros navegadores que no sean Chrome, Firefox y Edge. Sé que no funciona apropiadamente en Internet Explorer.
-Intenté usar DOM cuando fue necesario, pero puede que funciones (por ejemplo createAlert) que no crean o modifican a través de DOM existan en el código. Me limité a modificarlas en lo minimo para serme útil o simplemente usarlas como cliente.
-Creo que es recomendable hacer el despligue de una pagina teniendo el código javascript distribuido en pocos archivos ya que cada uno de los imports es una solicitud de archivo distinta al servidor, pero lo dejé así ya que la legibilidad mejora bastante mediante la separación de código por módulo (en lo posible).