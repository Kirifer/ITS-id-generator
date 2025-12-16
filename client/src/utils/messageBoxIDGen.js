export const showMessageBoxIdGen = (message, onClose) => {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background-color: rgba(0,0,0,.5);
    z-index: 9998; display:flex; align-items:center; justify-content:center;`;
  
  const box = document.createElement('div');
  box.style.cssText = `
    background:white; padding:20px 30px; border-radius:10px;
    box-shadow:0 4px 12px rgba(0,0,0,.15); text-align:center; 
    font-family:'Poppins',sans-serif; z-index:9999;`;
  
  const p = document.createElement('p');
  p.textContent = message;
  p.style.cssText = `font-size:1rem; margin-bottom:10px; color:#000; font-weight:300;`;
  
  const btn = document.createElement('button');
  btn.textContent = 'Close';
  btn.style.cssText = `
    padding: 8px 16px; background-color: #8A2BE2; color: white; border: none;
    border-radius: 5px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 500;
  `;
  
  btn.addEventListener('click', () => {
    overlay.remove();
    if (typeof onClose === 'function') onClose();
  });
  
  box.appendChild(p);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
};