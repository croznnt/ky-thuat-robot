(function(root){
const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
function fk(q,g){const [a,b,c]=q.map(rad),[h,l,m]=g,r=l*Math.cos(b)+m*Math.cos(b+c);return [r*Math.cos(a),r*Math.sin(a),h+l*Math.sin(b)+m*Math.sin(b+c)];}
function ik(p,g,base=0){const [x,y,z]=p,[h,l,m]=g,r=Math.hypot(x,y),s=z-h,d=(r*r+s*s-l*l-m*m)/(2*l*m);if(d>1+1e-9||d< -1-1e-9)return [];const a=r<1e-9?rad(base):Math.atan2(y,x),v=Math.acos(Math.max(-1,Math.min(1,d)));return [v,-v].map(c=>[deg(a),deg(Math.atan2(s,r)-Math.atan2(m*Math.sin(c),l+m*Math.cos(c))),deg(c)]);}
const api={fk,ik};if(typeof module!=='undefined')module.exports=api;root.Kinematics=api;
})(typeof window==='undefined'?globalThis:window);
