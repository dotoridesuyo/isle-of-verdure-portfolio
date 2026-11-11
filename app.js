'use strict';
const $ = s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={selected:PLANTS[1],rarity:'',region:'',size:'',search:'',stage:STAGES.length-1,detailTab:'cultivation',animalId:'A001',animalFacing:'down',animalPattern:'front2'};
function specimen(p,extra=''){return `<span class="specimen ${extra}" role="img" aria-label="${esc(p.name)} 콘셉트 그림" style="--x:${p.index%5*25}%;--y:${Math.floor(p.index/5)*50}%"></span>`;}
function badge(p){return `<span class="badge ${RARITY_CLASS[p.rarity]}">✧ ${p.rarity}</span>`;}
function filteredPlants(){return PLANTS.filter(p=>(!state.rarity||p.rarity===state.rarity)&&(!state.region||p.region===state.region)&&(!state.size||p.size===state.size)&&(!state.search||`${p.name} ${p.id}`.toLowerCase().includes(state.search.toLowerCase())));}
function renderGrid(){
  const plants=filteredPlants();
  $('#plant-grid').innerHTML=plants.length?plants.map(p=>`<button class="plant-card ${p.id===state.selected.id?'selected':''}" data-plant="${p.id}" aria-label="${p.name} ${p.rarity} ${p.size} 상세 보기" aria-pressed="${p.id===state.selected.id}"><span class="card-number">${p.id}</span><i class="rarity-dot ${RARITY_CLASS[p.rarity]}"></i>${specimen(p)}<span class="plant-name">${p.name}</span><span class="card-caption">${p.region}</span></button>`).join('')+(plants.length===15?Array.from({length:3},(_,i)=>`<div class="plant-slot" aria-hidden="true"><span>${i%3===0?'❧':i%3===1?'✧':'♧'}</span><small>to be continued</small></div>`).join(''):''):`<div class="empty-state"><span>❧</span><p>아직 이 페이지에는 없네요.</p><small>다른 이름이나 조건으로 찾아보세요.</small><button data-reset>필터 초기화</button></div>`;
  $('#filter-count').textContent=plants.length===15?'15종의 식물을 기록했습니다':`전체 15종 중 ${plants.length}종 표시`;
  $('#plant-count').textContent=plants.length;
}
function row(icon,label,value){return `<div class="info-row"><dt><span class="info-icon" aria-hidden="true">${icon}</span>${label}</dt><dd>${value}</dd></div>`;}
function detailContent(p){
 const b=PLANT_BRIEFS[p.id];
 if(state.detailTab==='cultivation')return `<dl>${row('♧','필요 재료',p.name+'의 씨앗 1개')}${row('▧','재배 방식','정화 → 밭갈기 → 파종 → 물주기')}${row('☼','재배 공간',p.size==='대형'?'2×2칸 또는 전용 식재 구역을 사용하는 배치안':'일반 텃밭 1칸')}${row('♧','물주기·성장','물을 주면 성장 시작 · 30초 후 성숙<br>게임 실행 중 다른 지역에서도 성장')}${row('⌖','발견 장소',p.region+(p.id==='P001'?'<br>구조한 첫 식물은 정원에서 재배':''))}</dl>`;
 if(state.detailTab==='harvest')return `<dl>${row('♧','기본 수확','수확물 1개 + 같은 종류 씨앗 2개')}${row('▧','다음 재배','수확 후 작물이 제거되고 일군 빈 밭 유지<br>씨앗 1개를 다시 심고 물주기')}${row('▤','활용 방향',esc(b.resource))}${p.id==='P002'?row('✧','특별 수집','새벽 이슬방울 · 특수 재료 예시<br>황금 이슬종꽃 · 희귀 변이 예시'):''}</dl>`;
 return `<dl>${row('⌖','발견과 역할',esc(b.acquisition))}${row('❧','식물의 개성',esc(b.role))}${row('◇','수집 기록','미발견 → 발견 → 수집 완료<br>특수 수확물과 변이는 별도 기록')}${row('▤','정보 공개','발견하면 필수 재배 정보를 확인<br>수집 기록에 따라 추가 정보 공개')}</dl>`;
}
function stageGraphic(p,i){
  if(i===0)return `<span class="stage-image"><span class="seed-art"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 32q-3-12 7-15 10 7 0 15Z" fill="#a78c62"/><path d="M13 24l7 5" stroke="#cfb88c" stroke-width="2"/></svg></span></span>`;
  if(i===1)return `<span class="stage-image"><span class="seed-art"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 35V19" stroke="#829766" stroke-width="3"/><path d="M20 25Q5 25 7 13Q20 12 20 25M21 20Q21 6 34 9Q35 21 21 20" fill="#a6b77c"/><path d="M21 20L30 13M19 23L11 17" stroke="#819563" fill="none"/></svg></span></span>`;
  return `<span class="stage-image">${specimen(p)}</span>`;
}
function stageDescription(p){const s=STAGES[state.stage];return `<b>${s.name} · ${s.range}</b><br>${s.text}<span class="stage-type-note">${p.type} · ${TYPE_STAGES[p.type][state.stage]}</span>`;}
function renderCultivationSummary(){const r=CULTIVATION_RULES;$('#common-cultivation-summary').innerHTML=`<div class="cultivation-summary-heading"><span>정원의 재배 흐름</span><a href="#chapter/03">시스템 기획 보기 ↗</a></div><dl><div><dt>재배 공간</dt><dd>농장 ${r.gardenPlots}칸 · 초원 ${r.meadowPlots}칸</dd></div><div><dt>성장 과정</dt><dd>씨앗 → 새싹 → 성장 → 성숙</dd></div><div><dt>돌봄과 변화</dt><dd>물주기 후 ${r.growthSeconds}초에 성숙</dd></div><div><dt>수확과 다음 시작</dt><dd>수확물 ${r.harvestYield} · 씨앗 ${r.seedYield} → 재파종</dd></div></dl>`;}
function renderDetail(){
 const p=state.selected;
 $('#plant-detail').innerHTML=`<div class="detail-topline"><p class="eyebrow">BOTANICAL RECORD / ${p.id}</p><span>섬의 식물 기록</span></div><div class="specimen-head"><div><p class="specimen-id">NO. ${String(p.index+1).padStart(3,'0')}</p><h2>${p.name}</h2><div class="species-tags">${badge(p)}<span class="badge neutral">${p.size} · ${p.size==='대형'?'2×2 / 전용':'1칸'}</span><span class="badge neutral">${p.region}</span></div></div><div class="hero-illustration">${specimen(p)}<span class="art-label">a concept specimen</span></div></div><p class="specimen-description">${esc(PLANT_BRIEFS[p.id].role)}</p><dl class="detail-facts"><div><dt>물 준 뒤 성숙</dt><dd class="fact-text">30초</dd></div><div><dt>수확 후 동작</dt><dd class="fact-text">다시 파종</dd></div><div><dt>기본 점유 공간</dt><dd>${p.size==='대형'?'2 × 2':'1'}<small>${p.size==='대형'?'또는 전용':'칸'}</small></dd></div></dl><div class="growth-preview"><div class="small-heading"><h3>성장 과정</h3><span>단계를 눌러 살펴보세요</span></div><div class="stage-track" role="group" aria-label="성장 단계 설명">${STAGES.map((s,i)=>`<button class="stage-button ${state.stage===i?'active':''}" data-stage="${i}" aria-label="${i+1}단계 ${s.name}" aria-pressed="${state.stage===i}">${stageGraphic(p,i)}<span>${s.name}</span><small>${s.caption}</small></button>`).join('')}</div><p class="stage-description" aria-live="polite">${stageDescription(p)}</p></div><div class="detail-tabs" role="tablist" aria-label="식물 상세 정보"><button role="tab" id="tab-cultivation" aria-controls="plant-tab-panel" data-detail-tab="cultivation" aria-selected="${state.detailTab==='cultivation'}" class="${state.detailTab==='cultivation'?'active':''}">재배 정보</button><button role="tab" id="tab-harvest" aria-controls="plant-tab-panel" data-detail-tab="harvest" aria-selected="${state.detailTab==='harvest'}" class="${state.detailTab==='harvest'?'active':''}">수확 · 활용</button><button role="tab" id="tab-ecology" aria-controls="plant-tab-panel" data-detail-tab="ecology" aria-selected="${state.detailTab==='ecology'}" class="${state.detailTab==='ecology'?'active':''}">생태 · 수집</button></div><div id="plant-tab-panel" class="detail-tab-panel" role="tabpanel" aria-labelledby="tab-${state.detailTab}">${detailContent(p)}</div><div class="detail-navigation"><button data-prev-plant ${p.index===0?'disabled':''}>← 이전 식물</button><span>${String(p.index+1).padStart(2,'0')} / 15</span><button data-next-plant ${p.index===14?'disabled':''}>다음 식물 →</button></div><div class="page-number"><span>BOTANICAL FIELD NOTES</span><a href="#chapter/06">— ${p.id} —</a></div>`;
 renderSpeciesSpec();
}
function selectPlant(id,scroll=false){const p=PLANTS.find(x=>x.id===id);if(!p)return;state.selected=p;state.stage=STAGES.length-1;state.detailTab='cultivation';renderGrid();renderDetail();if(scroll&&window.innerWidth<=650)$('#plant-detail').scrollIntoView({behavior:'smooth',block:'start'});}
function resetFilters(){state.rarity=state.region=state.size=state.search='';$('#plant-search').value='';$('#rarity-filter').value=$('#region-filter').value=$('#size-filter').value='';renderGrid();}
function speciesTable(){return `<div class="table-scroll"><table><thead><tr>${['ID','식물명','발견 지역','등급','크기','유형 시안'].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${PLANTS.map(p=>`<tr><td>${p.id}</td><td><a href="#plants/${p.id}">${p.name}</a></td><td>${p.region}</td><td>${badge(p)}</td><td>${p.size}</td><td>${p.type}</td></tr>`).join('')}</tbody></table></div>`;}
function sourceTag(){return '';}
function blockHeading(b){return `<div class="block-heading"><h3>${esc(b.title)}</h3>${sourceTag(b.source)}</div>`;}
function renderPlantBrief(p){const b=PLANT_BRIEFS[p.id];return `<section class="plant-brief"><header><span>${p.id}</span><h3>${p.name}</h3></header><dl>${Object.entries({'기획 역할':b.role,'발견과 재배':b.acquisition,'성장 연출':b.visual,'활용 방향':b.resource}).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>`;}
function renderSpeciesSpec(){const p=state.selected;$('#species-spec-content').innerHTML=`<details class="design-disclosure"><summary>${p.name}의 설계 포인트 <span>자세히 보기 ＋</span></summary>${renderPlantBrief(p)}</details>`;}
function animalSprite(a){return `<span class="animal-sprite" data-sprite-id="${a.id}" role="img" aria-label="${esc(a.name)} ${esc(a.species)} 캐릭터 시안" style="--ax:${a.index%5*25}%;--ay:${a.index<5?0:100}%"></span>`;}
function renderAnimalDossier(a){return `<article class="animal-dossier"><header><div><p class="eyebrow">${a.id} / ${esc(a.species)}</p><h3>${esc(a.name)} <small>${esc(a.title)}</small></h3><p class="animal-concept">${esc(a.concept)}</p></div>${animalSprite(a)}</header><dl>${Object.entries({'캐릭터 컨셉':a.personality,'외형 컨셉':a.appearance,'등장 컨셉':a.meeting,'배치 기준':'모서리 배치 · 전방 2칸 관리 · 식재 칸 점유 없음','주요 능력':a.primary,'적용 유형':a.mode,'대기·작동':a.animation,'소개 대사':a.memo}).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></article>`;}
function renderAnimalBook(){const selected=ANIMALS.find(a=>a.id===state.animalId)||ANIMALS[0];return `<div class="animal-roster"><div class="animal-live"><div class="animal-roster-caption"><span>정원 친구들 · 10종 캐릭터 시안</span><small>카드를 선택하면 성격·능력·연출을 확인할 수 있습니다.</small></div><div class="animal-grid" aria-label="동물 캐릭터 시안 목록">${ANIMALS.map(a=>`<button class="animal-card ${a.id===selected.id?'selected':''}" data-animal="${a.id}" aria-label="${esc(a.name)} ${esc(a.species)} ${esc(a.role)}" aria-pressed="${a.id===selected.id}"><small>${a.id}</small>${animalSprite(a)}<b>${esc(a.name)}</b><span>${esc(a.species)}</span><em>${esc(a.role)}</em></button>`).join('')}</div><p class="animal-art-note">종별 몸 구조 · 부드러운 선 · 따뜻한 볼터치 · 파스텔 손그림</p><div data-animal-selected aria-live="polite">${renderAnimalDossier(selected)}</div></div><div class="animal-print-list">${ANIMALS.map(renderAnimalDossier).join('')}</div></div>`;}
function selectAnimal(id,scroll=false){const a=ANIMALS.find(a=>a.id===id);if(!a)return;state.animalId=id;document.querySelectorAll('[data-animal]').forEach(b=>{const active=b.dataset.animal===id;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);});document.querySelectorAll('[data-animal-selected]').forEach(el=>el.innerHTML=renderAnimalDossier(a));if(scroll&&innerWidth<=650)document.querySelector('[data-animal-selected]')?.scrollIntoView({behavior:'smooth',block:'start'});}
function placementCells(facing,pattern){const base=pattern==='front4'?[[-1,0],[0,0],[-1,1],[0,1]]:pattern==='around4'?[[-1,-1],[0,-1],[-1,0],[0,0]]:[[-1,0],[0,0]];return base.map(([x,y])=>{const cx=x+.5,cy=y+.5;const [rx,ry]=facing==='up'?[-cx,-cy]:facing==='right'?[cy,-cx]:facing==='left'?[-cy,cx]:[cx,cy];return {row:Math.floor(ry)+2,col:Math.floor(rx)+2};});}
function renderPlacementDiagram(){const directions={up:'↑ 위',right:'→ 오른쪽',down:'↓ 아래',left:'← 왼쪽'};const cells=placementCells(state.animalFacing,state.animalPattern);const label=state.animalPattern==='front2'?'기본 규칙 · 전방 두 칸':state.animalPattern==='front4'?'확장 시안 · 전방 네 칸':'확장 시안 · 뒤쪽까지 네 칸';return `<div class="placement-diagram" data-placement-diagram><div class="placement-controls"><div><span>바라보는 방향</span><div class="direction-buttons" role="group" aria-label="동물 방향 선택">${Object.entries(directions).map(([id,name])=>`<button data-facing="${id}" aria-pressed="${state.animalFacing===id}">${name}</button>`).join('')}</div></div></div><div class="placement-scene"><div class="placement-grid" role="img" aria-label="동물은 가운데 꼭짓점에 위치. ${label}. 방향 ${directions[state.animalFacing]}">${Array.from({length:16},(_,i)=>{const row=Math.floor(i/4),col=i%4,active=cells.some(c=>c.row===row&&c.col===col);return `<div class="placement-cell ${active?'in-range':''}" data-range-cell data-active="${active}"><span>${active?'관리 대상':'식재 칸'}</span>${active?'<b aria-hidden="true">♧</b>':''}</div>`;}).join('')}<span class="corner-anchor" aria-label="동물 배치 꼭짓점">${directions[state.animalFacing].split(' ')[0]}</span></div><div class="placement-legend"><span><i></i> 관리 대상 ${cells.length}칸</span><span>● 동물은 칸 사이 꼭짓점</span></div></div><p class="placement-caption">${label}. 방향을 바꾸면 관리 대상도 함께 달라집니다.</p></div>`;}
function refreshPlacement(){document.querySelectorAll('[data-placement-diagram]').forEach(el=>el.outerHTML=renderPlacementDiagram());}
function renderAnimalSectionNav(){return '';}
function renderBlock(b){
 if(b.kind==='cards')return `<section class="doc-block"><div class="block-heading"><h3>${esc(b.title)}</h3></div><div class="design-cards">${b.items.map(i=>`<article><span aria-hidden="true">${i.icon}</span><h4>${esc(i.title)}</h4><p>${esc(i.text)}</p></article>`).join('')}</div></section>`;
 if(b.kind==='links')return `<div class="design-links">${b.items.map(i=>`<a href="${esc(i.href)}"><span><b>${esc(i.title)}</b><small>${esc(i.text)}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>`;
 if(b.kind==='disclosure')return `<details class="design-disclosure"><summary>${esc(b.title)}<span>펼쳐 보기 ＋</span></summary><div>${b.blocks.map(renderBlock).join('')}</div></details>`;
 if(b.kind==='paragraph')return `<p class="doc-paragraph">${esc(b.text)}</p>`;
 if(b.kind==='note')return `<aside class="doc-note ${b.tone}"><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></aside>`;
 if(b.kind==='bullets')return `<section class="doc-block">${blockHeading(b)}<ul class="doc-list">${b.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></section>`;
 if(b.kind==='table')return `<section class="doc-block">${blockHeading(b)}<div class="table-scroll"><table><thead><tr>${b.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
 if(b.kind==='requirement')return `<details class="requirement-card" data-requirement-id="${b.id}"><summary><span class="requirement-id">${b.id}</span><h3>${esc(b.title)}</h3>${sourceTag(b.source)}</summary><dl>${Object.entries(b.fields).map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></details>`;
 if(b.kind==='plantBriefs')return `<section class="doc-block">${blockHeading(b)}${PLANTS.map(renderPlantBrief).join('')}</section>`;
 if(b.kind==='animalBook')return `<section class="doc-block">${blockHeading(b)}<p class="doc-paragraph">동물 친구 도감은 식물 표본집 옆의 독립 페이지에서 살펴볼 수 있습니다. 캐릭터를 선택하면 소개·능력·배치·연출을 확인합니다.</p><a class="animal-journal-open" href="#animals">동물 친구 도감 펼쳐 보기 ↗</a><div class="animal-print-list">${ANIMALS.map(renderAnimalDossier).join('')}</div></section>`;
 if(b.kind==='placementDiagram')return `<section class="doc-block">${blockHeading(b)}${renderPlacementDiagram()}</section>`;
 if(b.kind==='flow')return `<section class="doc-block"><h3>${esc(b.title)}</h3><div class="flow-grid">${b.items.map((s,i)=>`<div class="flow-step"><span>${String(i+1).padStart(2,'0')}</span>${esc(s)}</div>`).join('')}</div></section>`;
 if(b.kind==='species')return `<section class="doc-block">${speciesTable()}</section>`;
 if(b.kind==='roadmap')return `<div class="roadmap">${b.phases.map(p=>`<section class="roadmap-phase"><span>PHASE ${p.name}</span><h3>${p.title}</h3><ul class="doc-list">${p.items.map(s=>`<li>${s}</li>`).join('')}</ul></section>`).join('')}</div>`;
 return '';
}
function renderChapter(id){
 const aliases={'04':'03','05':'03','06':'02','10':'09','11':'09','12':'01','13':'01','15':'14','17':'07'};
 const chapter=CHAPTERS.find(c=>c.id===(aliases[id]||id))||CHAPTERS[0];
 const i=CHAPTERS.indexOf(chapter),number=String(i+1).padStart(2,'0');
 if(id!==chapter.id)history.replaceState(null,'',`#chapter/${chapter.id}`);
 $('#chapter-content').innerHTML=`<header class="chapter-header"><div class="chapter-kicker"><span class="chapter-number">${number}</span><span>${chapter.tag}</span></div><h2>${chapter.title}</h2><p>${chapter.subtitle}</p></header>${chapter.blocks.map(renderBlock).join('')}<nav class="chapter-pagination" aria-label="기획 이동">${i>0?`<a href="#chapter/${CHAPTERS[i-1].id}">← ${CHAPTERS[i-1].title}</a>`:'<a href="#plants">← 식물 표본집</a>'}${i<CHAPTERS.length-1?`<a href="#chapter/${CHAPTERS[i+1].id}">${CHAPTERS[i+1].title} →</a>`:'<a href="#plants">표본집 펼치기 →</a>'}</nav><div class="chapter-end">ISLE OF VERDURE · GAME DESIGN · ${number} / ${CHAPTERS.length}</div>`;
 $('#toc').innerHTML=CHAPTERS.map((c,n)=>`<a href="#chapter/${c.id}" class="${c.id===chapter.id?'active':''}" ${c.id===chapter.id?'aria-current="page"':''}><span>${String(n+1).padStart(2,'0')}</span>${c.title}</a>`).join('');
 document.title=`${chapter.title} — 신록의 섬 포트폴리오`;
 return chapter;
}
let lastView='';
function route(initial=false){
 document.body.classList.remove('print-preview-mode');
 const parts=location.hash.slice(1).split('/');if(!parts[0]){parts[0]='chapter';parts[1]='01';}const doc=parts[0]==='chapter';const animal=parts[0]==='animals';
 $('#plant-view').hidden=doc||animal;$('#animal-view').hidden=!animal;$('#document-view').hidden=!doc;$('#collection-navigation').hidden=doc;
 let active=animal?'animals':'plants';
 if(doc){const c=renderChapter(parts[1]);active=c.group;}
 else if(animal){if(parts[1]){resetAnimalEntryFilters();selectAnimalEntry(parts[1]);}else{renderAnimalEntryGrid();renderAnimalEntryDetail();}document.title='동물 친구 도감 — 신록의 섬 포트폴리오';}
 else{if(parts[1])selectPlant(parts[1]);document.title='신록의 섬 — 게임 기획 포트폴리오';}
 document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===active);if(a.dataset.nav===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.querySelectorAll('[data-collection]').forEach(a=>{const selected=a.dataset.collection===active;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 const view=doc?'chapter':animal?'animals':'plants';
 if(!initial&&(doc||lastView!==view))$('.main-nav').scrollIntoView({block:'start',behavior:'instant'});
 lastView=view;closeSearch();
}
function chapterSearchText(c){return `${c.title} ${c.subtitle} ${JSON.stringify(c.blocks)} ${c.id==='17'?JSON.stringify(ANIMALS):''}`.toLowerCase();}
function updateSearch(){
 const query=$('#doc-search').value.trim().toLowerCase();const box=$('#search-results');if(!query){closeSearch();return;}
 const p=PLANTS.filter(p=>`${p.name} ${p.id} ${p.region} ${p.rarity} ${JSON.stringify(PLANT_BRIEFS[p.id])}`.toLowerCase().includes(query));
 const animals=ANIMALS.filter(a=>`${a.name} ${a.id} ${a.species} ${a.role} ${a.title}`.toLowerCase().includes(query));
 const chapters=CHAPTERS.filter(c=>chapterSearchText(c).includes(query));
 box.innerHTML=(p.length?'<p class="search-group">식물 데이터</p>'+p.map(p=>`<a class="search-result" href="#plants/${p.id}">${p.name}<small>${p.id} · ${p.rarity} · ${p.region}</small></a>`).join(''):'')+(animals.length?'<p class="search-group">동물 친구</p>'+animals.map(a=>`<a class="search-result" href="#animals/${a.id}">${a.name} · ${a.species}<small>${a.id} · ${a.role}</small></a>`).join(''):'')+(chapters.length?'<p class="search-group">기획서 본문</p>'+chapters.map(c=>`<a class="search-result" href="#chapter/${c.id}">${c.id}. ${c.title}<small>${c.subtitle}</small></a>`).join(''):'')+(!p.length&&!animals.length&&!chapters.length?'<p class="search-empty">일치하는 항목이 없습니다.</p>':'');
 box.hidden=false;$('#doc-search').setAttribute('aria-expanded','true');
}
function closeSearch(){$('#search-results').hidden=true;$('#doc-search').setAttribute('aria-expanded','false');}
function printAll(){
 $('#print-document').innerHTML=`<nav class="print-toolbar" aria-label="전체 문서 도구"><button data-close-print>← 포트폴리오로 돌아가기</button><span>신록의 섬 · 게임 기획</span><button data-print-confirm>인쇄 / PDF 저장 ↗</button></nav><div class="print-cover"><p>ISLE OF VERDURE / GAME DESIGN PORTFOLIO</p><h1>신록의 섬<br>작은 정원에서 시작되는, 섬의 회복.</h1><p>힐링 가드닝 시뮬레이션<br>시스템 기획 · 도감 UI · 아트 콘셉트</p><div class="print-toc">${CHAPTERS.map((c,i)=>`<a href="#chapter/${c.id}">${String(i+1).padStart(2,'0')} ${c.title}</a>`).join('')}</div></div>${CHAPTERS.map((c,i)=>`<article class="print-chapter"><header class="chapter-header"><p class="eyebrow">${c.tag}</p><h2>${String(i+1).padStart(2,'0')}. ${c.title}</h2><p>${c.subtitle}</p></header>${c.blocks.map(renderBlock).join('')}</article>`).join('')}<article class="print-chapter"><header class="chapter-header"><p class="eyebrow">BOTANICAL COLLECTION</p><h2>식물 표본집 · 15종</h2></header>${PLANTS.map(p=>`<section class="print-plant">${specimen(p)}${renderPlantBrief(p)}</section>`).join('')}</article><article class="print-chapter"><header class="chapter-header"><p class="eyebrow">ANIMAL COMPANIONS</p><h2>동물 친구 도감 · 10종</h2></header>${ANIMALS.map(renderAnimalDossier).join('')}</article>`;
 // A full document must retain optional detail in print without changing the web view.
 $('#print-document').querySelectorAll('details').forEach(d=>d.open=true);
 document.body.classList.add('print-preview-mode');window.scrollTo({top:0,behavior:'instant'});
}
document.addEventListener('click',e=>{
 const animal=e.target.closest('[data-animal]');if(animal){history.replaceState(null,'',`#chapter/17/${animal.dataset.animal}`);selectAnimal(animal.dataset.animal,true);return;}
 const facing=e.target.closest('[data-facing]');if(facing){state.animalFacing=facing.dataset.facing;refreshPlacement();return;}
 const card=e.target.closest('[data-plant]');if(card){const p=card.dataset.plant;history.replaceState(null,'',`#plants/${p}`);selectPlant(p,true);return;}
 const stage=e.target.closest('[data-stage]');if(stage){state.stage=Number(stage.dataset.stage);document.querySelectorAll('[data-stage]').forEach(b=>{b.classList.toggle('active',b===stage);b.setAttribute('aria-pressed',b===stage);});$('.stage-description').innerHTML=stageDescription(state.selected);return;}
 const tab=e.target.closest('[data-detail-tab]');if(tab){state.detailTab=tab.dataset.detailTab;document.querySelectorAll('[data-detail-tab]').forEach(b=>{b.classList.toggle('active',b===tab);b.setAttribute('aria-selected',b===tab);});$('#plant-tab-panel').innerHTML=detailContent(state.selected);$('#plant-tab-panel').setAttribute('aria-labelledby',tab.id);return;}
 if(e.target.closest('[data-prev-plant]')){const id=PLANTS[state.selected.index-1]?.id;if(id){history.replaceState(null,'',`#plants/${id}`);selectPlant(id);}return;}
 if(e.target.closest('[data-next-plant]')){const id=PLANTS[state.selected.index+1]?.id;if(id){history.replaceState(null,'',`#plants/${id}`);selectPlant(id);}return;}
 if(e.target.closest('[data-reset]')||e.target.closest('#clear-filters')){resetFilters();return;}
 if(e.target.closest('#table-toggle')){$('#all-plants-table').hidden=!$('#all-plants-table').hidden;$('#table-toggle').textContent=$('#all-plants-table').hidden?'전체 데이터 표 보기 ↗':'전체 데이터 표 접기 ↑';if(!$('#all-plants-table').hidden)$('#all-plants-table').scrollIntoView({behavior:'smooth',block:'nearest'});return;}
 if(e.target.closest('#close-table')){$('#all-plants-table').hidden=true;$('#table-toggle').textContent='전체 데이터 표 보기 ↗';return;}
 if(e.target.closest('.print-button')){printAll();return;}
 if(e.target.closest('[data-print-confirm]')){window.print();return;}
 if(e.target.closest('[data-close-print]')){route(true);$('.main-nav').scrollIntoView({block:'start',behavior:'instant'});return;}
 if(!e.target.closest('.global-search'))closeSearch();
 if(e.target.closest('.search-result')){closeSearch();$('#doc-search').value='';}
});
document.addEventListener('change',e=>{if(e.target.matches('[data-range-pattern]')){state.animalPattern=e.target.value;refreshPlacement();}});
$('#plant-search').addEventListener('input',e=>{state.search=e.target.value.trim();renderGrid();});
['rarity','region','size'].forEach(key=>$(`#${key}-filter`).addEventListener('change',e=>{state[key]=e.target.value;renderGrid();}));
$('#doc-search').addEventListener('input',updateSearch);$('#doc-search').addEventListener('focus',()=>{if($('#doc-search').value.trim())updateSearch();});
$('#doc-search').addEventListener('keydown',e=>{if(e.key==='Enter'){const a=$('#search-results a');if(a){location.hash=a.hash;$('#doc-search').value='';closeSearch();}}if(e.key==='ArrowDown'){const a=$('#search-results a');if(a){e.preventDefault();a.focus();}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$('#doc-search').focus();}const tab=e.target.closest('[data-detail-tab]');if(tab&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();const tabs=[...document.querySelectorAll('[data-detail-tab]')];const next=tabs[(tabs.indexOf(tab)+(e.key==='ArrowRight'?1:2))%3];next.click();next.focus();}});
window.addEventListener('hashchange',()=>route());
$('#toc').setAttribute('aria-label',`${CHAPTERS.length}개 장 목차`);$('#species-table').innerHTML=speciesTable();renderCultivationSummary();renderGrid();renderDetail();initializeAnimalEncyclopedia();route(true);
