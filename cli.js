#!/usr/bin/env node

'use strict';

const parseJson = require('parse-json');
const jsonFile  = require('jsonfile');
const color     = require('cli-color');
const argv      = require('minimist')(process.argv.slice(2));
const meow      = require('meow');
const path      = require('path');
const os        = require('os');

const cli = meow(`
    Usage
      $ mega-sena <numbers>

    Examples
      $ mega-sena 05 06 12 19 30 60
      
      😱 Você escolheu os números que foram sorteados no dia 04/06/2016!     
`);

let wrongNumber = (argv._.length !== 6);
if (wrongNumber) {
  console.error(color.red('Você precisa informar seis números.'));
  process.exit(1);
};

let sequence = argv._;

jsonFile.readFile(path.resolve(__dirname) + '/results.json', function(err, response) {
  let results = JSON.parse(JSON.stringify(response));

  const emoji = (os.platform() == 'win32') ? '\u2665' : '❤️';

  results.forEach((result) => {
    if (false === sequence.hasDiff(result.numbers)) {
        emoji = (os.platform() == 'win32') ? '\u00D6' : '😱';

        console.log(color.cyan(emoji + ' Você escolheu os números que foram sorteados no dia ' + result.date + '!'));
        process.exit(0);
    };
  });

  console.log(color.green(' Ihh, essa sequência nunca foi sorteada!\n Se for tentar a sorte e ganhar algo, lembre de mim... ' + emoji));
});

Array.prototype.hasDiff = function(arr) {
  let r = [];

  this.sort();
  arr.sort();

  for (var i = 0; i < this.length; i++) {
    if (arr.indexOf(this[i]) !== -1) {
      r.push(this[i]);
    };
  };

  return (r.length !== 6);
};