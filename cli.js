#!/usr/bin/env node

'use strict';

const parseJson = require('parse-json');
const jsonFile  = require('jsonfile');
const color     = require('cli-color');
const argv      = require('minimist')(process.argv.slice(2));
const meow      = require('meow');

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

jsonFile.readFile('./results.json', function(err, response) {
  let results = JSON.parse(JSON.stringify(response));

  results.forEach((result) => {
    if (false === sequence.hasDiff(result.numbers)) {
      console.log(color.cyan(' 😱 Você escolheu os números que foram sorteados no dia ' + result.date + '!'));
      return;
    };
  });

  console.log(color.green(' Ihh, essa sequência nunca foi sorteada!\n Se for tentar a sorte e ganhar algo, lembre de mim... ❤️'));
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