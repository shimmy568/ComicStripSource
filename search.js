const findShit = require('./findShit.js');

const ops = {
  indexPath: 'index',
  logLevel: 'error'
}

var index

const indexData = function (err, newIndex) {
  if (!err) {
    index = newIndex;
    findShit.getAllAllTheShitFromTheDatabase((err, data) => {
      if (!err) {
        newIndex.concurrentAdd({}, data, (err) => {});
      }
    });
  }
}

require('search-index')(ops, indexData)

/**
 * 
 * @param {String} search Search terms
 * @param {function} callback 
 */
function doSearch(search, callback) {
  console.log(search.split(" "));
  index.search({
    query: [{
      AND: {
        '*': search.split(" ")
      }
    }]
  }).on('data', callback);
}

module.exports.doSearch = doSearch;