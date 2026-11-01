import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {CENTRO} from '../data/mock';
const icon=a=>L.divIcon({className:'',html:`<span class="pin ${a?'ac':''}"></span>`,iconSize:[28,28],iconAnchor:[14,28]});
export default function Mapa({pins=[],onPin,pick,onPick}){const el=useRef(),map=useRef(),layer=useRef(),marker=useRef(),callbacks=useRef({onPin,onPick}),[error,setError]=useState(false);callbacks.current={onPin,onPick};
useEffect(()=>{const m=L.map(el.current).setView(CENTRO,16);map.current=m;L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).on('tileerror',()=>setError(true)).addTo(m);layer.current=L.layerGroup().addTo(m);m.on('click',e=>callbacks.current.onPick?.([e.latlng.lat,e.latlng.lng]));return()=>{m.remove();marker.current=null}},[]);
useEffect(()=>{layer.current.clearLayers();pins.forEach(o=>L.marker(o.pos,{icon:icon(o.acess),title:o.tipo,alt:o.tipo}).on('click',()=>callbacks.current.onPin?.(o)).addTo(layer.current))},[pins]);
useEffect(()=>{if(!pick)return;if(!marker.current){marker.current=L.marker(pick,{draggable:true,icon:icon(false)}).addTo(map.current);marker.current.on('dragend',()=>{const p=marker.current.getLatLng();callbacks.current.onPick?.([p.lat,p.lng])})}else marker.current.setLatLng(pick);map.current.panTo(pick)},[pick]);
return <><div ref={el} className="map" aria-label="Mapa de ocorrências"/>{error&&<small role="status" className="map-warning">Não foi possível carregar parte do mapa. Verifique sua conexão; a lista continua disponível na tela inicial.</small>}</>}
