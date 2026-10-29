export const TIPOS=['Buraco na via','Calçada danificada','Ausência de rampa','Degrau','Piso tátil ausente','Vaga de idoso/PCD inexistente','Obstáculo em passeio','Lixo ou entulho','Iluminação','Alagamento recorrente'];
export const PERFIS=['Cadeirante','Mobilidade reduzida','Baixa visão','Idoso'];
export const GRAVIDADES=['Leve','Moderada','Grave']; // RF10 — rótulos iguais ao enum Gravidade do back-end
export const DESC_MAX=1000; // RF11 — mesmo limite do @Size(max=1000) em ClassificacaoOcorrencia
export const REGIOES={Centro_Sul:[220,18,30],Pampulha:[140,22,12],Venda_Nova:[95,31,8],Barreiro:[120,27,10],Leste:[80,19,15]}; // [abertas, dias sem resposta, resolvidas 30d] — dados fictícios
export const CENTRO=[-19.9208,-43.9378];
export const SEED=[
{id:1,tipo:'Calçada danificada',grav:'Moderada',acess:true,status:'Aberta',pos:[-19.9215,-43.9385],dias:21,conf:8,data:'16/09/2026',end:'Av. Afonso Pena, 1500',autor:'Você'},
{id:2,tipo:'Ausência de rampa',grav:'Grave',acess:true,status:'Aberta',pos:[-19.9190,-43.9350],dias:9,conf:4,data:'28/09/2026',end:'Rua da Bahia, 900',autor:'Outro'},
{id:3,tipo:'Buraco na via',grav:'Leve',acess:false,status:'Aberta',pos:[-19.9235,-43.9410],dias:45,conf:12,data:'22/08/2026',end:'Av. do Contorno, 3000',autor:'Você'},
{id:4,tipo:'Lixo ou entulho',grav:'Leve',acess:false,status:'Resolvida',pos:[-19.9170,-43.9420],dias:3,conf:20,data:'01/10/2026',end:'Rua Sergipe, 120',autor:'Outro'}];
export const dist=([a,b],[c,d])=>{const r=Math.PI/180,x=(d-b)*r*Math.cos((a+c)*r/2),y=(c-a)*r;return 6371000*Math.hypot(x,y)};
