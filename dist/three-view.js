(()=>{
const canvas=$('scene');let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(error){$('viewHint').textContent='Không thể khởi tạo WebGL. Hãy bật tăng tốc đồ họa của trình duyệt.';return;}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.setClearColor(0x000000);renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,1,20000);
camera.up.set(0,0,1);
scene.add(new THREE.HemisphereLight(0xffffff,0x526477,2));
const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(300,-400,700);scene.add(light);
const robot=new THREE.Group();scene.add(robot);
const boxGeo=new THREE.BoxGeometry(1,1,1),sphereGeo=new THREE.SphereGeometry(1,24,16),cylinderGeo=new THREE.CylinderGeometry(1,1,1,32);
const material=color=>new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.15});
const gray=material(0x8093a8),orange=material(0xffac4e),blue=material(0x49bce6),green=material(0x4ff0bf),jointMat=material(0xdce8f3);
function mesh(geo,mat){const x=new THREE.Mesh(geo,mat);robot.add(x);return x;}
const foot=mesh(boxGeo,gray),column=mesh(boxGeo,gray),upper=mesh(boxGeo,orange),fore=mesh(boxGeo,blue);
const baseJoint=mesh(cylinderGeo,gray),shoulderJoint=mesh(cylinderGeo,jointMat),elbowJoint=mesh(cylinderGeo,jointMat),tip=mesh(sphereGeo,green);
const goal=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshBasicMaterial({color:0xff78c6,wireframe:true}));scene.add(goal);
const axes=new THREE.AxesHelper(1);scene.add(axes);
const warning=document.createElement('div');warning.id='groundWarning';warning.setAttribute('role','status');warning.setAttribute('aria-live','polite');warning.style.cssText='margin:0 20px 18px;padding:13px 16px;border:1px solid #287963;border-radius:10px;background:#102b23;color:#8aefcc;font-size:14px';canvas.parentNode.insertBefore(warning,canvas.nextSibling);
const danger=material(0xff394c);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0x17222c,transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}));scene.add(floor);
const monitored=[[upper,orange,'Khâu L₁'],[fore,blue,'Khâu L₂'],[shoulderJoint,jointMat,'Khớp vai'],[elbowJoint,jointMat,'Khớp khuỷu'],[tip,green,'Đầu công tác']];
const bounds=new THREE.Box3();
let grid=null,gridSize=0,zoom=1,drag=null;const center=new THREE.Vector3();
const labels=[];
function label(text,color){const c=document.createElement('canvas');c.width=256;c.height=64;const c2=c.getContext('2d');c2.font='600 25px system-ui';c2.fillStyle=color;c2.fillText(text,8,43);const texture=new THREE.CanvasTexture(c),sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));scene.add(sprite);labels.push(sprite);return sprite;}
const tags=[label('q₁ · Đế','#dce8f3'),label('q₂ · Vai','#ffc16a'),label('q₃ · Khuỷu','#82def8'),label('P','#62efc2')];
const axisTags=[label('X','#ff705f'),label('Y','#72ef8f'),label('Z','#72a8ff')];
function bar(object,A,B,width){object.position.copy(A).add(B).multiplyScalar(.5);const d=new THREE.Vector3().subVectors(B,A);object.scale.set(width,width,d.length());object.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),d.normalize());}
function joint(object,p,axis,radius){object.position.copy(p);object.scale.set(radius,radius*.65,radius);object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axis);}
draw=function(){
if(!valid())return;
const [h,l,m]=g(),a=q[0]*R,b=q[1]*R,reach=l+m;
const O=new THREE.Vector3(),S=new THREE.Vector3(0,0,h),E=new THREE.Vector3(l*Math.cos(b)*Math.cos(a),l*Math.cos(b)*Math.sin(a),h+l*Math.sin(b)),P=new THREE.Vector3(...Kinematics.fk(q,g()));
const width=Math.max(reach*.045,3),axis=new THREE.Vector3(-Math.sin(a),Math.cos(a),0);
foot.position.set(0,0,-width*.65);foot.scale.set(width*4,width*4,width);
bar(column,O,S,width);bar(upper,S,E,width);bar(fore,E,P,width*.85);
joint(baseJoint,O,new THREE.Vector3(0,0,1),width*1.1);joint(shoulderJoint,S,axis,width);joint(elbowJoint,E,axis,width*.9);
tip.position.copy(P);tip.scale.setScalar(width*.55);
const groundZ=-width*1.2;
floor.position.z=groundZ-.05;floor.scale.set(reach*2,reach*2,1);
robot.updateMatrixWorld(true);
const measurements=monitored.map(([object,normal,name])=>{bounds.setFromObject(object);const clearance=bounds.min.z-groundZ;object.material=clearance<=.01?danger:normal;return {name,clearance};});
const lowest=Math.min(...measurements.map(x=>x.clearance)),hits=measurements.filter(x=>x.clearance<=.01),near=lowest<=10;
if(hits.length){warning.textContent='⚠ Chạm nền: '+hits.map(x=>x.name).join(', ')+'. '+(lowest<-.01?'Xuyên nền '+(-lowest).toFixed(1)+' mm.':'Đang tiếp xúc mặt nền.')+' Điều chỉnh góc khớp hoặc điểm đích.';warning.style.background='#3a1119';warning.style.color='#ffb6bf';warning.style.borderColor='#e04b61';floor.material.color.setHex(0x641d2b);}
else{warning.textContent=(near?'⚠ Gần nền: ':'✓ Không chạm nền. ')+'Khoảng hở thấp nhất '+lowest.toFixed(1)+' mm.';warning.style.background=near?'#35280d':'#102b23';warning.style.color=near?'#ffda83':'#8aefcc';warning.style.borderColor=near?'#b58a28':'#287963';floor.material.color.setHex(near?0x51421b:0x17222c);}
warning.title='Kiểm tra thể tích các khâu, khớp vai, khuỷu và đầu công tác so với mặt lưới nền. Đế và trụ cố định được loại khỏi kiểm tra. Chỉ cảnh báo, không tự dừng chuyển động.';
goal.visible=mode==='ik'&&target!==null;if(goal.visible){goal.position.set(...target);goal.scale.setScalar(width*.95);}
axes.scale.setScalar(reach*.65);
if(gridSize!==reach){if(grid){scene.remove(grid);grid.geometry.dispose();grid.material.dispose();}grid=new THREE.GridHelper(reach*2,10,0x34404b,0x17212a);grid.rotation.x=Math.PI/2;grid.position.z=-width*1.2;scene.add(grid);gridSize=reach;}
[O,S,E,P].forEach((p,i)=>{tags[i].position.copy(p).add(new THREE.Vector3(width*2,0,width*1.8));tags[i].scale.set(reach*.28,reach*.07,1);});
axisTags.forEach((tag,i)=>{tag.position.set(i===0?reach*.72:0,i===1?reach*.72:0,i===2?reach*.72:0);tag.scale.set(reach*.13,reach*.0325,1);});
center.set(0,0,h*.6);const distance=(reach+h*.7)*2.25*zoom;
if(view==='top'){camera.up.set(0,1,0);camera.position.set(0,0,center.z+distance);}else if(view==='side'){camera.up.set(0,0,1);camera.position.set(center.x+Math.sin(a)*distance,center.y-Math.cos(a)*distance,center.z);}else{camera.up.set(0,0,1);camera.position.set(center.x+distance*Math.cos(pitch)*Math.sin(yaw),center.y-distance*Math.cos(pitch)*Math.cos(yaw),center.z+distance*Math.sin(pitch));}
camera.lookAt(center);camera.near=Math.max(.01,distance/1000);camera.far=distance*20;
const w=canvas.clientWidth,H=canvas.clientHeight;renderer.setSize(w,H,false);camera.aspect=w/H;camera.updateProjectionMatrix();renderer.render(scene,camera);
};
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{view=button.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('selected',x===button));$('viewHint').textContent=view==='3d'?'Three.js · Kéo để xoay, cuộn để phóng to':'Three.js · '+(view==='side'?'Mặt bên':'Mặt trên');draw();});
canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag||view!=='3d')return;yaw-=(e.clientX-drag[0])*.008;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];draw();});
for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>drag=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.45,Math.min(3,zoom*Math.exp(e.deltaY*.001)));draw();},{passive:false});
new ResizeObserver(()=>draw()).observe(canvas);$('viewHint').textContent='Three.js · Kéo để xoay, cuộn để phóng to';draw();
})();
