'use strict';

const gardenPlans = (() => {
  const tutorial = [
    ['리프와의 첫 만남', '리프와 대화하고 정원을 둘러보기', '이슬풀 모종 1개 · 텃밭 1칸 · 새싹 코인 5개'],
    ['첫 텃밭', '텃밭에 이슬풀 모종 심기', '물뿌리개 · 새싹 코인 5개'],
    ['이슬잎 첫 수확', '자란 이슬풀을 수확하기', '이슬잎 3개(수확물) · 새싹 코인 5개 · 기초 정화 물약 레시피 해금'],
    ['첫 정화 물약', '이슬잎 2개로 기초 정화 물약 만들기', '기초 정화 물약 1병(제작물) · 이슬 숲 입장'],
    ['목교 앞 길 열기', '가시잡초를 제거해 목교 앞을 정리하기', '새싹 코인 5개 · 이슬종꽃으로 가는 길 개방'],
    ['잠든 종꽃 깨우기', '오염된 이슬종꽃을 정화하기', '이슬종꽃 씨앗 1개 · 새싹 코인 10개'],
    ['종꽃이 피는 정원', '이슬종꽃 씨앗을 심고 첫 수확하기', '종꽃잎 3개(수확물) · 새싹 코인 5개 · 도감·정원 꾸미기 해금 · 햇살 정화 물약 레시피 해금'],
    ['정원의 첫 쉼터', '정원에 통나무 벤치 1개 배치하기', '주간 퀘스트 · 정원 제작소 해금 · 새싹 코인 10개'],
    ['햇살을 향해', '종꽃잎 2개와 이슬잎 1개로 햇살 정화 물약 만들기', '햇살 정화 물약 1병(제작물) · 햇살 초원 탐험 준비 · 소환권 1장(추가 지급 검토)']
  ];
  const dailyHarvest = ['정원에서 거둔 결실', '오늘 정원에서 작물 5회 수확'];
  const dailyPool = [
    ['오늘의 씨앗', '정원에 씨앗 3회 심기'],
    ['목마른 새싹 돌보기', '첫 물주기 등 유효한 돌봄 3회'],
    ['솥에 재료 넣기', '정화의 솥에서 물약 제조 1회 확정', '#chapter/18/section-10', '제조 시도 판정'],
    ['작은 가구 만들기', '제작소에서 가구 1개 제작', '#workshop', '가구 제작소'],
    ['정원에 장식 더하기', '내 정원에 장식 1개 배치']
  ];
  const dailyChallenges = [
    ['추가 도전 1단계', '오늘 누적 작물 수확 15회', '보상 검토 중'],
    ['추가 도전 2단계', '오늘 누적 작물 수확 30회', '보상 검토 중']
  ];
  const dailyReward = '새싹 코인 5개';
  const dailyNote = '기획 시안 · 이슬 숲에 처음 다녀오면 정원 우편함에 열립니다. 한국 시간 매일 00:00에 과제와 수확 횟수를 갱신합니다.';
  const dailyBonus = '수확 과제 1개와 해금한 콘텐츠의 후보 중 무작위 2개를 제공합니다. 기본 3개를 완료하면 새싹 코인 15개를 받습니다.';
  const dailyFlow = '과제는 진행 중 → 받기 → 수령 완료 순으로 표시합니다. 과제별 보상은 당일 한 번 받을 수 있으며, 받을 수 있는 보상은 한꺼번에 수령할 수 있습니다. 조건을 충족한 행동은 주간 퀘스트에도 집계합니다.';
  const weekly = [
    [
      ['개울가 쉼터', '개울가 구역에 좌석 1개와 꽃 장식 1개 배치', '#shop/F22', '개울가 낮은 의자'],
      ['오두막 앞 꽃길', '오두막 앞에 서로 맞닿은 길 타일 3칸과 꽃 장식 1개 배치', '#shop/F01', '납작돌 길'],
      ['이번 주 정원 수확', '내 정원에서 작물 5회 수확']
    ],
    [
      ['텃밭에 이름 붙이기', '텃밭에 나무 표지판 1개 배치', '#shop/F04', '나무 표지판'],
      ['텃밭 가장자리', '텃밭 가장자리에 울타리 3개 배치', '#shop/F02', '낮은 나무 울타리'],
      ['물뿌리개 한 바퀴', '내 정원의 작물에 물주기 6회']
    ],
    [
      ['솥 옆 등불', '정원 작업대의 솥 옆에 조명 1개 배치', '#shop/F06', '오두막 등불'],
      ['작은 화분 정원', '정원에 화분 2개 배치', '#shop/F03', '작은 흰꽃 화분'],
      ['다음 탐험 준비', '기초 정화 물약 1병 제작']
    ],
    [
      ['습지 관찰 안내판', '안개 습지 데크 옆에 표지판 1개 배치. 습지가 잠겨 있으면 개울가에 배치해도 달성합니다.', '#shop/F24', '습지 관찰 안내판 · 정원 상점 개방 시 진열'],
      ['식물 관찰 코너', '서로 다른 작물 2종 옆에 좌석 1개 배치', '#workshop', '가구 제작소'],
      ['두 가지 수확', '서로 다른 작물 2종을 각각 1회 수확']
    ]
  ];
  const weeklyReward = '새싹 코인 20개';
  const tutorialNote = '단계별 코인 보상안은 새싹 코인 45개입니다. 별도 총액 제안은 40코인이며, 최종 코인 배분은 검토 중입니다. 수확·제작 보상은 해당 행동에서 한 번 지급합니다. 첫 업그레이드 안내용 모리와 이슬 리본은 고정 지급하고, 지급 단계와 별도 소환권 1장 추가는 검토 중입니다.';
  const weeklyNote = '첫 정원 꾸미기를 마치면 우편함에서 매주 과제 3개를 확인합니다. 이미 놓아둔 가구는 제출 시 조건을 충족하면 인정하며, 재배 과제는 생산량 대신 수확 행동 횟수를 셉니다. 과제와 해당 주의 수확 횟수는 매주 월요일 00:00(한국 시간)에 갱신됩니다.';
  const weeklyBonus = '과제 2개를 마치면 소환권 1장을 한 번 받습니다. 3개를 모두 마치면 일주일 보상 합계는 새싹 코인 60개와 소환권 1장입니다.';
  const furniture = [
    {name:'작은 꽃받침대', materials:'목재 2개', size:'1×1칸', art:'stand'},
    {name:'등받이 벤치', materials:'목재 4개', size:'2×1칸', art:'bench'},
    {name:'정원 우편함', materials:'목재 6개', size:'1×1칸', art:'mailbox'}
  ];
  const timberRecipe = '가지 3개 → 목재 2개';
  const unlock = 'Lv.3에 리프가 제작을 소개합니다. 나뭇잎 우편함 도안은 레벨 보상 화면에서 수령합니다. 제작소 개방은 첫 통나무 벤치 배치안을 기준으로 검토 중입니다.';
  const lantern = {name:'달그늘 등불', materials:'목재 4개 + 달그늘꽃가루 1개', area:'고대의 숲 확장안'};
  const levelChapter = CHAPTERS.find(chapter => chapter.id === '20');
  const levelFurniture = levelChapter.blocks.find(block => block.id === 'level-furniture-recipes').rows;
  const furnitureRewardByLevel = new Map(levelChapter.blocks[3].rows.map(([level, , , reward]) =>
    [level, typeof reward === 'string' ? reward : reward.text]));
  const furnitureSheets = [
    {image:'early', bounds:[[54,156,342,591], [412,223,795,593], [874,106,1171,601], [1242,175,1554,598], [1620,257,2121,547]]},
    {image:'middle', bounds:[[27,127,414,603], [442,261,801,611], [844,132,1237,617], [1295,227,1772,611], [1814,165,2124,617]]},
    {image:'late', bounds:[[43,196,416,592], [454,153,807,594], [846,135,1206,606], [1242,100,1602,599], [1648,115,2127,588]]}
  ];
  // Sprite bounds follow the order of the level recipe table and material sheet.
  const furnitureMaterials = [
    ['목재', [108,108,398,397]],
    ['돌', [490,132,757,384]],
    ['이슬잎', [860,109,1138,396]],
    ['고사리 섬유', [110,484,398,764]],
    ['종꽃잎', [473,481,767,758]],
    ['햇살꽃잎', [852,484,1142,751]],
    ['바람잎 조각', [127,850,385,1123]],
    ['안개수술', [517,850,757,1128]],
    ['별빛포자', [856,866,1125,1111]]
  ];

  function recipeSprite(image, sheetWidth, sheetHeight, bounds) {
    const padding = 10;
    const [left, top, right, bottom] = bounds;
    const width = right - left + padding * 2;
    const height = bottom - top + padding * 2;
    const percent = fraction => (fraction * 100).toFixed(3) + '%';
    return '<span class="recipe-art-frame" aria-hidden="true"><span class="recipe-art-slice" style="width:' +
      percent(width / Math.max(width, height)) + ';aspect-ratio:' + width + '/' + height + '"><img src="system-art/level-furniture-' +
      image + '.webp" width="' + sheetWidth + '" height="' + sheetHeight + '" loading="lazy" alt="" style="width:' +
      percent(sheetWidth / width) + ';left:' + percent((padding - left) / width) + ';top:' +
      percent((padding - top) / height) + '"></span></span>';
  }

  function renderLevelFurniture(prefix = '') {
    const groups = furnitureSheets.map(({image, bounds}, groupIndex) => {
      const start = groupIndex * 5;
      const rows = levelFurniture.slice(start, start + bounds.length);
      return '<section class="level-furniture-group"><h4>' + rows[0][0] + '–' + rows.at(-1)[0] +
        '</h4><ul class="level-furniture-grid">' + rows.map(([level, name, materials], i) =>
          '<li id="' + prefix + 'furniture-level-' + level.slice(3) + '" class="shop-paper level-furniture-card">' +
          recipeSprite(image, 2172, 724, bounds[i]) + '<div class="level-furniture-name"><strong>' +
          name + '</strong><span>' + level + (furnitureRewardByLevel.get(level)?.includes(name + ' 도안') ? ' 보상' : ' 시안') + '</span></div><p>' + materials + '</p></li>'
        ).join('') + '</ul></section>';
    }).join('');
    return groups + '<section class="level-furniture-group"><h4>제작 재료 아이콘 9종</h4><ul class="level-furniture-materials">' +
      furnitureMaterials.map(([name, bounds]) => '<li>' + recipeSprite('materials', 1254, 1254, bounds) +
        '<span>' + name + '</span></li>').join('') + '</ul></section>';
  }

  function furnitureRecipes() {
    return furniture.map(item => '<article class="shop-paper workshop-item" id="recipe-' + item.art + '">' +
      '<img class="workshop-art" src="system-art/furniture-' + item.art + '.webp" width="192" height="192" loading="lazy" alt="">' +
      '<h4>' + item.name + '</h4><dl><div><dt>필요 재료</dt><dd>' + item.materials + '</dd></div>' +
      '<div><dt>배치 크기</dt><dd>' + item.size + '</dd></div></dl></article>').join('') +
      '<article class="shop-paper workshop-item workshop-expansion" id="recipe-lantern">' +
      '<p class="shop-hint">' + lantern.area + '</p><h4>' + lantern.name +
      '</h4><dl><div><dt>필요 재료</dt><dd>' + lantern.materials +
      '</dd></div></dl><a class="quest-reference" href="#workshop/dye/D04">달그늘꽃가루 획득처 ↗</a></article>';
  }

  document.getElementById('workshop-unlock').textContent = unlock;
  document.getElementById('workshop-timber').textContent = timberRecipe;
  document.getElementById('workshop-items').innerHTML = furnitureRecipes();
  document.getElementById('workshop-level-furniture-art').innerHTML = renderLevelFurniture();
  document.getElementById('dye-workbench-rule').textContent = dyeFlowers.workbenchRule;
  document.getElementById('dye-palette').innerHTML = dyeFlowers.renderPalette();
  document.getElementById('dye-flower-rule').textContent = dyeFlowers.flowerRule;
  document.getElementById('dye-flower-list').innerHTML = dyeFlowers.renderFlowers();


  function questTable(rows, {reward, numbered = false, links = true} = {}) {
    return '<div class="table-scroll"><table class="quest-table"><thead><tr>' +
      '<th scope="col">과제</th><th scope="col">완료 조건</th><th scope="col">보상 · 해금</th></tr></thead><tbody>' +
      rows.map(([name, goal, rewardOrLink, linkName], i) => '<tr><th scope="row">' +
        (numbered ? '<span class="quest-order">' + String(i + 1).padStart(2, '0') + '</span>' : '') + name +
        '</th><td>' + goal + (links && linkName ?
          '<a class="quest-reference" href="' + rewardOrLink + '">' + linkName + ' ↗</a>' : '') +
        '</td><td>' + (reward ?? rewardOrLink) + '</td></tr>').join('') + '</tbody></table></div>';
  }

  function dailyQuests(links = true) {
    return '<p class="shop-hint">' + dailyNote + '</p>' +
      '<p class="quest-bonus">' + dailyBonus + '</p>' + questTable([dailyHarvest], {reward: dailyReward, links}) +
      '<h4>수확 추가 도전</h4><p>기본 과제와 같은 수확 기록을 이어서 셉니다. 기본 과제는 10~15분, 추가 도전은 약 10~15분을 더 플레이하는 분량을 목표로 합니다.</p>' +
      questTable(dailyChallenges, {links}) +
      '<p>수확에 성공한 작물 개체당 1회로 집계합니다. 플레이 중 완료된 펫 자동 수확도 인정하고, 다른 기본 과제에는 직접 할 수 있는 작업을 넣습니다. 수확 XP는 별도의 지급 기준을 적용합니다.</p>' +
      '<p>별도 추가 도전 후보로 황금 작물 1개 수확을 검토합니다. 보상 예시는 새싹 코인 10개입니다.</p>' +
      '<h4>해금 콘텐츠 과제 후보</h4>' + questTable(dailyPool, {reward: dailyReward, links}) +
      '<p>' + dailyFlow + '</p>';
  }

  const weekControls = document.getElementById('quest-week-controls');
  const weekTasks = document.getElementById('quest-week-tasks');
  document.getElementById('quest-tutorial-tasks').innerHTML = questTable(tutorial, {numbered: true});
  document.getElementById('quest-tutorial-note').textContent = tutorialNote;
  document.getElementById('quest-daily-tasks').innerHTML = dailyQuests();
  document.getElementById('quest-week-info').textContent = weeklyNote;
  document.getElementById('quest-week-bonus').textContent = weeklyBonus;
  weekControls.innerHTML = weekly.map((_, i) => '<button class="shop-button" type="button" data-week="' +
    (i + 1) + '" aria-controls="quest-week-tasks">' + (i + 1) + '주차</button>').join('');

  let selectedWeek = 1;
  function renderQuests(week = selectedWeek) {
    const index = Number(week) - 1;
    const current = weekly[index] ? index : 0;
    selectedWeek = current + 1;
    weekTasks.innerHTML = questTable(weekly[current], {reward: weeklyReward});
    weekControls.querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === current));
    });
  }

  weekControls.addEventListener('click', event => {
    const button = event.target.closest('[data-week]');
    if (!button) return;
    history.replaceState(null, '', '#quests/weekly/' + button.dataset.week);
    renderQuests(button.dataset.week);
  });
  renderQuests();

  function search(query) {
    const entries = [
      {url: '#workshop', title: '가구 제작소', description: '가지 가공 · 제작 전용 가구 · 꽃 염색재'},
      {url: '#workshop/level-furniture', title: '레벨별 제작 가구 시안', description: '가구 15종과 재료 아이콘 9종'},
      ...levelFurniture.map(([level, title, materials]) => ({
        url: '#workshop/level-furniture/' + level.slice(3), title, description: level + ' 해금 · ' + materials
      })),
      ...furniture.map(item => ({url: '#workshop/' + item.art, title: item.name, description: '제작 전용 · ' + item.materials})),
      {url: '#workshop/lantern', title: lantern.name, description: lantern.area + ' · ' + lantern.materials},
      {url: '#quests/tutorial', title: '이전 튜토리얼 퀘스트 시안', description: '이전 9과제와 코인 보상 제안'},
      {url: '#quests/daily', title: '일일 퀘스트 · 리프의 부탁', description: '기본 3개 · 수확 5회 · 새싹 코인 15개'},
      {url: '#quests', title: '퀘스트 기획 의도와 누적 완료 보상', description: '일일 목표 · 주간 소환권 · 장기 목표'},
      {url: '#quests/weekly/1', title: '주간 퀘스트', description: '정원 우편함 · 새싹 코인 · 소환권'},
      {url: '#quests/tutorial', title: '이슬빛 꽃받침대', description: '가지 수확 · 제작 · 염색 · 배치'},
      ...[dailyHarvest, ...dailyChallenges, ...dailyPool].map(([title, description]) => ({url: '#quests/daily', title, description})),
      ...weekly.flatMap((rows, i) => rows.map(([title, goal]) => ({
        url: '#quests/weekly/' + (i + 1), title, description: (i + 1) + '주차 · ' + goal
      })))
    ];
    return entries.filter(entry => (entry.title + ' ' + entry.description).toLowerCase().includes(query));
  }

  function renderPrint() {
    return '<article class="print-chapter" id="print-workshop"><header class="chapter-header"><h2>가구 제작소</h2><p>' +
      unlock + '</p></header><p class="doc-paragraph">제작 수량 · 기획 시안</p><ul class="doc-list">' +
      [timberRecipe, ...furniture.map(item => item.name + ' · ' + item.materials + ' · ' + item.size), lantern.name + ' · ' + lantern.materials + ' · ' + lantern.area]
        .map(recipe => '<li>' + recipe + '</li>').join('') +
      '</ul><section id="print-level-furniture"><h3>레벨별 제작 가구 시안</h3>' + renderLevelFurniture('print-') +
      '</section></article><article class="print-chapter" id="print-dye"><header class="chapter-header"><h2>꽃빛 염색 작업대</h2>' +
      '<p>' + dyeFlowers.workbenchRule + '</p></header>' + dyeFlowers.renderPalette(false) +
      '<h3>염색꽃 4종 · 선택 정화 시안</h3><p>' + dyeFlowers.flowerRule + '</p>' +
      dyeFlowers.renderFlowers(false) + '</article><article class="print-chapter" id="print-quests"><header class="chapter-header"><h2>퀘스트</h2>' +
      '</header><h3>이전 튜토리얼 퀘스트 9과제 시안</h3><p class="doc-paragraph">' + tutorialNote + '</p>' + questTable(tutorial, {numbered: true}) +
      '<h4>이슬빛 꽃받침대</h4><p>가지 수확 → 꽃받침대 제작 → 이슬빛 염색 → 정원 배치 · 보상 시안 새싹 코인 20개</p>' +
      '<section id="print-quest-daily"><h3>일일 퀘스트 · 리프의 부탁</h3>' + dailyQuests(false) + '</section>' +
      '<h3>주간 퀘스트</h3><p class="doc-paragraph">' + weeklyNote + ' ' + weeklyBonus + '</p>' +
      weekly.map((rows, i) => '<h4>' + (i + 1) + '주차</h4>' + questTable(rows, {reward: weeklyReward, links: false})).join('') + '</article>';
  }

  return {renderLevelFurniture, renderQuests, search, renderPrint};
})();
