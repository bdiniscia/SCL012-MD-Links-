const path = require('path');
const chalk = require('chalk');


let file = process.argv[2]; // Toma el archivo que se le da en la consola
file = path.resolve(file); // Convierte la ruta de relativa a absoluta
file = path.normalize(file); // La estandariza

const mdlinks = require('./index'); // Mi función de module.js
const option1 = process.argv[3];
const option2 = process.argv[4];
let options = {
    validate:false,
    stats: false
}

const checkOptions = () => {
if (option1 === '-v' && option2 === '-s' || option1 === '-s' && option2 === '-v') {
    options = {
        validate: true,
        stats: true
    }
} else if (option1 === '-v' || option1 === '--validate') {
    options = {
        validate: true,
        stats: false
    }
} else if (option1 === '-s' || option1 === '--stats') {
    options = {
        validate: false,
        stats: true
    }
}
}
checkOptions();

// Función que llama a la promesa
if (path.extname(file) === '.md') { // Chequea si un archivo es .md antes de pasarlo
  const myPromise = mdlinks(file, options)
    .then( data => {
        if (options.validate === false && options.stats === false) {
            console.log(data)
            linksInDoc(data);
        } else if (options.validate === true && options.stats === false) {
            printStatus(data);
        }
        
	}).catch(error => {
      console.error(error);
    });
} else {
  console.log(chalk.bgRed('Por favor, introduce un archivo .md válido'));
}

// Función que solo muestra los links
const linksInDoc = (links) => {
	links.forEach(element => {
		console.log(
			chalk.greenBright('»'),
			chalk.cyan(element.href),
			chalk.yellow.bold(element.text),
			chalk.magenta(element.file)
		)
	})
}

//  Función que chequea el status de cada link
const printStatus = (links) => {
    console.log('Corriendo printStatus')
    links.forEach(element => {
          if (element.statusText === 'OK') {
            console.log(
              chalk.green('[✔]'),
              chalk.cyan(element.href),
              chalk.bgGreen(` ${element.status} ${element.statusText} `),
              chalk.yellow.bold(element.text),
              chalk.magenta(element.file)
            );
          } else {
            console.log(
              chalk.red('[X]'),
              chalk.cyan(element.href),
              chalk.bgRed(` ${element.status} ${element.statusText} `),
              chalk.white(element.text),
              chalk.magenta(element.file)
            );
          }
        })
};