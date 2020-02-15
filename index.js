const path = require('path');
const chalk = require('chalk');
const fetch = require('node-fetch');
const request = require('request');

let file = process.argv[2]; // Toma el archivo que se le da en la consola
file = path.resolve(file); // Convierte la ruta de relativa a absoluta
file = path.normalize(file); // La estandariza

const functTest = require('./module'); // Mi función de module.js
const option1 = process.argv[3]
const option2 = process.argv[4]


// Función que llama a la promesa
if (path.extname(file) === '.md') { // Chequea si un archivo es .md antes de pasarlo
  const myPromise = functTest(file)
    .then(fileData => {
		if (option1 === '-v' && option2 === '-s' || option1 === '-s' && option2 === '-v') {
			linksStats(fileData, true);
		} else if (option1 === '-v' || option1 === '--validate') {
			codeLinkStatus(fileData);
		} else if (option1 === '-s' || option1 === '--stats') {
			linksStats(fileData, false);
		} else {
			linksInDoc(fileData);
		}
    })
    .catch(error => {
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
const codeLinkStatus = (links) => {
  links.map(element => {
    fetch(element.href)
      .then(response => {
        if (response.ok) {
          console.log(
            chalk.green('[✔]'),
            chalk.cyan(element.href),
            chalk.bgGreen(` ${response.status} ${response.statusText} `),
			chalk.yellow.bold(element.text),
			chalk.magenta(element.file)
          );
        } else {
          console.log(
            chalk.red('[X]'),
            chalk.cyan(element.href),
            chalk.bgRed(` ${response.status} ${response.statusText} `),
			chalk.white(element.text),
			chalk.magenta(element.file)
          );
        }
      })
      .catch(error =>
        console.log(
          chalk.gray('[-]'),
          chalk.cyan(element.href),
          chalk.bgRed(` ${error.type} ${error.code} `),
		  chalk.white(element.text),
		  chalk.magenta(element.file)
        )
      );
  });
};

// Función de "-s" y "-v -s"
const linksStats = (links, isBothOptions) => {
	let numOfLinks = [];

	links.forEach(element => {
		numOfLinks.push(element.href)
	});
	let uniqueLinks = new Set(numOfLinks);
	console.log(
		chalk.black.bgGreen('Total: '), chalk.green(numOfLinks.length), '\n',
		chalk.black.bgYellow('Unique: '), chalk.yellow(uniqueLinks.size)
	)
	if (isBothOptions) { // Si es true, muestra también los broken.
		let countBroken = 0;
		const checkLinks = (numOfLinks) => {
			if (numOfLinks.length < 1)  {
				console.log(chalk.black.bgMagenta('Broken: '), chalk.magenta(countBroken));
				return;
			}

			let actualLink = numOfLinks[0];
			numOfLinks.shift();

			fetch(actualLink)
      			.then(response => {
					  if (!response.ok) {
						countBroken++;
					  }
					  checkLinks(numOfLinks);
				}).catch(error => {
					  countBroken++;
					  checkLinks(numOfLinks);
				});
		}
		checkLinks(numOfLinks);
	}
};
