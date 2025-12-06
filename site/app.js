const modelUrlInput = document.getElementById('modelUrl');
status.textContent = 'Przewidywanie...';
const predictions = await model.predict(img, false);
predictions.sort((a,b)=>b.probability-a.probability);
renderResults(predictions);
status.textContent = 'Gotowe.';
}


function renderResults(predictions) {
resultsWrap.innerHTML = '';
if (predictions.length===0) return;
const header = document.createElement('div');
header.className = 'top';
header.textContent = `Najlepsze: ${predictions[0].className} — ${(predictions[0].probability*100).toFixed(2)}%`;
resultsWrap.appendChild(header);
const list = document.createElement('ul');
predictions.forEach(p=>{
const li = document.createElement('li');
li.textContent = `${p.className}: ${(p.probability*100).toFixed(2)}%`;
list.appendChild(li);
});
resultsWrap.appendChild(list);
}


// drag & drop
dropZone.addEventListener('click', ()=>fileInput.click());
dropZone.addEventListener('dragover', e=>{e.preventDefault(); dropZone.style.borderColor='#9fb7e8'});
dropZone.addEventListener('dragleave', e=>{dropZone.style.borderColor='#d7e0ef'});
dropZone.addEventListener('drop', e=>{e.preventDefault(); dropZone.style.borderColor='#d7e0ef'; const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f){ fileInput.files = e.dataTransfer.files; handleFile(f);} });
fileInput.addEventListener('change', ()=>{ const f = fileInput.files && fileInput.files[0]; if (f) handleFile(f); });


function handleFile(file){ if (!file.type.startsWith('image/')) return; showPreview(file); if (auto && lastImage) predictImage(lastImage); }


loadBtn.addEventListener('click', ()=>{ const url = modelUrlInput.value.trim(); if (!url){ status.textContent='Wprowadź URL do katalogu modelu.'; return; } const normalized = url.endsWith('/') ? url : url + '/'; loadModel(normalized); });
predictBtn.addEventListener('click', ()=>{ if (!lastImage){ status.textContent='Brak obrazu do przewidzenia.'; return; } predictImage(lastImage); });
autoBtn.addEventListener('click', ()=>{ auto = !auto; autoBtn.textContent = `Auto: ${auto? 'ON':'OFF'}`; if (auto && lastImage) predictImage(lastImage); });
clearBtn.addEventListener('click', ()=>{ preview.src=''; previewWrap.style.display='none'; resultsWrap.innerHTML=''; status.textContent = model ? 'Model załadowany.' : 'Model nie wczytany.'; fileInput.value = null; lastImage = null; });


// paste image from clipboard
window.addEventListener('paste', (e)=>{ const items = e.clipboardData && e.clipboardData.items; if (!items) return; for (let i=0;i<items.length;i++){ const it = items[i]; if (it.type && it.type.startsWith('image/')){ const file = it.getAsFile(); handleFile(file); break; } } });