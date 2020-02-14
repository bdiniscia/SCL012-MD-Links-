const fs = require('fs');
const marked = require('marked');
const request = require('request');

const getFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      } else {
        let links = [];
        const renderer = new marked.Renderer();
        renderer.link = function(href, title, text) {
          links.push({
            href: href,
            text: text,
            file: file,
          });
        };
        marked(data, { renderer: renderer });  // Aquí imprime y crea los elementos dentro del Array
        links = linksHttp(links);
        resolve(links);
      }
    });
  });
};

const linksHttp = (links) => {
	let validateLink = [];
	links.map((element) => {
		let prefix = element.href.substring(0, 4);
		if (prefix === 'http') {
			validateLink.push(element);
		}
	})
	return validateLink;
};

module.exports = getFile;
