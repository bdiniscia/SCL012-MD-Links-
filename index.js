const fs = require("fs");
const marked = require("marked");
const fetch = require("node-fetch");
const chalk = require("chalk");

// Mi función que me lee y manipula el archivo
const mdlinks = (file, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
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
        resolve(links);
        return;
      }

      if (options.validate === true && options.stats === false) {
        return resolve(codeLinkStatus(links, undefined));
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
  return links.filter(link => {
    return link.href.substring(0, 4) === "http";
  });
};

//  Función que chequea el status de cada link
// const codeLinkStatus = (links) => {

//       for(let i = 0; i<links.length; i++) {
//         console.log(links[i].href)
//         fetch(links[i].href)
//           .then(response => {
//           console.log(response.statusText);
//           links[i].status = response.status;
//           links[i].statusText = response.statusText;
//         }).catch(error => {
//           links[i].status = error.type;
//           links[i].statusText = error.code;
//         });
//       }
// };

//  Función que chequea el status de cada link
const codeLinkStatus = (links, newLinks) => {
  
    if (newLinks === undefined) {
      newLinks = [];
    }

    if (links.length < 1) { // La condición que para la función
      return newLinks;
    }

    let actualLink = links[0]; // El link a evaluar siempre
    console.log(">> here: 1");
    links.shift(); // Quita el primer elemento del Array luego de asignarlo a actualLink
    fetch(actualLink.href) // Promesa para evaluar cada link y agregar en el contador los rotos
      .then(response => {
        console.log(">> here: 2");
        actualLink.status = response.status;
        actualLink.statusText = response.statusText;
        newLinks.push(actualLink);
        codeLinkStatus(links, newLinks); // Se vuelve a llamar a si misma si pasa al then
      })
      .catch(error => {
        console.log(">> here: 3");
        actualLink.status = error.type;
        actualLink.statusText = error.code;
        newLinks.push(actualLink);
        codeLinkStatus(links, newLinks); // Se vuelve a llamar a si misma si cae en error
      });
};

// Función de "-s" y "-v -s"
const linksStats = (links, isBothOptions) => {
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
  if (isBothOptions) {
    // Si es true, muestra también los broken.
    let countBroken = 0;
    const checkLinks = numOfLinks => {
      // Función recurrente para contar los Broken
      if (numOfLinks.length < 1) {
        // La condición que para la función
        console.log(
          chalk.black.bgMagenta("Broken: "),
          chalk.magenta(countBroken)
        );
        return;
      }

      let actualLink = numOfLinks[0]; // El link a evaluar siempre
      numOfLinks.shift(); // Quita el primer elemento del Array luego de asignarlo a actualLink

      fetch(actualLink) // Promesa para evaluar cada link y agregar en el contador los rotos
        .then(response => {
          if (!response.ok) {
            countBroken++;
          }
          checkLinks(numOfLinks); // Se vuelve a llamar a si misma si pasa al then
        })
        .catch(error => {
          countBroken++;
          checkLinks(numOfLinks); // Se vuelve a llamar a si misma si cae en error
        });
    };
    checkLinks(numOfLinks); // Inicializa la función recurrente
  }
};

module.exports = mdlinks; // Exporta la función principal
