const fs = require("fs");
const marked = require("marked");
const fetch = require("node-fetch");
const path = require('path');


// Mi función que me lee y manipula el archivo
const mdlinks = (file, options) => {
  if (path.extname(file) === '.md') {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      let links = [];
      const renderer = new marked.Renderer(); // Get reference
      renderer.link = function(href, title, text) { // Override function
        links.push({
          href: href,
          text: text,
          file: file
        });
      };
      marked(data, { renderer: renderer }); // Aquí imprime y crea los elementos dentro del Array
      links = linksHttp(links);

      if (options.validate === false && options.stats === false || options.validate === false && options.stats === true) {  // Aquí solo se resuelve con el primer array generado
        resolve(links);
        return;
      } else {
        codeStatusLinks(links)  // Llamada de la promesa del nuevo array con status y statusCode
          .then(links => resolve(links))
          .catch(err => console.log(err));
      }
    });
  });
}  
}


// Filtra y retorna un nuevo array con los links que contienen 'http'
const linksHttp = links => {
  return links.filter(link => {
    return link.href.substring(0, 4) === "http";
  });
};


//  Función que chequea el status de cada link
const codeStatusLinks = (links) => {
  return new Promise((resolve, reject) => {
    const getCodeStatusLinks = (links, newLinks) => {
      if (newLinks === undefined) { // Cuando pasa la primera vez 
        newLinks = [];
      }
    
      if (links.length < 1) { // La condición que para la función
        return resolve(newLinks);
      }
    
      let actualLink = links[0]; // El link a evaluar siempre
      links.shift(); // Quita el primer elemento del Array luego de asignarlo a actualLink
      fetch(actualLink.href) // Promesa para guardar el nuevo array con la nueva info de status y statusText
        .then(response => {
          actualLink.status = response.status;
          actualLink.statusText = response.statusText;
          newLinks.push(actualLink);
          getCodeStatusLinks(links, newLinks); // Se vuelve a llamar a si misma si pasa al then
        })
        .catch(error => {
          actualLink.status = error.type;
          actualLink.statusText = error.code;
          newLinks.push(actualLink);
          getCodeStatusLinks(links, newLinks); // Se vuelve a llamar a si misma si cae en error
        });
    };
    getCodeStatusLinks(links); // La inicializa la primera vez
  });
};

module.exports = mdlinks; // Exporta la función principal
