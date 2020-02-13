const path = require ("path");

let file = process.argv[2]; // Toma el archivo que se le da en la consola
file = path.resolve(file);  // Convierte la ruta de relativa a absoluta
file = path.normalize(file);  // La estandariza

const functTest = require('./module');

functTest(file);