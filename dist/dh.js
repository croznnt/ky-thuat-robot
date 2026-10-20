(()=>{
const panel=document.createElement('section');panel.className='details';document.querySelector('.layout > div').appendChild(panel);
panel.innerHTML=`<h2>Tính toán theo Denavit–Hartenberg chuẩn</h2><p class="matrix-note">Quy ước DH chuẩn: Aᵢ = Rz(θᵢ) · Tz(dᵢ) · Tx(aᵢ) · Rx(αᵢ). Mỗi hàng mô tả một khớp quay. Góc dùng độ, chiều dài dùng mm.</p><label style="justify-content:flex-start;gap:10px"><input id="dhCustom" type="checkbox"> Nhập bảng DH tùy chỉnh</label><p id="dhMode" class="matrix-note"></p><div style="overflow:auto"><table class="dh-input"><thead><tr><th>Khớp i</th><th>θᵢ (độ)</th><th>dᵢ (mm)</th><th>aᵢ (mm)</th><th>αᵢ (độ)</th></tr></thead><tbody id="dhRows"></tbody></table></div><div class="actions"><button id="dhReset">Lấy tham số robot hiện tại</button></div><div class="formula" style="margin-top:15px">Aᵢ = ⎡ cosθ  −sinθ cosα   sinθ sinα   a cosθ ⎤
     ⎢ sinθ   cosθ cosα  −cosθ sinα   a sinθ ⎥
     ⎢  0       sinα        cosα        d    ⎥
     ⎣  0         0           0         1    ⎦

T₀₃ = A₁ · A₂ · A₃</div><div id="dhOutput" aria-live="polite"></div>`;
const style=document.createElement('style');style.textContent='.dh-input{width:100%;border-collapse:collapse;margin:15px 0}.dh-input th,.dh-input td{padding:9px;border-bottom:1px solid #dce4ec;text-align:left}.dh-input input{width:95px}.dh-input input:disabled{background:#edf3f7;color:#36566f;opacity:1}';document.head.appendChild(style);
const f=x=>Math.abs(x)<.0000005?'0':Number(x.toFixed(5)).toString();
const table=(name,M)=>`<div class="matrix-block"><b>${name}</b><table class="matrix-table"><tbody>${M.map(row=>'<tr>'+row.map(n=>'<td>'+f(n)+'</td>').join('')+'</tr>').join('')}</tbody></table></div>`;
const multiply=(A,B)=>A.map(row=>B[0].map((_,j)=>row.reduce((sum,n,k)=>sum+n*B[k][j],0)));
function matrix([theta,d,a,alpha]){const t=theta*Math.PI/180,r=alpha*Math.PI/180,c=Math.cos(t),s=Math.sin(t),ca=Math.cos(r),sa=Math.sin(r);return [[c,-s*ca,s*sa,a*c],[s,c*ca,-c*sa,a*s],[0,sa,ca,d],[0,0,0,1]];}
const preset=()=>{const [h,l,m]=g();return [[q[0],h,0,90],[q[1],0,l,0],[q[2],0,m,0]];};
function populate(){const rows=preset();$('dhRows').innerHTML=rows.map((row,i)=>'<tr><th>'+(i+1)+'</th>'+row.map((n,j)=>`<td><input type="number" step="any" aria-label="DH khớp ${i+1}, ${['theta','d','a','alpha'][j]}" value="${n}" data-i="${i}" data-j="${j}"></td>`).join('')+'</tr>').join('');}
function calculate(){
const custom=$('dhCustom').checked,rows=preset();let bad=false;
panel.querySelectorAll('[data-i]').forEach(input=>{input.disabled=!custom;if(custom){const n=Number(input.value);if(!input.value.trim()||!Number.isFinite(n))bad=true;rows[Number(input.dataset.i)][Number(input.dataset.j)]=n;}else input.value=rows[Number(input.dataset.i)][Number(input.dataset.j)];});
$('dhMode').textContent=custom?'Bảng tùy chỉnh chỉ dùng cho tính ma trận, không thay đổi mô hình 3D hoặc bộ giải ngược của robot hiện tại.':'Đồng bộ robot: hàng 1 có d₁ = h, α₁ = 90°; hàng 2 có a₂ = L₁; hàng 3 có a₃ = L₂. Các θᵢ bằng qᵢ.';
if(bad){$('dhOutput').textContent='Vui lòng nhập đầy đủ các tham số hữu hạn.';return;}
const [A,B,C]=rows.map(matrix),AB=multiply(A,B),T=multiply(AB,C);
if(T.flat().some(n=>!Number.isFinite(n))){$('dhOutput').textContent='Giá trị quá lớn để tính toán. Hãy giảm độ lớn tham số.';return;}
const p=Kinematics.fk(q,g()),err=Math.hypot(...p.map((v,i)=>v-T[i][3]));
$('dhOutput').innerHTML=`<div class="matrix-step"><h3>1. Thế tham số vào ma trận DH</h3><div class="matrix-flow">${table('A₁ = T₀₁ (DH)',A)}${table('A₂ = T₁₂ (DH)',B)}${table('A₃ = T₂₃ (DH)',C)}</div></div><div class="matrix-step"><h3>2. Nhân ma trận</h3>${table('T₀₂ = A₁ × A₂',AB)}${table('T₀₃ = T₀₂ × A₃',T)}</div><div class="matrix-step"><h3>3. Kết quả vị trí đầu công tác</h3><div class="formula">X = ${f(T[0][3])} mm\nY = ${f(T[1][3])} mm\nZ = ${f(T[2][3])} mm</div><p class="matrix-note">${custom?'Đây là kết quả của bảng DH tùy chỉnh.':'Sai lệch so với bộ tính hình học: '+err.toExponential(2)+' mm. Hệ trục trung gian DH khác quy ước ở phần trước, nhưng ma trận tổng T₀₃ giống nhau.'}</p></div>`;
}
populate();$('dhCustom').onchange=calculate;$('dhReset').onclick=()=>{$('dhCustom').checked=false;calculate();};$('dhRows').oninput=calculate;
const previousRender=render;render=function(){previousRender();if(valid())calculate();};calculate();
// Expose pure operations for numerical verification.
window.DHMath={matrix,multiply};
})();
