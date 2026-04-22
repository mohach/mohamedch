import"./hoisted.ClVB9oV8.js";const d=document.getElementById("contactForm");document.getElementById("submitBtn");d?.addEventListener("submit",e=>{e.preventDefault();const t=document.getElementById("name").value,n=document.getElementById("email").value,o=document.getElementById("subject").value,m=document.getElementById("message").value,c=`mailto:tu@email.com?subject=${encodeURIComponent(o||"Contacto desde web")}&body=${encodeURIComponent(`Nombre: ${t}
Email: ${n}

${m}`)}`;window.location.href=c});
