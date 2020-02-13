const fs = require ("fs");
// const Marked = require ("Marked");


const getFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                return reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

module.exports = getFile;