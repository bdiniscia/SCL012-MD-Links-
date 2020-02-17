const fs = require('fs');
const marked = require('marked');
const fetch = require('node-fetch');
const chalk = require('chalk');

// Mi función que me lee y manipula el archivo
const mdlinks = (file, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      let links = [];
      const renderer = new marked.Renderer(); // Get reference
      renderer.link = function(href, title, text) {
        // Override function
        links.push({
          href: href,
          text: text,
          file: file
        });
      };
      marked(data, { renderer: renderer }); // Aquí imprime y crea los elementos dentro del Array
      links = linksHttp(links);

      if (options.validate === false && options.stats === false) {
        resolve(linksInDoc(links));
        return;
      }

      if (options.validate === true && options.stats === false) {
        resolve(codeLinkStatus(links));
        return;
      }

      if (options.validate === false && options.stats === true) {
        resolve(linksStats(links, false));
        return;
      }

      if (options.validate === true && options.stats === true) {
        resolve(linksStats(links, true));
        return;
      }
        
    });
  });
};


// Filtra y retorna un nuevo array con los links que contienen 'http'
const linksHttp = links => {
  let validateLink = [];
  links.map(element => {
    let prefix = element.href.substring(0, 4);
    if (prefix === 'http') {
      validateLink.push(element);
    }
  });
  return validateLink;
};


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
		const checkLinks = (numOfLinks) => {  // Función recurrente para contar los Broken
			if (numOfLinks.length < 1)  {  // La condición que para la función
				console.log(chalk.black.bgMagenta('Broken: '), chalk.magenta(countBroken));
				return;
			}

			let actualLink = numOfLinks[0];  // El link a evaluar siempre
			numOfLinks.shift();  // Quita el primer elemento del Array luego de asignarlo a actualLink

			fetch(actualLink)  // Promesa para evaluar cada link y agregar en el contador los rotos
      			.then(response => {
					  if (!response.ok) {
						countBroken++;
					  }
					  checkLinks(numOfLinks); // Se vuelve a llamar a si misma si pasa al then
				}).catch(error => {
					  countBroken++;
					  checkLinks(numOfLinks);  // Se vuelve a llamar a si misma si cae en error
				});
		}
		checkLinks(numOfLinks);  // Inicializa la función recurrente
	}
};


module.exports = mdlinks; // Exporta la función principal
