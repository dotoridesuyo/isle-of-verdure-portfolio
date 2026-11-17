'use strict';

const petSynergy = (() => {
  const rows = 6;
  const cols = 8;
  const link = '#chapter/16/section-9';
  const directions = {up:'↑ 위',right:'→ 오른쪽',down:'↓ 아래',left:'← 왼쪽'};
  const arrows = Object.keys(directions);
  const times = {day:'낮',night:'밤'};
  const animals = new Map(ANIMALS.map(animal => [animal.id, animal]));
  const birds = new Set(['A008','swallow','sparrow']);
  const nightAnimals = new Set(['A003','A008']);
  const dayAnimals = new Set(['swallow','sparrow']);
  for (const [id, name] of [['swallow','제비'],['sparrow','참새']]) {
    animals.set(id, {id, name, rarity:'일반', upcoming:true});
  }

  const rules = [
    {key:'water',label:'물주기',name:'물주기 시너지',members:['A001','A006'],
      effect:'자동 물주기의 효율을 높이는 구상입니다.'},
    {key:'growth',label:'성장',name:'성장 시너지',members:['A002','A010'],
      effect:'작물의 성장 속도를 높이는 구상입니다.'},
    {key:'harvest',label:'수확',name:'수확 시너지',members:['A004','A007'],
      effect:'소리의 자동 수확과 포리의 추가 수확 보정을 같은 구역에 적용합니다.'},
    {key:'quality',label:'품질',name:'품질 시너지',members:['A005','A009'],
      effect:'작물의 품질이 상승할 확률을 높이는 구상입니다.'},
    {key:'bird',label:'새들의 합창',name:'새들의 합창',members:['A008','swallow'],
      traits:birds,condition:'조류 2마리',effect:'작물의 성장 속도를 높이는 구상입니다.'},
    {key:'day',label:'주행성',name:'주행성',members:['swallow','sparrow'],
      traits:dayAnimals,time:'day',condition:'낮에 활동하는 펫 2마리',effect:'낮 동안 관리 효율을 높이는 구상입니다.'},
    {key:'night',label:'야행성',name:'야행성',members:['A003','A008'],
      traits:nightAnimals,time:'night',condition:'밤에 활동하는 펫 2마리',effect:'밤 동안 관리 효율을 높이는 구상입니다.'}
  ];

  function preset(rule) {
    return {
      pets: [
        {id:rule.members[0], row:2, col:3, facing:'down'},
        {id:rule.members[1], row:3, col:3, facing:'up'}
      ],
      time:rule.time || 'day',
      moving:0
    };
  }
  let state = preset(rules[0]);

  function range(pet) {
    if (!pet.id) return new Set();
    const center = cols / 2;
    const covered = placementCells(pet.facing, animals.get(pet.id).rarity, cols)
      .map(cell => ({row:pet.row + cell.row - center, col:pet.col + cell.col - center}))
      .filter(({row,col}) => row >= 0 && row < rows && col >= 0 && col < cols);
    return new Set(covered.map(({row,col}) => row * cols + col));
  }

  function assess(pets, time) {
    const coverage = pets.map(range);
    const common = new Set([...coverage[0]].filter(tile => coverage[1].has(tile)));
    const ids = pets.map(pet => pet.id);
    const matching = rules.filter(rule => rule.traits
      ? ids.every(id => rule.traits.has(id))
      : rule.members.every(id => ids.includes(id)));
    const active = common.size ? matching.filter(rule => !rule.time || rule.time === time) : [];
    return {coverage, common, matching, active};
  }

  function members(rule) {
    return rule.members.map(id => animals.get(id).name).join(' + ');
  }

  function summary() {
    return `<section class="doc-block synergy-summary">
      <h3>펫 시너지 조합과 발동 조건</h3>
      <p class="doc-paragraph">배치 체험은 같은 정원에서 두 펫의 관리 범위가 한 칸 이상 겹칠 때 시너지를 표시합니다. 효과를 받는 곳은 두 펫이 함께 관리하는 칸입니다. 개별 관리 범위는 등급과 바라보는 방향으로 정합니다.</p>
      <div class="table-scroll"><table><thead><tr><th scope="col">시너지</th><th scope="col">조합 예시</th><th scope="col">조건과 효과 방향</th></tr></thead><tbody>
        ${rules.map(rule => `<tr><th scope="row">${rule.name}${rule.traits ? ' · 확장안' : ''}</th><td>${members(rule)}</td><td>${rule.condition ? rule.condition + ' · ' : ''}${rule.effect}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="doc-paragraph">제비·참새와 활동 시간대는 확장 구상입니다. 제비와 참새의 관리 범위는 체험에서 각각 일반 등급 2칸으로 표시합니다. 효과 수치와 여러 시너지가 겹칠 때의 실제 적용 방식은 검토 중입니다.</p>
      <p class="doc-paragraph">펫마다 같은 칸 수의 관리 범위 형태를 2~3종 두고, 획득할 때 형태가 정해지며 배치 중에는 회전할 수 있게 하는 안도 검토 중입니다. 체험에서는 도감의 기본 형태로 배치와 회전을 비교합니다.</p>
    </section>`;
  }

  function slotCard(index) {
    const number = index + 1;
    const options = [...animals.values()].map(animal =>
      `<option value="${animal.id}">${animal.name}${animal.upcoming ? ' · 추가 예정' : ' · ' + animal.species}</option>`
    ).join('');
    return `<div class="synergy-slot" data-slot-card="${index}">
      <div class="synergy-avatar"><img data-syn-portrait="${index}" width="54" height="54" alt="" hidden><span data-syn-placeholder="${index}" aria-hidden="true">❧</span></div>
      <div class="synergy-slot-fields">
        <label for="synergy-pet-${index}">${number}번 펫</label>
        <select id="synergy-pet-${index}" data-syn-pet="${index}"><option value="">비워 두기</option>${options}</select>
        <small data-syn-role="${index}"></small>
      </div>
      <div class="synergy-slot-actions">
        <button type="button" data-syn-move="${index}" aria-pressed="false">배치 선택</button>
        <button type="button" data-syn-turn="${index}" aria-label="${number}번 펫 방향을 시계 방향으로 돌리기"></button>
      </div>
    </div>`;
  }

  function interactive() {
    const presetButton = rule =>
      `<button type="button" data-syn-preset="${rule.key}" aria-pressed="false">${rule.label}</button>`;
    const tiles = Array.from({length:rows * cols}, (_, i) =>
      `<span class="synergy-tile" data-syn-tile="${i}"></span>`).join('');
    const points = Array.from({length:rows + 1}, (_, row) =>
      Array.from({length:cols + 1}, (_, col) =>
        `<button type="button" class="synergy-point" data-syn-point data-row="${row}" data-col="${col}" style="--row:${row};--col:${col}" tabindex="-1"><span aria-hidden="true"></span></button>`
      ).join('')
    ).join('');
    return `<section class="doc-block synergy-demo" data-pet-synergy aria-labelledby="synergy-title">
      <div class="synergy-heading">
        <h3 id="synergy-title">펫 시너지 배치 체험</h3>
        <p>조합을 고른 뒤 펫을 옮기거나 돌려 보세요. 두 펫이 함께 관리하는 칸에 시너지가 표시됩니다.</p>
      </div>
      <div class="synergy-presets">
        <div role="group" aria-label="현재 펫 조합"><span>현재 펫</span>${rules.filter(rule => !rule.traits).map(presetButton).join('')}</div>
        <div role="group" aria-label="확장 조합"><span>확장안</span>${rules.filter(rule => rule.traits).map(presetButton).join('')}</div>
      </div>
      <div class="synergy-layout">
        <div class="synergy-map">
          <div class="synergy-map-head">
            <p id="synergy-board-help">옮길 펫을 고르고 밭의 점을 누르세요. 키보드는 방향키와 Enter를 사용하세요.</p>
            <div class="synergy-time" role="group" aria-label="체험 시간대">
              <button type="button" data-syn-time="day" aria-pressed="true">낮</button>
              <button type="button" data-syn-time="night" aria-pressed="false">밤</button>
            </div>
          </div>
          <div class="synergy-board" role="group" aria-label="배치 실험 밭" aria-describedby="synergy-board-help" style="--cols:${cols};--rows:${rows}">
            <div class="synergy-tiles" aria-hidden="true">${tiles}</div>
            <div class="synergy-points">${points}</div>
          </div>
          <div class="synergy-key" aria-label="밭의 색상 범례">
            <span class="synergy-key-first"><i></i>1번 펫</span>
            <span class="synergy-key-second"><i></i>2번 펫</span>
            <span class="synergy-key-both"><i></i>공통 관리</span>
            <span class="synergy-key-active"><i></i>시너지 적용</span>
          </div>
        </div>
        <div class="synergy-controls">
          ${slotCard(0)}${slotCard(1)}
          <div class="synergy-result" role="status" aria-live="polite" aria-atomic="true">
            <div class="synergy-result-heading"><strong data-syn-result></strong><span data-syn-common></span></div>
            <div class="synergy-effects" data-syn-effects></div>
          </div>
        </div>
      </div>
      <details class="synergy-details"><summary>조합과 기획 규칙 보기</summary>${summary()}</details>
    </section>`;
  }

  function update(root) {
    const pets = state.pets;
    const {coverage,common,matching,active} = assess(pets, state.time);
    const find = (attribute, index) => root.querySelector(`[data-syn-${attribute}="${index}"]`);
    const samePosition = (pet, dot) => pet.row === Number(dot.dataset.row) && pet.col === Number(dot.dataset.col);
    root.dataset.time = state.time;
    root.querySelectorAll('[data-syn-tile]').forEach(tile => {
      const i = Number(tile.dataset.synTile);
      tile.dataset.cover = common.has(i) ? 'both' : coverage[0].has(i) ? 'first' : coverage[1].has(i) ? 'second' : '';
      tile.dataset.synergy = String(common.has(i) && active.length > 0);
    });
    for (const point of root.querySelectorAll('[data-syn-point]')) {
      const i = pets.findIndex(pet => pet.id && samePosition(pet, point));
      const pet = pets[i];
      point.dataset.pin = pet ? String(i + 1) : '';
      point.dataset.current = String(Boolean(pet && i === state.moving));
      point.querySelector('span').textContent = pet ? (i + 1) + directions[pet.facing][0] : '';
      point.setAttribute('aria-label', pet
        ? `${animals.get(pet.id).name} · ${directions[pet.facing]} · 배치 선택`
        : `빈 모서리 · 가로 ${Number(point.dataset.col) + 1}, 세로 ${Number(point.dataset.row) + 1}`);
    }
    if (!root.querySelector('[data-syn-point][tabindex="0"]')) {
      const pet = pets[state.moving];
      root.querySelector(`[data-syn-point][data-row="${pet.row}"][data-col="${pet.col}"]`).tabIndex = 0;
    }
    pets.forEach((pet, i) => {
      const animal = animals.get(pet.id);
      const select = find('pet', i);
      select.value = pet.id;
      for (const option of select.options) option.disabled = !!option.value && option.value === pets[1 - i].id;
      const portrait = find('portrait', i);
      portrait.hidden = !animal || Boolean(animal.upcoming);
      if (!portrait.hidden) portrait.src = `system-art/${animal.id}-base.webp`;
      find('placeholder', i).hidden = !portrait.hidden;
      find('role', i).textContent = !animal ? '펫을 고르면 범위가 표시됩니다.'
        : animal.upcoming ? '추가 예정 · 2칸 예시' : `${animal.role} · ${coverage[i].size}칸 관리`;
      const move = find('move', i);
      move.disabled = !animal;
      move.setAttribute('aria-pressed', String(Boolean(animal && state.moving === i)));
      move.textContent = state.moving === i && animal ? '이동 선택됨' : '배치 선택';
      const turn = find('turn', i);
      turn.disabled = !animal;
      turn.textContent = `↻ ${directions[pet.facing]}`;
    });
    for (const button of root.querySelectorAll('[data-syn-preset]')) {
      const rule = rules.find(entry => entry.key === button.dataset.synPreset);
      button.setAttribute('aria-pressed', String(rule.members.every(id => pets.some(pet => pet.id === id)) &&
        (!rule.time || rule.time === state.time)));
    }
    for (const button of root.querySelectorAll('[data-syn-time]')) {
      button.setAttribute('aria-pressed', String(button.dataset.synTime === state.time));
    }

    const result = root.querySelector('[data-syn-result]');
    const effects = root.querySelector('[data-syn-effects]');
    root.querySelector('[data-syn-common]').textContent = `공통 ${common.size}칸`;
    root.querySelector('.synergy-result').dataset.active = String(active.length > 0);
    if (active.length) {
      result.textContent = `시너지 ${active.length}개 발동`;
      effects.innerHTML = active.map(rule =>
        `<p><b>${rule.name}${rule.traits ? ' · 확장안' : ''}</b>${rule.effect}</p>`).join('');
      return;
    }
    result.textContent = pets.some(pet => !pet.id) ? '펫 두 마리를 배치하세요'
      : !matching.length ? '개별 능력 적용'
      : !common.size ? '관리 범위가 떨어져 있어요' : '시간대 조건을 확인하세요';
    effects.textContent = pets.some(pet => !pet.id) ? '비어 있는 자리에 펫을 고르면 조합을 확인할 수 있어요.'
      : !matching.length ? '다른 조합을 골라 시너지를 살펴보세요.'
      : !common.size ? '배치를 옮기거나 방향을 돌려 공통 관리 칸을 만들어 보세요.'
      : matching.map(rule => `${rule.name} · ${times[rule.time]}에 발동`).join(' / ');
  }

  function mount(container) {
    const root = container.querySelector('[data-pet-synergy]');
    if (!root) return;
    const pointAt = (row,col) => root.querySelector(`[data-syn-point][data-row="${row}"][data-col="${col}"]`);
    const focusPoint = point => {
      const current = root.querySelector('[data-syn-point][tabindex="0"]');
      if (current) current.tabIndex = -1;
      point.tabIndex = 0;
      point.focus();
    };

    root.addEventListener('change', event => {
      if (!event.target.matches('[data-syn-pet]')) return;
      const i = Number(event.target.dataset.synPet);
      const pet = state.pets[i];
      const other = state.pets[1 - i];
      pet.id = event.target.value;
      if (pet.id && other.id && pet.row === other.row && pet.col === other.col) {
        pet.col = (other.col + 1) % (cols + 1);
      }
      state.moving = pet.id ? i : 1 - i;
      update(root);
    });
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      const {synPreset,synMove,synTurn,synTime} = button.dataset;
      if (synPreset) state = preset(rules.find(rule => rule.key === synPreset));
      else if (synTime) state.time = synTime;
      else if (synMove !== undefined) state.moving = Number(synMove);
      else if (synTurn !== undefined) {
        const pet = state.pets[Number(synTurn)];
        pet.facing = arrows[(arrows.indexOf(pet.facing) + 1) % arrows.length];
      } else if (button.hasAttribute('data-syn-point')) {
        focusPoint(button);
        const row = Number(button.dataset.row);
        const col = Number(button.dataset.col);
        const occupant = state.pets.findIndex(pet => pet.id && pet.row === row && pet.col === col);
        if (occupant >= 0) state.moving = occupant;
        else if (state.pets[state.moving].id) Object.assign(state.pets[state.moving], {row,col});
      } else return;
      update(root);
    });
    root.addEventListener('keydown', event => {
      if (!event.target.matches('[data-syn-point]')) return;
      const offset = {ArrowUp:[-1,0], ArrowRight:[0,1], ArrowDown:[1,0], ArrowLeft:[0,-1]}[event.key];
      if (!offset) return;
      event.preventDefault();
      const row = Number(event.target.dataset.row) + offset[0];
      const col = Number(event.target.dataset.col) + offset[1];
      const point = pointAt(row,col);
      if (point) focusPoint(point);
    });
    update(root);
  }

  function search(query) {
    return rules.filter(rule => `${rule.name} ${members(rule)} ${rule.effect}`.toLowerCase().includes(query))
      .map(rule => ({url:link,title:rule.name,description:members(rule) + (rule.traits ? ' · 확장안' : '')}));
  }

  return {interactive,summary,mount,search};
})();
