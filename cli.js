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
  let numbersFound = false;

  emoji = (os.platform() == 'win32') ? '\u00D6' : '😱';
  results.forEach((result) => {
    let diffNum = sequence.diffCounter(result.numbers);
    if( diffNum <= 2 ){
      
      numbersFound = true;
      //show the messages
      switch(diffNum) {
        case 0:
          console.log(color.cyan(emoji + ' Você escolheu os números que foram sorteados no dia ' + result.date + '!'));
          break;
        case 1:
          console.log(color.yellow(emoji + ' Você escolheu os números que foram quina no dia ' + result.date + '!'));
          break;
        case 2: 
          console.log(color.magenta(emoji + ' Você escolheu os números que foram quadra no dia ' + result.date + '!'));
          break;
      }
    }
  });
  if(!numbersFound){
    var emoji = (os.platform() == 'win32') ? '\u2665' : '❤️';
    console.log(color.green(' Ihh, essa sequência nunca foi sorteada!\n Se for tentar a sorte e ganhar algo, lembre de mim... ' + emoji));
  }
});

/**
 * Returns the number of differences between the arrays
 */
Array.prototype.diffCounter = function(arr) {
  let diffs = 6;

  this.sort();
  arr.sort();

  for (var i = 0; i < this.length; i++) {
    if (arr.indexOf(this[i]) !== -1) {
      diffs --;
    };
  };

  return diffs;
};