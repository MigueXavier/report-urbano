import {useEffect,useRef} from 'react';import L from 'leaflet';import 'leaflet/dist/leaflet.css';import {CENTRO} from '../data/mock';
const icon=a=>L.divIcon({className:'',html:`<span class="pin ${a?'ac':''}"></span>`,iconSize:[28,28],iconAnchor:[14,28]});
export default function Mapa({pins=[],onPin,pick,onPick}){
 const el=useRef(),lay=useRef();
 useEffect(()=>{const m=L.map(el.current,{zoomControl:false}).setView(pick||CENTRO,16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(m);
  lay.current=L.layerGroup().addTo(m);
  if(pick){const k=L.marker(pick,{draggable:true,icon:icon(false)}).addTo(m);k.on('dragend',()=>{const p=k.getLatLng();onPick([p.lat,p.lng])})}
 // eslint-disable-next-line react-hooks/exhaustive-deps
  return()=>m.remove()},[]);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 useEffect(()=>{lay.current.clearLayers();pins.forEach(o=>L.marker(o.pos,{icon:icon(o.acess),title:o.tipo,alt:o.tipo}).on('click',()=>onPin?.(o)).addTo(lay.current))},[pins]);
 return <div ref={el} className="map" role="application" aria-label="Mapa de ocorrências"/>}
