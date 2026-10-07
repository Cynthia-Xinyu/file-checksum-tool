const fs=require('fs'),path=require('path');
const root=__dirname;const read=f=>fs.readFileSync(path.join(root,f),'utf8');
let page=read('page.html');
page=page.replace('<!-- STYLE -->','<style>\n'+read('style.css')+'\n</style>');
page=page.replace('<!-- TRANSLATIONS -->','<script id="translations-code">globalThis.Translations='+JSON.stringify(JSON.parse(read('translations.json'))).replace(/</g,'\\u003c')+';</script>');
for(const [marker,file,id] of [['HASH_BUNDLE','vendor-hash.js','hash-code'],['CORE','core.js','core-code'],['APP','app.js','app-code']]){const code=read(file);if(code.includes('</script'))throw Error('Unsafe inline close');page=page.replace('<!-- '+marker+' -->','<script id="'+id+'">\n'+code+'\n</script>');}
const notices=['LICENSE','THIRD_PARTY_LICENSES.txt'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n\n');
page=page.replace('</head>','<!--\n'+notices.replace(/--/g,'—')+'\n-->\n</head>');
fs.writeFileSync(path.join(root,'index.html'),page);
console.log('Built self-contained index.html');
