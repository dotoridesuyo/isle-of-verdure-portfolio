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
    {key:'water',name:'물주기 시너지',members:['A001','A006'],
      condition:'모리와 누리 배치',
      effect:'자동 물주기 효율 증가',
      detail:'마른 작물의 자동 물주기 효율을 높이는 시너지. 단, 동일한 재배 주기에는 작물당 물주기가 한 번만 적용되며, 중복으로 처리되지 않음'},
    {key:'growth',name:'성장 시너지',members:['A002','A010'],
      condition:'토리와 두리 배치',
      effect:'성장 중인 작물의 성장 속도 증가',
      detail:'물을 준 후 성장 중인 작물의 성장 속도를 높이는 시너지. 희귀 수확물의 획득 확률을 높이는 「생명의 조화」는 별도 효과 후보로 검토 중.'},
    {key:'harvest',name:'수확 시너지',members:['A004','A007'],
      condition:'소리와 포리 배치',
      effect:'자동 수확 시 추가 수확량 확률 증가',
      detail:'소리가 성숙한 작물을 자동 수확할 때 포리의 추가 수확량 확률 보정이 적용되는 시너지. 소리가 산딸기 바구니를 장착한 경우, 한 번에 2칸 이상 수확하면 일반 수확물 1개를 추가로 획득.'},
    {key:'quality',name:'품질 시너지',members:['A005','A009'],
      condition:'루나와 나리 배치',
      effect:'수확 시 품질 상승 확률 증가',
      detail:'수확물의 품질 상승 확률을 높이는 시너지. 기본 수확량은 유지되며, 품질 상승·추가 수확량·황금 작물 획득 확률은 각각 별도의 보정 항목으로 적용.'},
    {key:'bird',name:'새들의 합창',members:['A008','swallow'],
      traits:birds,condition:'별이·제비·참새 중 조류 펫 2마리 이상 배치',
      effect:'성장 중인 작물의 성장 속도 증가',
      detail:'조류 펫 2마리의 관리 범위가 겹치는 작물에 성장 속도 보너스를 적용하는 시너지. 현재 구현 대상인 별이를 기준으로 구성하며, 제비와 참새는 추후 추가 예정.'},
    {key:'day',name:'주행성',members:['swallow','sparrow'],
      traits:dayAnimals,time:'day',condition:'주행성 펫 2마리 이상 배치 · 낮',
      effect:'낮 동안 관리 효율 증가',
      detail:'낮 시간대에 주행성 펫의 공통 관리 범위에 효율 보너스를 적용하는 시너지. 제비와 참새를 배치한 경우 「새들의 합창」과 동시 발동 가능하며, 밤에는 주행성 효과가 비활성화됨.'},
    {key:'night',name:'야행성',members:['A003','A008'],
      traits:nightAnimals,time:'night',condition:'야행성 펫 2마리 이상 배치 · 밤',
      effect:'밤 동안 관리 효율 증가',
      detail:'밤 시간대에 야행성 펫의 공통 관리 범위에 효율 보너스를 적용하는 시너지. 잡초를 제거하는 밤이와 황금 작물 획득 확률을 높이는 별이가 대표 조합이며, 낮에는 야행성 효과가 비활성화됨.'}
  ];

  const overlapCondition = '같은 정원에서 관리 범위가 한 칸 이상 겹침';
  const shapeExamples = [
    ['정사각형', ['11', '11']],
    ['일자', ['1111']],
    ['ㄱ자', ['10', '10', '11']],
    ['ㅗ자', ['010', '111']],
    ['십자', ['010', '111', '010', '010']]
  ];

  function preset(rule) {
    return {
      pets: [
        {id:rule.members[0], row:2, col:3, facing:'down'},
        {id:rule.members[1], row:3, col:3, facing:'up'}
      ],
      time:rule.time || 'day',
      moving:0,
      presetKey:rule.key
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

  function icon(rule, size) {
    return `<img class="synergy-icon" src="synergy-art/${rule.key}.webp" alt="" width="${size}" height="${size}">`;
  }

  function animalRules(id) {
    return rules.filter(rule => rule.traits ? rule.traits.has(id) : rule.members.includes(id));
  }

  function animalDetails(id) {
    const related = animalRules(id);
    if (!related.length) return '<p>이 친구의 시너지 조합은 아직 등록되지 않았어요.</p>';

    return `<section class="animal-synergies" aria-label="참여 시너지">
      <p><strong>공통 발동 조건</strong> · ${overlapCondition}. 효과는 겹친 칸에 적용됩니다.</p>
      ${related.map(rule => {
        const partners = [...(rule.traits || rule.members)].filter(partner => partner !== id).map(partner => {
          const animal = animals.get(partner);
          return animal.upcoming ? `<span>${animal.name} (추가 예정)</span>`
            : `<a href="#animals/${partner}/synergy">${animal.name}</a>`;
        });
        return `<article class="synergy-rule">
          <div class="synergy-rule-heading">${icon(rule, 40)}<div><h3>${rule.name}</h3>${rule.traits ? '<p>확장안</p>' : ''}</div></div>
          <dl>
            <div><dt>함께 배치</dt><dd>${partners.join(' 또는 ')}</dd></div>
            ${rule.time ? `<div><dt>발동 시간</dt><dd>${times[rule.time]}</dd></div>` : ''}
            <div><dt>기획 효과</dt><dd><strong>${rule.effect}</strong><br>${rule.detail}</dd></div>
          </dl>
        </article>`;
      }).join('')}
      <a class="animal-range-link" href="${link}">펫 시너지 배치 체험 ↗</a>
    </section>`;
  }

  function ruleDetails(rule) {
    return `<div class="synergy-rule-heading">
      ${icon(rule, 48)}
      <div><h4>${rule.name}</h4><p>${rule.traits ? '확장안 · 예시 조합' : '기획 조합'} · ${rule.members.map(id => {
        const animal = animals.get(id);
        return animal.upcoming ? animal.name + ' (추가 예정)' : `<a href="#animals/${id}">${animal.name}</a>`;
      }).join(' + ')}</p></div>
    </div>
    <dl class="synergy-rule-details">
      <div><dt>발동 조건</dt><dd>${rule.condition}<br>${overlapCondition}</dd></div>
      <div><dt>기획 효과</dt><dd><strong>${rule.effect}</strong><br>${rule.detail}</dd></div>
    </dl>`;
  }

  function sharedRules() {
    const shapes = shapeExamples.map(([name, rows]) => {
      const count = Array.from(rows.join('')).filter(cell => cell === '1').length;
      return `<li>
        <span class="synergy-shape" aria-hidden="true">
          ${rows.map(row => `<span>${Array.from(row, cell => `<i data-covered="${cell}"></i>`).join('')}</span>`).join('')}
        </span>
        <strong>${name}</strong><small>${count}칸</small>
      </li>`;
    }).join('');
    return `<section class="synergy-summary">
      <h4>관리 범위와 효과 판정</h4>
      <dl class="synergy-spec">
        <div><dt>배치와 회전</dt><dd>펫은 식재 칸이 맞닿는 꼭짓점에 배치하며, 90° 단위로 회전 가능. 회전 방향에 따라 관리 범위가 변경되며, 정원 경계 밖이나 장애물이 있는 칸은 관리 대상에서 제외. 제외된 칸만큼 관리 범위가 추가되지는 않음.</dd></div>
        <div><dt>등급별 기본 범위</dt><dd>${Object.entries(ANIMAL_GRADES).map(([name, grade]) => `${name} ${grade.count}칸 (${grade.width}×${grade.depth})`).join(' · ')}. 제비와 참새는 배치 체험에서 일반 등급의 2칸 범위를 적용.</dd></div>
        <div><dt>시너지와 중복</dt><dd>각 펫의 고유 능력은 개별 관리 범위에 적용되며, 시너지 효과는 두 펫의 관리 범위가 겹치는 칸에 추가 적용. 수동 관리와 자동 관리가 겹치더라도 동일 작물에 대한 물주기와 수확은 각각 한 번만 처리. 여러 시너지의 중첩 방식과 세부 효과 수치는 검토 중.</dd></div>
        <div><dt>자동 수확 한도</dt><dd>계정 공용 보관함 기본 50개, 최대 200개. <a href="#chapter/16/section-7">보관함 용량과 자동 수확 규칙 ↗</a> · <a href="#chapter/20/section-3">수확 XP 지급 한도 ↗</a></dd></div>
      </dl>
      <h4>범위 모양과 인접 배치 구상</h4>
      <p class="doc-paragraph">같은 등급 안에서 총 칸 수를 유지한 채 일자, ㄱ자 등 다른 모양을 써서 빈 칸을 메우는 방식입니다. 펫을 얻을 때 정해지는 모양을 돌려 배치하는 안과, 관리 구역끼리 닿았을 때의 인접 시너지도 논의했습니다. 배치 체험에는 기본 모양과 겹침 판정을 적용합니다.</p>
      <ul class="synergy-shapes" aria-label="관리 범위 형태 예시">${shapes}</ul>
    </section>`;
  }

  function summary() {
    return `<section class="doc-block synergy-summary">
      <h3>펫 시너지 조합과 발동 조건</h3>
      ${rules.map(rule => `<div class="synergy-rule">${ruleDetails(rule)}</div>`).join('')}
      ${sharedRules()}
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
    const presetButton = rule => `<button type="button" data-syn-preset="${rule.key}" aria-pressed="false" aria-controls="synergy-rule">
      ${icon(rule, 48)}<span><strong>${rule.name}</strong><small>${members(rule)}</small></span>
    </button>`;
    const tiles = Array.from({length:rows * cols}, (_, i) =>
      `<span class="synergy-tile" data-syn-tile="${i}"></span>`).join('');
    const points = Array.from({length:rows + 1}, (_, row) =>
      Array.from({length:cols + 1}, (_, col) =>
        `<button type="button" class="synergy-point" data-syn-point data-row="${row}" data-col="${col}" style="--row:${row};--col:${col}" tabindex="-1"><span aria-hidden="true"></span></button>`
      ).join('')
    ).join('');
    return `<section class="doc-block synergy-demo" data-pet-synergy aria-labelledby="synergy-title">
      <div class="synergy-heading">
        <h3 id="synergy-title">펫 시너지와 배치 체험</h3>
        <p>두 펫의 역할이 만나면 정원 관리 방식이 달라집니다. 조합을 고르고 배치와 시간대를 바꿔 발동 조건을 확인해 보세요.</p>
      </div>
      <div class="synergy-presets">
        <div><h4 id="synergy-current-title">기존 펫 조합</h4><div class="synergy-card-list" role="group" aria-labelledby="synergy-current-title">${rules.filter(rule => !rule.traits).map(presetButton).join('')}</div></div>
        <div><h4 id="synergy-expansion-title">확장 시너지</h4><div class="synergy-card-list" role="group" aria-labelledby="synergy-expansion-title">${rules.filter(rule => rule.traits).map(presetButton).join('')}</div></div>
      </div>
      <div class="synergy-rule" id="synergy-rule" data-syn-rule></div>
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
      ${sharedRules()}
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
      button.setAttribute('aria-pressed', String(button.dataset.synPreset === state.presetKey));
    }
    const design = root.querySelector('[data-syn-rule]');
    if (design.dataset.rule !== state.presetKey) {
      design.innerHTML = ruleDetails(rules.find(rule => rule.key === state.presetKey));
      design.dataset.rule = state.presetKey;
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
        `<p class="synergy-effect">${icon(rule, 26)}<span><b>${rule.name}${rule.traits ? ' · 확장안' : ''}</b>${rule.effect}</span></p>`).join('');
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
    return rules.filter(rule => `${rule.name} ${members(rule)} ${rule.condition} ${rule.effect} ${rule.detail}`.toLowerCase().includes(query))
      .map(rule => ({url:link,title:rule.name,description:members(rule) + (rule.traits ? ' · 확장안' : '')}));
  }

  return {interactive,summary,mount,search,animalRules,animalDetails,icon};
})();
