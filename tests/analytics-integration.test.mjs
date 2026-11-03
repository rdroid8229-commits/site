import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const xml=readFileSync('blogger/downloads/RN-Grafica-Rapida-Blogger.xml','utf8');
const scripts=[...xml.matchAll(/<script type='text\/javascript'>\s*\/\/<!\[CDATA\[([\s\S]*?)\/\/\]\]>\s*<\/script>/g)].map(m=>m[1]);
function execute({nativeTag=false,nativeConfig=false}={}){
 const dataLayer=[];const appended=[];
 const document={querySelector(selector){return nativeTag&&selector.includes('googletagmanager.com/gtag/js')?{src:'https://www.googletagmanager.com/gtag/js?id=G-95RKPEGCS9'}:null},createElement(){return {}},head:{appendChild(tag){appended.push(tag)}}};
 const window={dataLayer};
 runInNewContext(scripts[0],{window,document,Date});
 if(nativeConfig)dataLayer.push(['config','G-95RKPEGCS9']);
 runInNewContext(scripts[1],{window,document,Date});
 return {dataLayer,appended,window};
}
test('sem integração nativa, carrega e configura GA4 uma vez',()=>{
 const s=execute();
 assert.equal(s.appended.length,1);
 assert.equal(s.dataLayer.filter(x=>x[0]==='config').length,1);
});
test('com tag nativa, não injeta tag nem configuração duplicada',()=>{
 const s=execute({nativeTag:true,nativeConfig:true});
 assert.equal(s.appended.length,0);
 assert.equal(s.dataLayer.filter(x=>x[0]==='config').length,1);
});
test('com config já enfileirado, não duplica configuração',()=>{
 const s=execute({nativeConfig:true});
 assert.equal(s.appended.length,0);
 assert.equal(s.dataLayer.filter(x=>x[0]==='config').length,1);
});
test('Consent Mode negado continua antes de qualquer configuração',()=>{
 const s=execute();
 assert.equal(s.dataLayer[0][0],'consent');
 assert.equal(s.dataLayer[0][2].analytics_storage,'denied');
});
test('limpeza de cookies não tenta domínios pais',()=>{
 const source=readFileSync('src/privacy-consent.js','utf8');
 assert.doesNotMatch(source,/parts\.slice\(i\)\.join/);
 assert.match(source,/\['', host\]/);
});
