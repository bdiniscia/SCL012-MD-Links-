const fs = require ("fs");
// const Marked = require ("Marked");


const getFile = (file) => {
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data.toString())
        }
    } )
}

module.exports = getFile;