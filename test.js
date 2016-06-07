'use strict';

import cp from 'child_process';
import test from 'ava';
import execa from 'execa';

const spawn = cp.spawn;

test.cb('with wrong amount of numbers should be an error code', t => {
    const cp = spawn('./cli.js', ['01', '03', '15']);

    cp.on('close', code => {
      t.is(code, 1);
      t.end();
    });
});

test('with wrong amount of numbers should be an error message', t => {
  t.throws(execa('./cli.js', ['01', '17', '32']), /Você precisa informar seis números./);
});

test('with a valid amount of numbers', async t => {
  t.regex(
    await execa.stdout('./cli.js', ['05','06','12','19','30','60']), 
    /😱 Você escolheu os números que foram sorteados no dia/
  );
  
  t.regex(
    await execa.stdout('./cli.js', ['35','16','12','12','30','60']), 
    /Ihh, essa sequência nunca foi sorteada!\n Se for tentar a sorte e ganhar algo, lembre de mim... ❤️/
  );
});