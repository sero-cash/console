var fs = require("fs")

var utils = require('../../lib/utils/utils')

var File = function (name) {
    this.name = name
}

File.prototype.write = function (record) {
    var self = this
    if (utils.isArray(record) || utils.isObject(record)) {
        record = JSON.stringify(record)
    }
    fs.appendFile(__dirname + '/' + self.name, record + "\n", (err) => {
        if (err) {
            console.log(err);
        }
    });
}

File.prototype.clear = function () {
    var self = this
    var file = __dirname + '/' + self.name
    if (fs.existsSync(file)) {
        fs.unlink(file);
    }

}

module.exports = File;