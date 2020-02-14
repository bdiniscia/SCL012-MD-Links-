const path = require ('path');
const chalk = require('chalk');
const marked = require('marked')

let file = process.argv[2]; // Toma el archivo que se le da en la consola
file = path.resolve(file);  // Convierte la ruta de relativa a absoluta
file = path.normalize(file);  // La estandariza


const functTest = require('./module');

if (path.extname(file) === '.md') {  // Chequea si un archivo es .md antes de pasarlo
  const myPromise = functTest(file)
  .then((fileData) => {
    console.log(fileData);
  })
  .catch((error) => {
    console.error(error)
  })
} else {
  console.log(chalk.bgRed('Por favor, introduce un archivo .md'))
}


  //myPromise.then()