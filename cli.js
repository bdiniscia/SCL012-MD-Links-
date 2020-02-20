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
    console.log(chalk.bgGrey.black('Espera un momento mientras se procesa tu información'))
  const myPromise = mdlinks(file, options)
    .then( data => {
        if (options.validate === false && options.stats === false) {
            linksInDoc(data);
        } else if (options.validate === true && options.stats === false) {
            printStatus(data);
        } else if (options.validate === false && options.stats === true) {
            printTotalLinks(data)
        } else if (options.validate === true && options.stats === true) {
            printTotalLinks(data)
            printTotalBroken(data)
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

//  Función que imprime el status de cada link
const printStatus = (links) => {
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

// Función que pinta los links totales y los únicos
const printTotalLinks = (links) => {
    let numOfLinks = [];

    links.forEach(element => {
        numOfLinks.push(element.href);
    });
    let uniqueLinks = new Set(numOfLinks);
    console.log(
    chalk.black.bgGreen("Total: "),
    chalk.green(numOfLinks.length),
    "\n",
    chalk.black.bgYellow("Unique: "),
    chalk.yellow(uniqueLinks.size)
  );
}

// Función que imprime los links rotos
const printTotalBroken = (links) => {
    let countBroken = 0;
    for(let i = 0; i < links.length; i++) {
        if (links[i].statusText != 'OK') {
            countBroken++
        }
    }
    console.log(
        chalk.black.bgMagenta("Broken: "),
        chalk.magenta(countBroken));
}