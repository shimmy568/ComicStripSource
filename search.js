const chalk = require('chalk')
const request = require('request')
const tc = require('term-cluster')
const url = 'https://raw.githubusercontent.com/fergiemcdowall/reuters-21578-json/master/data/fullFileStream/justTen.str'

const ops = {
  indexPath: 'myCoolIndex',
  logLevel: 'error'
}

var index

const indexData = function(err, newIndex) {
  if (!err) {
    index = newIndex
    request(url)
      .pipe(index.feed())
      .on('finish', searchCLI)
  }
}

const printPrompt = function () {
  console.log()
  console.log()
  process.stdout.write('search > ')
}

const searchCLI = function () {
  printPrompt()
  process.stdin.resume()
  process.stdin.on('data', search)
}

const search = function(rawQuery) {
  index.search(rawQuery.toString().replace( /\r?\n|\r/g, '' ))
    .on('data', printResults)
    .on('end', printPrompt)
}

const printResults = function (data) {
  console.log('\n' + chalk.blue(data.document.id) + ' : ' + chalk.blue(data.document.title))
  const terms = Object.keys(data.scoringCriteria[0].matches[0].df).map(function(item) {
    return item.substring(2)
  })  
  for (var key in data.document) {
    if (data.document[key]) {
      var teaser = tc(data.document[key], terms)
      if (teaser) console.log(teaser)
    }
  }
  console.log()
}

require('search-index')(ops, indexData)