# MD-Links
MD-Links es una librería hecha con Node.js, para leer y analizar archivos en formato `Markdown`, y verificar los links que contengan y reportar algunas estadísticas, como la cantidad de links, el estado de los links y los links únicos. 

[Link a npm](https://www.npmjs.com/package/md-links-bdiniscia)

## Instalación
Para instalar debes correr el comando: 

    npm install bdiniscia/SCL012-MD-Links-

o 


    npm i md-links-bdiniscia


## Instrucciones de uso
Para correr la librería:

### ¿Cómo utilizar la librería?

Para linkear en la librería en tu archivo JavaScript luego de instalar el módulo con npm:
```
    const  mdLinks = require('md-links');
```
Luego, para utilizarla:
```
    mdLinks(path, options)
```

##### Argumentos

-   **`path`**  El archivo con su ruta. Tiene que ser **.md** Ejemplo: "/Users/barbara/Desktop/ProyectGit/README.md"
-   **`options`**  Acepta un objeto propiedades  "validate" y "stats" con boleanos como flags: 
Ejemplo: `options = { validate: false, stats: false }`.


##### Valor de retorno

La función retorna una promesa (`Promise`) que resuelve un arreglo (`Array`) de objetos (`Object`), donde cada objeto representa un link y contiene las siguientes propiedades:

-   `href`: URL encontrada.
-   `text`: Texto que aparecía dentro del link (`<a>`).
-   `file`: Ruta del archivo donde se encontró el link.

Y si validate es `true` va a devolver: 
-   `href`: URL encontrada.
-   `text`: Texto que aparecía dentro del link (`<a>`).
-   `file`: Ruta del archivo donde se encontró el link.
-   `status`:  Código de respuesta del servidor al consultar el link. 
-   `statusText`: Texto de respuesta al consultar el link.

### ¿Cómo utilizar el ejecutable (CLI.js)?

Abrir la consola y colocar: 

    node <<dirección de tu carpeta del proyecto>>/node_modules/md-links/cli.js <<dirección de tu archivo .md>> <<opciones>>

#### Sin opciones: 
Al no colocar opciones luego de la dirección del archivo .md, se va a imprimir en la consola solo los `href`, `text` y `file`: 

Ejemplo: 
![vista sin opciones](img/sin-opciones.png)


#### --validate  o  -v: 
Se va a imprimir en la consola los `href`, `text`, los `status`y `statusText`con la dirección del `file`: 

Ejemplo: 
![vista de --validate](img/validate.png)

#### --stats o  -s: 
Se va a imprimir en la consola los links Totales y los links Únicos (que no se repiten): 

Ejemplo:
![vista de --stats](img/stats.png)


#### -v  -s   o   -s  -v: 
Se va a imprimir en la consola los links Totales y los links Únicos (que no se repiten): 

Ejemplo: 
![vista de -v -s](img/validate-stats.png)


## Diagrama de flujo del CLI.js
![vista de --validate](img/Diagram.jpeg)


## Próximas iteraciones

Se quiere desarrollar para próximas versiones que lea más de un archivo específico de .md, sino todo los archivos que tengan extensión .md dentro de un directorio.

