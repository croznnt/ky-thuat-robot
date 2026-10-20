// A minimal orthographic 3D illustration, using the same joint positions as FK.
draw=function(){
const w=canvas.clientWidth,H=canvas.clientHeight,dpr=devicePixelRatio||1;
canvas.width=w*dpr;canvas.height=H*dpr;ctx.scale(dpr,dpr);
ctx.fillStyle='#000000';ctx.fillRect(0,0,w,H);
const [h,l,m]=g(),a=q[0]*R,b=q[1]*R,reach=l+m;
const scale=Math.min(w*.42,H*.43)/(reach+h*.5);
const base=[0,0,0],shoulder=[0,0,h],elbow=[l*Math.cos(b)*Math.cos(a),l*Math.cos(b)*Math.sin(a),h+l*Math.sin(b)],end=Kinematics.fk(q,g());
function project([x,y,z]){
if(view==='side')return[w*.40+(x*Math.cos(a)+y*Math.sin(a))*scale,H*.66-(z-h/2)*scale];
if(view==='top')return[w/2+x*scale,H/2-y*scale];
return[w*.43+(x*Math.cos(yaw)-y*Math.sin(yaw))*scale,H*.64+((x*Math.sin(yaw)+y*Math.cos(yaw))*Math.sin(pitch)-(z-h/2)*Math.cos(pitch))*scale];
}
function line(A,B,color,width=2,dash=[]){A=project(A);B=project(B);ctx.beginPath();ctx.moveTo(...A);ctx.lineTo(...B);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function label(p,text,color,dx=13,dy=-13){const v=project(p);ctx.font='600 13px system-ui';ctx.fillStyle=color;ctx.fillText(text,v[0]+dx,v[1]+dy);}
function joint(p,color,size){const v=project(p);ctx.beginPath();ctx.arc(...v,size,0,Math.PI*2);ctx.fillStyle='#111820';ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();}
function box(A,B,width,colors){
const d=B.map((v,i)=>v-A[i]),len=Math.hypot(...d);if(len<1e-9)return;
const u=d.map(v=>v/len),ref=Math.abs(u[2])>.9?[1,0,0]:[0,0,1];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
let v=cross(u,ref),vl=Math.hypot(...v);v=v.map(x=>x/vl);const n=cross(u,v);
const corners=[];for(const p of [A,B])for(const [s,t] of [[-1,-1],[1,-1],[1,1],[-1,1]])corners.push(p.map((x,i)=>x+width*.5*(s*v[i]+t*n[i])));
const depth=p=>view==='top'?p[2]:view==='side'?p[0]*Math.sin(a)-p[1]*Math.cos(a):(p[0]*Math.sin(yaw)+p[1]*Math.cos(yaw))*Math.cos(pitch)+p[2]*Math.sin(pitch);
const faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
faces.map((ids,i)=>({ids,i,z:ids.reduce((sum,j)=>sum+depth(corners[j]),0)/4})).sort((a,b)=>a.z-b.z).forEach(({ids,i})=>{ctx.beginPath();ids.forEach((j,k)=>{const p=project(corners[j]);if(k)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.closePath();ctx.fillStyle=colors[i%colors.length];ctx.fill();ctx.strokeStyle=colors[0];ctx.lineWidth=1;ctx.stroke();});
}
// A single ground outline and a dashed projection keep depth easy to read.
const s=reach*.5;line([-s,-s,0],[s,-s,0],'#25313b');line([s,-s,0],[s,s,0],'#25313b');line([s,s,0],[-s,s,0],'#25313b');line([-s,s,0],[-s,-s,0],'#25313b');
const t=reach*.65;[[[t,0,0],'#cc5761','X'],[[0,t,0],'#268769','Y'],[[0,0,t],'#4b86ba','Z']].forEach(([p,c,n])=>{line(base,p,c,1.5);label(p,n,c,5,-5);});
line(end,[end[0],end[1],0],'#617483',1.5,[4,5]);
box([0,0,-reach*.025],[0,0,reach*.025],reach*.18,['#a5b5c5','#5a6b7b','#354656']);
box(base,shoulder,reach*.045,['#c4d0dc','#718596','#465b6c']);
box(shoulder,elbow,reach*.055,['#ffc16a','#e99536','#9a581b']);
box(elbow,end,reach*.05,['#82def8','#35a8cf','#1d627c']);
joint(base,'#74899b',10);joint(shoulder,'#d6812c',10);joint(elbow,'#288da8',10);joint(end,'#099a7c',6);
label(base,'q₁ · Đế','#c4d0dc',15,20);label(shoulder,'q₂ · Vai','#ffc16a');label(elbow,'q₃ · Khuỷu','#82def8');label(end,'P','#62efc2');
const middle=(A,B)=>A.map((v,i)=>(v+B[i])/2);
label(middle(shoulder,elbow),'L₁','#ffc16a',-22,-12);label(middle(elbow,end),'L₂','#82def8',8,22);
if(target){const v=project(target);ctx.beginPath();ctx.arc(...v,12,0,Math.PI*2);ctx.strokeStyle='#c75e9d';ctx.lineWidth=2;ctx.stroke();label(target,'Đích','#b34d8b',15,22);}
ctx.font='12px system-ui';ctx.fillStyle='#6e8597';ctx.fillText('Kéo chuột để xoay hình · Đế → Vai → Khuỷu → P',20,H-18);
};draw();
