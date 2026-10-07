process.chdir(__dirname);
const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert');
vm.runInThisContext(fs.readFileSync('vendor-hash.js','utf8'));require('./core.js');const C=global.ChecksumCore;
for(const alg of ['sha256','sha512'])for(const n of [0,1,55,56,63,64,111,112,127,128,1023,1048583]){const b=crypto.randomBytes(n);let h=Hash[alg]();for(let i=0;i<b.length;i+=7919)h.update(b.subarray(i,i+7919));assert.equal(h.digest('hex'),crypto.createHash(alg).update(b).digest('hex'));}
const hex='ab'.repeat(32),sha512='ab'.repeat(64);
assert.equal(C.parseManifest(hex+'  data/a b.txt','manifest-sha256.txt')[0].path,'data/a b.txt');
assert.equal(C.parseManifest(hex+'  data/%2520%0A.txt','manifest-sha256.txt')[0].path,'data/%20\n.txt');
assert.equal(C.parseManifest(hex+'  '+C.encodePath(' 空 格%\r\n.txt'),'checksums-sha256.txt')[0].path,' 空 格%\r\n.txt');
assert.equal(C.parseManifest(hex+' *example.txt','list.txt')[0].path,'example.txt');
assert.equal(C.parseManifest(sha512+'  rights.txt','tagmanifest-sha512.txt')[0].kind,'tag');
for(const [text,name] of [[hex+'  ../bad','manifest-sha256.txt'],[hex+'  /absolute','list.txt'],[hex+'  a\n'+hex+'  a','list.txt'],[hex+'  a\nBROKEN','list.txt'],['00'.repeat(16)+'  a','manifest-md5.txt'],['','list.txt'],[sha512+'  a','manifest-sha256.txt']])assert.throws(()=>C.parseManifest(text,name));
assert.deepEqual([...C.selectedFiles([{name:'a',webkitRelativePath:'root/data/a'},{name:'a',webkitRelativePath:'root/metadata/a'}],true).keys()],['data/a','metadata/a']);
assert.throws(()=>C.selectedFiles([{name:'a'},{name:'a'}],false));
assert(C.reportCSV([{path:'=HYPERLINK("x")',status:'unlisted'}]).includes("'=HYPERLINK"));
for(const alg of ['sha256','sha512'])for(const n of [2**29-1,2**29,2**32,2**40]){const h=Hash[alg]();h.pendingTotal=n;const a=h._pad();let v=0n;for(const byte of a.slice(-h.padLength))v=(v<<8n)|BigInt(byte);assert.equal(v,BigInt(n)*8n);assert.equal((n+a.length)%(h.blockSize/8),0);}
const block=Buffer.alloc(1048576,0xa3),large=Hash.sha256(),reference=crypto.createHash('sha256');for(let i=0;i<513;i++){large.update(block);reference.update(block)}assert.equal(large.digest('hex'),reference.digest('hex'));
console.log('PASS: SHA-256/SHA-512 standard vectors, chunk boundaries, 513 MiB file, manifest paths, invalid lists and CSV safety.');
