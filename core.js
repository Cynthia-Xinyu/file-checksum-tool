(function(root){
  const encodePath=p=>p.replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A');
  const decodePath=p=>p.replace(/%(25|0d|0a)/gi,x=>String.fromCharCode(parseInt(x.slice(1),16)));
  const cleanPath=p=>{p=p.replace(/^\.\//,'');if(!p||p.startsWith('/')||/^[a-z]:/i.test(p)||p.split('/').some(s=>s==='..'||s==='.'||s==='')||p.includes('\0'))throw new Error('unsafePath');return p;};
  const manifestName=p=>/^(?:tagmanifest|manifest|checksums)-(sha256|sha512)\.txt$/i.test(p.split('/').pop());
  function parseManifest(text,name){
    const hint=name.match(/(?:tagmanifest|manifest|checksums)-([a-z0-9-]+)\.txt$/i);
    let algorithm=hint?hint[1].toLowerCase().replace(/-/g,''):null;
    if(algorithm&&!['sha256','sha512'].includes(algorithm))throw new Error('unsupported');
    const rows=[],seen=new Set();
    const bagStyle=/^(?:tagmanifest|manifest|checksums)-/i.test(name.split('/').pop());
    for(const [i,line] of text.replace(/^\uFEFF/,'').split(/\r\n|\n|\r/).entries()){
      if(!line.trim())continue;
      const own=/^checksums-(?:sha256|sha512)\.txt$/i.test(name.split('/').pop());
      const m=line.match(own?/^([a-fA-F0-9]+) {2}(.+)$/:/^([a-fA-F0-9]+)[ \t]+(.+)$/);
      if(!m)throw new Error('badLine:'+String(i+1));
      const alg=m[1].length===64?'sha256':m[1].length===128?'sha512':null;
      if(!alg)throw new Error('unsupported');
      if(algorithm&&algorithm!==alg)throw new Error('badLine:'+String(i+1));algorithm=alg;
      let p=m[2];if(!bagStyle&&p.startsWith('*'))p=p.slice(1);
      if(bagStyle)p=decodePath(p);
      p=cleanPath(p);
      if(seen.has(p))throw new Error('duplicate:'+p);seen.add(p);
      rows.push({path:p,expected:m[1].toLowerCase(),algorithm:alg,manifest:name,kind:/^tagmanifest-/i.test(name.split('/').pop())?'tag':'payload'});
    }
    if(!rows.length)throw new Error('emptyManifest');return rows;
  }
  function selectedFiles(files,folder){
    const map=new Map();
    for(const f of files){let p=folder&&f.webkitRelativePath?f.webkitRelativePath.split('/').slice(1).join('/'):f.name;p=cleanPath(p);if(map.has(p))throw new Error('duplicate:'+p);map.set(p,f);}
    return map;
  }
  function summarize(rows){const counts={match:0,changed:0,missing:0,unlisted:0,error:0};rows.forEach(r=>counts[r.status]++);return counts;}
  function reportCSV(rows){const q=s=>{s=String(s??'');if(/^[=+@\-\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return ['status,path,manifest,algorithm,expected,actual',...rows.map(r=>[r.status,r.path,r.manifest,r.algorithm,r.expected,r.actual].map(q).join(','))].join('\r\n');}
  root.ChecksumCore={parseManifest,selectedFiles,manifestName,encodePath,cleanPath,summarize,reportCSV};
})(typeof globalThis!=='undefined'?globalThis:this);
