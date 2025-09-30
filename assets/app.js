/* ========================= assets/app.js ========================= */
// Build the gallery from images/manifest.json
(function(){
  const grid = document.getElementById('gallery-grid');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  fetch('images/manifest.json')
    .then(r => r.json())
    .then(data => {
      const items = (data && Array.isArray(data.images)) ? data.images : [];
      items.forEach((it, idx) => {
        const tile = document.createElement('a');
        tile.className = 'tile';
        tile.href = it.src;
        tile.dataset.index = idx;
        tile.innerHTML = `<img loading="lazy" src="${it.src}" alt="${it.alt || ''}"><div class="caption">${it.caption || ''}</div>`;
        grid.appendChild(tile);
      });
      setupLightbox(items);
    })
    .catch(() => {
      grid.innerHTML = '<p style="color:#9fb3c8">Add your screenshots to <code>/images</code> and list them in <code>images/manifest.json</code>.</p>';
    });

  function setupLightbox(items){
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="frame">
        <button class="lb-btn lb-close" title="Close">✕</button>
        <button class="lb-btn lb-prev" title="Previous">◀</button>
        <img id="lb-img" src="" alt=""/>
        <button class="lb-btn lb-next" title="Next">▶</button>
        <div class="lb-caption"></div>
      </div>`;
    document.body.appendChild(lb);

    const img = lb.querySelector('#lb-img');
    const cap = lb.querySelector('.lb-caption');
    let i = 0;

    function show(idx){
      i = (idx + items.length) % items.length;
      img.src = items[i].src;
      img.alt = items[i].alt || '';
      cap.textContent = items[i].caption || '';
      lb.classList.add('open');
    }

    document.addEventListener('click', e => {
      const a = e.target.closest('a.tile');
      if (!a) return;
      e.preventDefault();
      const idx = Number(a.dataset.index || 0);
      show(idx);
    });

    lb.addEventListener('click', e => {
      if (e.target.classList.contains('lightbox')) lb.classList.remove('open');
    });
    lb.querySelector('.lb-close').onclick = () => lb.classList.remove('open');
    lb.querySelector('.lb-prev').onclick = () => show(i - 1);
    lb.querySelector('.lb-next').onclick = () => show(i + 1);
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }
})();
