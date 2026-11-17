'use strict';

const petUpgrades = (() => {
  const equipment = {
    A001: {name:'이슬 리본', stats:[
      ['자동 물주기', '20초마다 · 전방 2칸의 마른 작물', '20초마다 · 전방 2칸의 마른 작물'],
      ['즉시 물주기', '—', '새로 심은 마른 작물 1칸 · 20초당 1회']
    ]},
    A002: {name:'해바라기 모자', stats:[
      ['성장 속도', '범위 안 +10%', '범위 안 +10%'],
      ['첫 물주기', '—', '성장 진행도 +5%']
    ]},
    A003: {name:'버섯잎', stats:[
      ['자동 잡초 제거', '20초마다 · 범위 안', '20초마다 · 범위 안'],
      ['즉시 잡초 제거', '—', '새로 생긴 잡초 · 20초당 1회']
    ]},
    A004: {name:'산딸기 바구니', stats:[
      ['자동 수확', '20초마다 · 범위 안 성숙 작물', '20초마다 · 범위 안 성숙 작물'],
      ['기본 표본 수확', '수확물 1개 + 씨앗 2개 · 일군 빈 밭 유지', '수확물 1개 + 씨앗 2개 · 일군 빈 밭 유지'],
      ['동시 수확 보너스', '—', '한 번에 2칸 이상 자동 수확 시 일반 수확물 +1개']
    ]},
    A005: {name:'잎새 스카프', stats:[
      ['고급 수확 확률 보정', '범위 안 +10%p', '범위 안 +10%p · 범위 안에서 직접 수확 시 +15%p']
    ]},
    A006: {name:'데이지 물뿌리개', stats:[
      ['자동 물주기', '12초마다 · 범위 안 마른 작물', '12초마다 · 범위 안 마른 작물'],
      ['인접 칸 물주기', '—', '직접 물주기 시 인접 마른 작물 1칸 · 12초당 1회']
    ]},
    A007: {name:'사과 주머니', stats:[
      ['추가 수확', '20% 확률로 일반 수확물 +1개', '20% 확률로 일반 수확물 +1개'],
      ['추가 씨앗', '—', '추가 수확 발동 시 씨앗 +1개']
    ]},
    A008: {name:'별씨 브로치 목도리', stats:[
      ['황금 수확 확률 보정', '범위 안 +2%p', '범위 안 +2%p · 다섯 번째 수확마다 +4%p']
    ]},
    A009: {name:'꽃가루 꽃잎', stats:[
      ['고급 수확 확률 보정', '범위 안 +5%p', '범위 안 +5%p'],
      ['인접 작물 보정', '—', '고급 수확 성공 시 인접 작물의 다음 고급 수확 확률 +5%p']
    ]},
    A010: {name:'등딱지 데이지', stats:[
      ['성장 속도', '범위 안 +20%', '범위 안 +20% · 성장 진행도 75% 초과 시 +30%']
    ]}
  };
  const rule = '펫 뽑기에서 나온 전용 장비는 보관할 수 있어요. 해당 펫에 장비 1개를 사용하면 외형과 능력이 영구 업그레이드돼요. 튜토리얼에서는 모리 1마리와 이슬 리본 1개를 지급해요.';

  function describeStats(stats, column) {
    return stats.filter(row => row[column] !== '—')
      .map(row => row[0] + ' · ' + row[column]).join(' / ');
  }

  function itemFor(animal) {
    const {name, stats} = equipment[animal.id];
    const effect = describeStats(stats.filter(([, basic, upgraded]) => basic !== upgraded), 2);
    return {name, effect, image:'system-art/' + animal.id + '-item.webp',
      summonUrl:'#summon/' + animal.id};
  }

  function appearance(animal, equipped = true) {
    return '<img class="pet-upgrade-art" src="system-art/' + animal.id + (equipped ? '-equipped' : '-base') +
      '.webp" width="192" height="192" alt="' + animal.name + (equipped ? ' 장착 외형' : ' 기본 외형') + '">';
  }

  function renderStats(animal) {
    return '<section class="pet-stats" aria-labelledby="pet-stats-title"><h3 id="pet-stats-title">장착 전후 능력치</h3>' +
      '<table class="pet-stats-table"><thead><tr><th scope="col">능력</th><th scope="col">기본형</th>' +
      '<th scope="col">업그레이드형</th></tr></thead><tbody>' +
      equipment[animal.id].stats.map(([label, basic, upgraded]) =>
        '<tr><th scope="row">' + label + '</th><td>' + basic + '</td><td>' + upgraded + '</td></tr>'
      ).join('') + '</tbody></table></section>';
  }

  function render(animal) {
    const item = itemFor(animal);
    return '<section class="pet-upgrade" aria-label="' + animal.name + ' 업그레이드">' +
      '<div class="pet-equipment"><img class="pet-item-art" src="' + item.image + '" width="96" height="96" alt="">' +
      '<div><p>' + animal.name + ' 전용 장비</p><h3>' + item.name + '</h3><a class="pet-shop-link" href="' + item.summonUrl + '">펫 뽑기에서 획득 ↗</a></div></div>' +
      renderStats(animal) +
      '<div class="pet-upgrade-pair"><div><h4>기본 외형</h4>' + appearance(animal, false) +
      '</div><div><h4>장착 후 외형</h4>' + appearance(animal, true) + '</div></div>' +
      '<p class="pet-upgrade-rule">' + rule + '</p></section>';
  }

  function search(animals, query) {
    return animals.filter(animal => ['펫 업그레이드 아이템 장착 진화 능력치', animal.name,
      equipment[animal.id].name, ...equipment[animal.id].stats.flat()]
      .join(' ').toLowerCase().includes(query))
      .map(animal => ({url:'#animals/' + animal.id + '/upgrade', title: animal.name + ' 업그레이드',
        description: equipment[animal.id].name + ' · ' + animal.name + ' 전용'}));
  }

  function renderPrint(animals) {
    return '<article class="print-chapter" id="print-pet-upgrades"><header class="chapter-header"><h2>동물 친구 업그레이드</h2><p>' +
      rule + '</p></header><div class="table-scroll"><table><thead><tr><th scope="col">친구</th><th scope="col">전용 아이템</th>' +
      '<th scope="col">기본형 능력치</th><th scope="col">업그레이드형 능력치</th></tr></thead><tbody>' +
      animals.map(animal => {
        const {name, stats} = equipment[animal.id];
        return '<tr><th scope="row">' + animal.name + '</th><td>' + name + '</td><td>' +
          describeStats(stats, 1) + '</td><td>' + describeStats(stats, 2) + '</td></tr>';
      }).join('') +
      '</tbody></table></div></article>';
  }

  return {appearance, itemFor, renderStats, render, search, renderPrint};
})();

const dyeFlowers = (() => {
  const flowers = [
    {id:'D01', region:'R00', area:'정원', name:'노을양귀비', dye:'노을빛', color:'#aa4447',
      place:'오두막 오른쪽 돌 테두리 화단. 말라붙은 잡초 2개를 걷어내면 안쪽에서 발견.',
      when:'이슬종꽃 첫 재배 수확 이후',
      petal:'노을양귀비 꽃잎', extra:'노을씨방 1개 확정', use:'리프의 정원 재료 의뢰',
      task:'되살아난 오두막 화단', record:'노을 화단의 파수꾼'},
    {id:'D02', region:'R02', area:'햇살 초원', name:'귤빛금잔화', dye:'귤빛', color:'#ba682d',
      place:'초원 남쪽. 햇살방울꽃에서 이어지는 짧은 샛길 끝의 낮은 돌담 안쪽.',
      when:'현장 햇살방울꽃 복원 이후',
      petal:'귤빛금잔화 꽃잎', extra:'귤빛꽃술 1개 확정', use:'리프의 정원 재료 의뢰',
      task:'돌담에 걸린 주황빛', record:'주황 꽃밭의 수호자'},
    {id:'D03', region:'R01', area:'이슬 숲', name:'풀빛별꽃', dye:'새잎빛', color:'#547644',
      place:'목교 너머 개울 상류의 그늘진 곁길. 쓰러진 가지 1개를 치우면 바위 아래에서 발견.',
      when:'이슬종꽃 첫 재배 수확 이후',
      petal:'풀빛별꽃 꽃잎', extra:'별꽃잎 1개 확정', use:'리프의 정원 재료 의뢰',
      task:'그늘 아래 켜진 별', record:'새잎 별자리의 수호자'},
    {id:'D04', region:'R04', area:'고대의 숲', name:'달그늘붓꽃', dye:'달그늘빛', color:'#484e8a',
      place:'별빛고사리 뒤쪽. 큰 나무뿌리 아래에 놓인 낮은 석판 곁.',
      when:'별빛고사리 첫 재배 수확 이후',
      petal:'달그늘붓꽃 꽃잎', extra:'달그늘꽃가루 1개(수확마다 15%)', use:'달그늘 등불 제작',
      task:'뿌리 사이 피어난 달그늘', record:'달그늘의 수호자', planned:true}
  ];
  const [red, orange, green, indigo] = flowers;
  const palette = [
    red, orange,
    {name:'햇살방울꽃', petal:'햇살꽃잎', area:'햇살 초원', plant:'P004', dye:'햇살빛', color:'#a17c27'},
    green,
    {name:'이슬종꽃', petal:'종꽃잎', area:'이슬 숲', plant:'P002', dye:'이슬빛', color:'#46799e'},
    indigo,
    {name:'안개연꽃', petal:'안개연꽃 꽃잎', area:'안개 습지', plant:'P006', dye:'안개빛', color:'#805894'}
  ];
  const workbenchRule = '꽃잎 2장 → 염색재 1개 → 가구 1개 염색. 배치한 가구도 미리 확인한 색으로 염색할 수 있으며, 원목색 복원은 무료입니다.';
  const flowerRule = '염색꽃 4종은 선택 정화 대상으로, 다음 지역을 여는 필수 조건에서 제외해요. 야생 개체를 처음 정화할 때 씨앗을 한 번 받고, 정원에서 키우면 거듭 수확할 수 있어요.';
  const achievementRule = '첫 야생 정화와 정원 재배를 각각 기록해요. 수확 기록은 직접 재배해 얻은 꽃잎만 합산하고, 염색이나 납품에 쓰더라도 유지돼요.';
  const recordRewards = [[10,'새싹 코인 10개'],[50,'새싹 코인 20개'],[100,'칭호와 종별 도감 배지']];

  function regionLabel(flower) {
    return flower.area + (flower.planned ? ' · 추후 확장' : '');
  }

  function renderPalette(links = true) {
    return '<ul class="dye-palette">' + palette.map(dye => {
      const href = '#plants/' + (dye.id || dye.plant);
      return '<li><span class="dye-dot" aria-hidden="true" style="--dye:' + dye.color + '"></span><div><strong>' +
        dye.dye + ' 염색재</strong><small>' + dye.petal + ' 2장</small>' +
        (links ? '<a href="' + href + '">' + dye.name + ' · ' + regionLabel(dye) + '</a>' : '<small>' + regionLabel(dye) + '</small>') +
        '</div></li>';
    }).join('') + '</ul>';
  }

  function renderFlower(flower, mode = 'dye') {
    const print = mode === 'print';
    const catalog = mode === 'catalog';
    const heading = catalog ? 'h2' : 'h4';
    const id = print ? '' : ' id="' + (catalog ? 'specimen-' : 'dye-') + flower.id + '"';
    return '<article class="' + (catalog ? 'dye-flower catalog-flower' : 'shop-paper dye-flower') + '"' + id + '>' +
      '<p class="dye-region">' + regionLabel(flower) + ' · 선택 정화</p><' + heading + '>' + flower.name + '</' + heading + '>' +
      '<div class="dye-flower-states">' + ['polluted', 'restored'].map((state, i) =>
        '<figure><img src="system-art/' + flower.id + '-' + state + '.webp" width="192" height="192" loading="lazy" alt="' +
        flower.name + (i ? ' 정화 외형' : ' 오염 외형') + '"><figcaption>' + (i ? '정화 후' : '오염 상태') + '</figcaption></figure>').join('') +
      '</div><dl><div><dt>발견</dt><dd>' + flower.place + '</dd></div><div><dt>정화</dt><dd>' + flower.when +
      '<small>' + purificationPlan.describePlant(flower.id,!print) + '</small></dd></div><div><dt>첫 정화</dt><dd>' +
      flower.name + ' 씨앗 1개</dd></div><div><dt>수확</dt><dd>' + flower.petal + ' 2장 + ' + flower.extra +
      '<small>꽃잎은 ' + flower.dye + ' 염색재 · 추가 재료는 ' + flower.use + '</small></dd></div>' +
      '<div><dt>재배</dt><dd>정원에서 수확한 뒤 다시 자람</dd></div></dl>' +
      (!print ? '<div class="dye-links"><a href="#map/' + flower.region + '">지역 지도 ↗</a><a href="#achievements/flowers/' +
        flower.id + '">업적 보기 ↗</a><a href="' + (catalog ? '#workshop/dye/' : '#plants/') + flower.id + '">' +
        (catalog ? '염색 기획' : '식물 표본집') + ' ↗</a></div>' : '') + '</article>';
  }

  function renderFlowers(links = true) {
    return '<div class="dye-flower-grid">' +
      flowers.map(flower => renderFlower(flower,links ? 'dye' : 'print')).join('') + '</div>';
  }


  function renderAchievements(links = true) {
    return '<p class="dye-ach-rule">' + achievementRule + '</p>' +
      '<ul class="dye-ach-rewards"><li><strong>첫 정화</strong> · 새싹 코인 10개</li>' +
      recordRewards.map(([quantity, reward]) => '<li><strong>꽃잎 ' + quantity + '장</strong> · ' + reward + '</li>').join('') +
      '</ul><div class="dye-ach-grid">' + flowers.map(flower =>
        '<article id="' + (links ? 'flower-ach-' : 'print-flower-ach-') + flower.id + '" class="dye-ach-card">' +
        '<div><p class="dye-region">' + regionLabel(flower) + '</p><h4>' + flower.name + '</h4></div>' +
        '<dl><div><dt>복원 달성과제</dt><dd>' + flower.task + '</dd></div>' +
        '<div><dt>100장 칭호</dt><dd>' + flower.record + '</dd></div></dl>' +
        (links ? '<a href="#plants/' + flower.id + '">정화와 수확 방법 ↗</a>' : '') + '</article>'
      ).join('') + '</div>';
  }

  function mapNotes(region, links = true) {
    return flowers.filter(flower => flower.region === region).map(flower =>
      '<aside class="dye-map-note"><p><strong>선택 정화 시안' + (flower.planned ? ' · 추후 확장' : '') +
      '</strong></p><p>' + flower.name + ' · ' + flower.place + '</p>' +
      (links ? '<a href="#plants/' + flower.id + '">식물과 필요한 정화액 ↗</a>' : '') + '</aside>').join('');
  }

  function search(query) {
    const entries = [
      {url:'#workshop/dye', title:'꽃빛 염색 작업대', description:'무지개 염색재 · 꽃잎 · 가구 색상'},
      ...palette.map(dye => ({url:'#workshop/dye' + (dye.id ? '/' + dye.id : ''), title:dye.dye + ' 염색재',
        description:dye.name + ' · ' + dye.petal + ' 2장'})),
      ...flowers.map(flower => ({url:'#achievements/flowers/' + flower.id, title:flower.record,
        description:flower.task + ' · ' + flower.name + ' · ' + regionLabel(flower)}))
    ];
    return entries.filter(entry => (entry.title + ' ' + entry.description).toLowerCase().includes(query));
  }

  return {flowers, palette, workbenchRule, flowerRule, renderPalette, renderFlower, renderFlowers, renderAchievements, mapNotes, search};
})();
