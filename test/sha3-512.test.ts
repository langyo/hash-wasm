import fs from 'fs';
import { sha3 } from '../lib';
/* global test, expect */

test('simple strings', async () => {
  expect(await sha3('')).toBe('a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26');
  expect(await sha3('a')).toBe('697f2d856172cb8309d6b8b97dac4de344b549d4dee61edfb4962d8698b7fa803f4f93ff24393586e28b5b957ac3d1d369420ce53332712f997bd336d09ab02a');
  expect(await sha3('a\x00')).toBe('8d9b65030b4721341fcff7d39811d5acbd65c730500b4a0c58aaa5150b5ec490d3508edda2d3a8a4f32a5428e39c64dc9ebf2b44edfab27863221c8b633d3fc6');
  expect(await sha3('abc')).toBe('b751850b1a57168a5693cd924b6b096e08f621827444f70d884f5d0240d2712e10e116e9192af3c91a7ec57647e3934057340b4cf408d5a56592f8274eec53f0');
  expect(await sha3('message digest')).toBe('3444e155881fa15511f57726c7d7cfe80302a7433067b29d59a71415ca9dd141ac892d310bc4d78128c98fda839d18d7f0556f2fe7acb3c0cda4bff3a25f5f59');
  expect(await sha3('abcdefghijklmnopqrstuvwxyz')).toBe('af328d17fa28753a3c9f5cb72e376b90440b96f0289e5703b729324a975ab384eda565fc92aaded143669900d761861687acdc0a5ffa358bd0571aaad80aca68');
  expect(await sha3('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')).toBe('d1db17b4745b255e5eb159f66593cc9c143850979fc7a3951796aba80165aab536b46174ce19e3f707f0e5c6487f5f03084bc0ec9461691ef20113e42ad28163');
  expect(await sha3('12345678901234567890123456789012345678901234567890123456789012345678901234567890')).toBe('9524b9a5536b91069526b4f6196b7e9475b4da69e01f0c855797f224cd7335ddb286fd99b9b32ffe33b59ad424cc1744f6eb59137f5fb8601932e8a8af0ae930');
});

test('unicode strings', async () => {
  expect(await sha3('😊')).toBe('1ba5dcca27cee510712bb1a0de303d95e4e495d710cea7eb0c915ebc8180b185fbd1e1ef304b56db2d61784857094797625078a4f1020c95da8dc498f030e30d');
  expect(await sha3('😊a😊')).toBe('b0b07129dbc8ead504960c1740d5cb4419af4668df0f521fc416c739fe91bd6550fa2c5bbc1d1b854c422bc9f4894ac8f6253ea263dcb74e7eb159ea1e8ca875');
  const file = fs.readFileSync('./test/utf8.txt');
  expect(await sha3(file)).toBe('dea1b4183ec036d8a05cfd4ea10612d99fd1e267134b344b9bbbe0a866f88bd2c5321e5df99a4065378b13af917b36b78a53a81c16fe38e628c4f1bf726b6725');
  expect(await sha3(file.toString())).toBe('dea1b4183ec036d8a05cfd4ea10612d99fd1e267134b344b9bbbe0a866f88bd2c5321e5df99a4065378b13af917b36b78a53a81c16fe38e628c4f1bf726b6725');
});

test('Node.js buffers', async () => {
  expect(await sha3(Buffer.from([]))).toBe('a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26');
  expect(await sha3(Buffer.from(['a'.charCodeAt(0)]))).toBe('697f2d856172cb8309d6b8b97dac4de344b549d4dee61edfb4962d8698b7fa803f4f93ff24393586e28b5b957ac3d1d369420ce53332712f997bd336d09ab02a');
  expect(await sha3(Buffer.from([0]))).toBe('7127aab211f82a18d06cf7578ff49d5089017944139aa60d8bee057811a15fb55a53887600a3eceba004de51105139f32506fe5b53e1913bfa6b32e716fe97da');
  expect(await sha3(Buffer.from([0, 1, 0, 0, 2, 0]))).toBe('25683067bead0f4209395820eb58a9c942877a41048db1630faadfe82ee79f9e86b856e8a27157f5b7e33a8feb5a4957e590d28a8da93ffc55d694142fba0b45');
});

test('typed arrays', async () => {
  const arr = [0, 1, 2, 3, 4, 5, 255, 254];
  expect(await sha3(Buffer.from(arr))).toBe('23e99c908841299bec75f140c2724e533e9a5ad88d6761ace471f4116b1618ba1441a1d4a928da8643ee4b5cc5f0bfa9b374cdece172756a7b0c7d88fe38ede0');
  const uint8 = new Uint8Array(arr);
  expect(await sha3(uint8)).toBe('23e99c908841299bec75f140c2724e533e9a5ad88d6761ace471f4116b1618ba1441a1d4a928da8643ee4b5cc5f0bfa9b374cdece172756a7b0c7d88fe38ede0');
  expect(await sha3(new Uint16Array(uint8.buffer))).toBe('23e99c908841299bec75f140c2724e533e9a5ad88d6761ace471f4116b1618ba1441a1d4a928da8643ee4b5cc5f0bfa9b374cdece172756a7b0c7d88fe38ede0');
  expect(await sha3(new Uint32Array(uint8.buffer))).toBe('23e99c908841299bec75f140c2724e533e9a5ad88d6761ace471f4116b1618ba1441a1d4a928da8643ee4b5cc5f0bfa9b374cdece172756a7b0c7d88fe38ede0');
});

test('long strings', async () => {
  const SIZE = 5 * 1024 * 1024;
  const chunk = '012345678\x09';
  const str = (new Array(Math.floor(SIZE / chunk.length)).fill(chunk)).join('');
  expect(await sha3(str)).toBe('21afc7033cb794d8b4b608363b7734a3063b2465a8af9ae33072dfbee5f10f8b0907f54e8ff926dfc0ba67e3d264870f353c3eacca3188c75e14559b5fcc4b4b');
});

test('long buffers', async () => {
  const SIZE = 5 * 1024 * 1024;
  const buf = Buffer.alloc(SIZE);
  buf.fill('\x00\x01\x02\x03\x04\x05\x06\x07\x08\xFF');
  expect(await sha3(buf)).toBe('4fefa4aacf871180c27f83ec93f2d058758a6ecba564747fd681a067f9438638fc1e70362121fa64d1734d77ad09eff7822c8bc108761598a9a12e816e24ad57');
});