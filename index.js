const path = require('path');
const chalk = require('chalk');
const fetch = require('node-fetch');

let file = process.argv[2]; // Toma el archivo que se le da en la consola
file = path.resolve(file); // Convierte la ruta de relativa a absoluta
file = path.normalize(file); // La estandariza

const functTest = require('./module'); // Mi función de module.js

// Función que llama a la promesa
if (path.extname(file) === '.md') {
  // Chequea si un archivo es .md antes de pasarlo
  const myPromise = functTest(file)
    .then(fileData => {
      codeLinkStatus(fileData);
    })
    .catch(error => {
      console.error(error);
    });
} else {
  console.log(chalk.bgRed('Por favor, introduce un archivo .md'));
}

//  Función que chequea el status de cada link
const codeLinkStatus = links => {
  links.map(element => {
    fetch(element.href)
      .then(response => {
        if (response.ok) {
          console.log(
            chalk.green('[✔]'),
            chalk.cyan(element.href),
            chalk.bgGreen(` ${response.status} ${response.statusText} `),
            chalk.yellow(element.text)
          );
        } else {
          console.log(
            chalk.red('[X]'),
            chalk.cyan(element.href),
            chalk.bgRed(` ${response.status} ${response.statusText} `),
            chalk.white(element.text)
          );
        }
      })
      .catch(error =>
        console.log(
          chalk.gray('[-]'),
          chalk.cyan(element.href),
          chalk.bgRed(` ${error.type} ${error.code} `),
          chalk.white(element.text)
        )
      );
  });
};
