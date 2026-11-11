/* Animal journal UI: document navigation and previews only. */
const animalCatalogState={selectedId:'A001',query:'',rarity:'',skill:'',mode:'',tab:'profile'};
function filteredAnimalEntries(){return ANIMALS.filter(a=>(!animalCatalogState.rarity||a.rarity===animalCatalogState.rarity)&&(!animalCatalogState.skill||a.skill===animalCatalogState.skill)&&(!animalCatalogState.mode||a.mode===animalCatalogState.mode)&&(!animalCatalogState.query||`${a.id} ${a.name} ${a.species} ${a.rarity} ${a.role} ${animalRangeLabel(a)}`.toLowerCase().includes(animalCatalogState.query.toLowerCase())));}
function renderAnimalEntryGrid(){
 const animals=filteredAnimalEntries();
 $('#animal-entry-count').textContent=animals.length;
 $('#animal-filter-count').textContent=animals.length===10?'10종의 친구를 기록했습니다':`전체 10종 중 ${animals.length}종 표시`;
 $('#animal-entry-grid').innerHTML=animals.length?animals.map(a=>`<button class="animal-entry-card ${a.id===animalCatalogState.selectedId?'selected':''}" data-animal-entry="${a.id}" aria-label="${esc(a.name)} ${esc(a.species)} ${a.rarity} 도감 상세" aria-pressed="${a.id===animalCatalogState.selectedId}"><small>${a.id}</small><span class="animal-card-grade">${badge(a)}</span>${animalSprite(a)}<b>${esc(a.name)}</b><span class="animal-card-caption">${esc(a.species)} · ${ANIMAL_GRADES[a.rarity].count}칸</span></button>`).join('')+(animals.length===10?'<div class="animal-entry-slot" aria-hidden="true"><span>❧</span><small>다음 친구의 자리</small></div><div class="animal-entry-slot" aria-hidden="true"><span>✧</span><small>to be continued</small></div>':''):'<div class="empty-state"><span>❧</span><p>조건에 맞는 친구가 없어요.</p><small>다른 이름이나 등급·능력으로 찾아보세요.</small><button data-reset-animals>검색·필터 초기화</button></div>';
}
function animalEntryPanel(a){
 if(animalCatalogState.tab==='profile')return `<section class="animal-profile-concept" aria-label="캐릭터 컨셉"><dl>${row('♡','캐릭터 컨셉',esc(a.personality))}${row('❧','외형 컨셉',esc(a.appearance))}${row('⌖','등장 컨셉',esc(a.meeting))}</dl></section><section class="animal-profile-placement" aria-labelledby="animal-placement-heading"><h3 id="animal-placement-heading">능력 · 배치</h3><div class="animal-range-note">${animalRangeMini(a)}<div class="animal-range-copy"><h4>${a.rarity} · 전방 ${ANIMAL_GRADES[a.rarity].count}칸 관리</h4><ul><li>너비 ${ANIMAL_GRADES[a.rarity].width} × 깊이 ${ANIMAL_GRADES[a.rarity].depth} · 방향별 범위 전환</li><li>모서리 배치 · 식재 칸 점유 없음</li></ul></div></div><dl>${row('♧','주요 능력',esc(a.primary))}${row('⌖','적용 유형',esc(a.mode))}</dl><a class="animal-range-link" href="#chapter/16">등급별 관리 범위 비교 ↗</a></section>`;
 return `<dl>${row('✎','대기·작동',esc(a.animation))}</dl><a class="animal-range-link" href="#chapter/08">아트 방향 ↗</a>`;
}
function renderAnimalEntryDetail(){
 const a=ANIMALS.find(a=>a.id===animalCatalogState.selectedId)||ANIMALS[0];
 const tabs=[['profile','컨셉 · 배치'],['production','연출']];
 $('#animal-entry-detail').innerHTML=`<div class="detail-topline"><p class="eyebrow">COMPANION JOURNAL / ${a.id}</p><span>정원의 작은 동행</span></div><div class="animal-entry-hero"><div><p class="specimen-id">NO. ${String(a.index+1).padStart(3,'0')}</p><h2>${esc(a.name)}</h2><p class="animal-entry-title">${esc(a.title)}</p><div class="species-tags">${badge(a)}<span class="badge neutral">${esc(a.species)}</span></div></div><div class="animal-entry-portrait">${animalSprite(a)}</div></div><p class="animal-entry-concept">${esc(a.concept)}</p><div class="animal-entry-facts"><div><small>정원 역할</small><b>${esc(a.role)}</b></div><div><small>관리 범위</small><b>전방 ${ANIMAL_GRADES[a.rarity].count}칸</b></div><div><small>너비 × 깊이</small><b>${ANIMAL_GRADES[a.rarity].width} × ${ANIMAL_GRADES[a.rarity].depth}</b></div></div><div class="detail-tabs animal-entry-tabs" role="tablist" aria-label="동물 친구 상세 정보">${tabs.map(([id,label])=>`<button role="tab" id="animal-tab-${id}" data-animal-entry-tab="${id}" class="${animalCatalogState.tab===id?'active':''}" aria-selected="${animalCatalogState.tab===id}" aria-controls="animal-entry-panel">${label}</button>`).join('')}</div><div class="animal-entry-panel" id="animal-entry-panel" role="tabpanel" aria-labelledby="animal-tab-${animalCatalogState.tab}">${animalEntryPanel(a)}</div><aside class="animal-friend-quote"><h3>✎ 소개 대사</h3><p>${esc(a.memo)}</p></aside><div class="detail-navigation"><button data-animal-entry-prev ${a.index===0?'disabled':''}>← 이전 친구</button><span>${String(a.index+1).padStart(2,'0')} / 10</span><button data-animal-entry-next ${a.index===9?'disabled':''}>다음 친구 →</button></div><div class="page-number"><span>ISLAND COMPANION RECORD</span><span>— ${a.id} —</span></div>`;
 $('#animal-production-spec').innerHTML='';
}
function selectAnimalEntry(id,scroll=false){
 if(!ANIMALS.some(a=>a.id===id))return;
 animalCatalogState.selectedId=id;animalCatalogState.tab='profile';renderAnimalEntryGrid();renderAnimalEntryDetail();
 if(scroll&&innerWidth<=650)$('#animal-entry-detail').scrollIntoView({block:'start',behavior:'smooth'});
}
function resetAnimalEntryFilters(){animalCatalogState.query=animalCatalogState.rarity=animalCatalogState.skill=animalCatalogState.mode='';$('#animal-entry-search').value=$('#animal-rarity-filter').value=$('#animal-skill-filter').value=$('#animal-mode-filter').value='';renderAnimalEntryGrid();}
function initializeAnimalEncyclopedia(){
 $('#animal-skill-filter').insertAdjacentHTML('beforeend',[...new Map(ANIMALS.map(a=>[a.skill,a.role])).entries()].map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join(''));
 $('#animal-entry-grid').insertAdjacentHTML('beforebegin',`<div class="animal-grade-key" aria-label="등급별 관리 범위">${Object.entries(ANIMAL_GRADES).map(([rarity,g])=>`<span class="${RARITY_CLASS[rarity]}">${rarity}<b>${g.count}칸</b></span>`).join('')}</div>`);
 renderAnimalEntryGrid();renderAnimalEntryDetail();
}
document.addEventListener('click',e=>{
 const entry=e.target.closest('[data-animal-entry]');if(entry){history.replaceState(null,'',`#animals/${entry.dataset.animalEntry}`);selectAnimalEntry(entry.dataset.animalEntry,true);return;}
 const tab=e.target.closest('[data-animal-entry-tab]');if(tab){animalCatalogState.tab=tab.dataset.animalEntryTab;document.querySelectorAll('[data-animal-entry-tab]').forEach(b=>{const active=b===tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',active);});const a=ANIMALS.find(a=>a.id===animalCatalogState.selectedId);$('#animal-entry-panel').innerHTML=animalEntryPanel(a);$('#animal-entry-panel').setAttribute('aria-labelledby',tab.id);return;}
 if(e.target.closest('[data-reset-animals]')||e.target.closest('#animal-clear-filters')){resetAnimalEntryFilters();return;}
 const previous=e.target.closest('[data-animal-entry-prev]'),next=e.target.closest('[data-animal-entry-next]');if(previous||next){const current=ANIMALS.findIndex(a=>a.id===animalCatalogState.selectedId);const a=ANIMALS[current+(previous?-1:1)];if(a){history.replaceState(null,'',`#animals/${a.id}`);selectAnimalEntry(a.id);}return;}
});
document.addEventListener('keydown',e=>{const tab=e.target.closest('[data-animal-entry-tab]');if(!tab||!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-animal-entry-tab]')];const next=tabs[(tabs.indexOf(tab)+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];next.click();next.focus();});
document.getElementById('animal-entry-search').addEventListener('input',e=>{animalCatalogState.query=e.target.value.trim();renderAnimalEntryGrid();});
document.getElementById('animal-rarity-filter').addEventListener('change',e=>{animalCatalogState.rarity=e.target.value;renderAnimalEntryGrid();});
document.getElementById('animal-skill-filter').addEventListener('change',e=>{animalCatalogState.skill=e.target.value;renderAnimalEntryGrid();});
document.getElementById('animal-mode-filter').addEventListener('change',e=>{animalCatalogState.mode=e.target.value;renderAnimalEntryGrid();});
