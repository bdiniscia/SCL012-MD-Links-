const fs = require("fs");
const marked = require("marked");

const getFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
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
        marked(data, { renderer: renderer });
        resolve(links);
      }
    });
  });
};

module.exports = getFile;
