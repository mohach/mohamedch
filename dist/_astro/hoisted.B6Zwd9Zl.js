import"./hoisted.ClVB9oV8.js";document.addEventListener("DOMContentLoaded",()=>{function d(){const e=document.createElement("div");e.id="printLoader",e.innerHTML=`
          <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;">
            <div style="background:white;padding:2rem;border-radius:12px;text-align:center;max-width:400px;">
              <div style="font-size:3rem;margin-bottom:1rem;">🖨️</div>
              <h3 style="margin:0 0 1rem 0;">Preparing print...</h3>
              <p style="color:#666;margin:0 0 1.5rem 0;">This may take a few seconds. Select <strong>"Save as PDF"</strong> as printer.</p>
              <div style="display:flex;gap:0.5rem;justify-content:center;">
                <button onclick="document.getElementById('printLoader').remove();" style="padding:8px 16px;border:1px solid #ddd;background:white;border-radius:6px;cursor:pointer;">Cancel</button>
              </div>
            </div>
          </div>
        `,document.body.appendChild(e),setTimeout(()=>{document.getElementById("printLoader")&&document.getElementById("printLoader").remove()},1e4)}function n(){d(),document.body.classList.add("print-mode"),setTimeout(()=>{window.print(),setTimeout(()=>{document.getElementById("printLoader")&&document.getElementById("printLoader").remove(),document.body.classList.remove("print-mode")},1e3)},100)}document.querySelectorAll('[onclick="window.print()"]').forEach(e=>{e.removeAttribute("onclick"),e.addEventListener("click",t=>{t.preventDefault(),n()})}),document.querySelectorAll('a[href^="javascript:window.print"]').forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),n()})}),window.addEventListener("beforeprint",()=>{document.body.classList.add("printing"),document.getElementById("printLoader")&&document.getElementById("printLoader").remove()}),window.addEventListener("afterprint",()=>{document.body.classList.remove("printing"),document.body.classList.remove("print-mode")})});
