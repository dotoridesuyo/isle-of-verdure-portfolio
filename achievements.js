'use strict';

const achievementsPage = (() => {
  const points = {tasks: 10, records: 8};
  const harvestMilestones = [10, 50, 100];
  const badges = [
    {points: 25, name: '발견자', reward: '새싹 코인'},
    {points: 50, name: '돌봄가', reward: '소형 장식 제작법'},
    {points: 75, name: '복원가', reward: '프로필 테두리'},
    {points: 100, name: '수호자', reward: '지역 전용 가구 세트'}
  ];
  const regions = [
    {
      id: 'R01', name: '이슬 숲', color: 'dew',
      description: '목교 주변의 이동 경로를 정리하고, 이슬 숲에서 발견한 식물을 정원에 들여와요.',
      tasks: [
        ["이슬 맺힌 목교", "이슬 숲을 방문하고 개울 위 목교를 건너기", 0],
        ["다시 울리는 이슬종", "기초 정화액으로 오염된 이슬종꽃을 정화하기", 1],
        ["종소리를 품은 씨앗", "정화한 이슬종꽃의 씨앗을 확보하기", 2],
        ["정원에 심은 첫 이슬", "정원에 이슬종꽃 씨앗을 처음 심기", 3],
        ["손안의 첫 종꽃잎", "정원에서 키운 이슬종꽃을 처음 수확하기", 4],
        ["개울을 지키는 푯말", "지름길 입구에 표식을 놓아 목교 쪽으로 이동을 유도하기", 5]
      ],
      records: [
        ['백 송이의 종지기', '정원에서 이슬종꽃을 누적 100개 수확하기', '이슬종꽃 100개 수확'],
        ['이슬풀 재배 기록', '이슬풀을 누적 50개 수확하기'],
        ['그늘고사리 재배 기록', '그늘고사리를 누적 50개 수확하기'],
        ['이끼양배추 재배 기록', '이끼양배추를 누적 50개 수확하기'],
        ['이슬 숲 표본 수집', '이슬 숲의 식물 4종을 발견해 표본집에 기록하기']
      ]
    },
    {
      id: 'R02', name: '햇살 초원', color: 'sun',
      description: '바람이 드는 언덕에 자생 꽃을 되돌리고, 꽃과 풀을 정원에서 키워요.',
      tasks: [
        ["햇살 언덕에 첫발", "첫 종꽃잎 수확 이후 햇살 초원에 도착하기", 6],
        ["황금빛 종이 깨어날 때", "햇살 정화액으로 오염된 햇살방울꽃을 정화하기", 1],
        ["햇살을 품은 씨앗", "정화한 햇살방울꽃에서 씨앗을 얻기", 2],
        ["첫 햇살을 거두다", "정원에 햇살방울꽃을 심고 처음 수확하기", 4],
        ["꽃으로 잇는 초원", "비어 있는 초원에 개화 시기가 다른 자생 꽃을 심기", 6],
        ["날갯짓이 돌아온 날", "복원한 꽃무리 사이를 오가는 벌과 나비를 관찰하기", 7]
      ],
      records: [
        ['햇살방울꽃 100개 수확', '햇살방울꽃을 누적 100개 수확하기'],
        ['바람잎 재배 기록', '바람잎을 누적 50개 수확하기'],
        ['구름라벤더 재배 기록', '구름라벤더를 누적 50개 수확하기'],
        ['꿀빛금잔화 재배 기록', '꿀빛금잔화를 누적 50개 수확하기'],
        ['햇살 초원 표본 수집', '햇살 초원의 식물 4종을 발견해 표본집에 기록하기']
      ]
    },
    {
      id: 'R03', name: '안개 습지', color: 'mist',
      description: '물이 빠져나가는 옛 배수 홈을 막고, 얕은 물가의 식물과 생물을 찾아요.',
      tasks: [
        ["안개 너머 나무길", "안개 습지를 처음 방문해 물가 데크까지 가기", 0],
        ["물안개 속에 핀 연꽃", "안개 정화액으로 오염된 안개연꽃을 정화하기", 1],
        ["물결을 품은 씨앗", "정화한 안개연꽃에서 씨앗을 얻기", 2],
        ["첫 안개꽃을 거두다", "정원에 안개연꽃을 심고 처음 수확하기", 4],
        ["물이 머무는 자리", "돌과 흙으로 배수 홈 입구를 막아 얕은 물을 남기기", 8],
        ["올챙이가 돌아온 날", "복원한 얕은 물의 수초 사이에서 올챙이를 관찰하기", 9]
      ],
      records: [
        ['안개연꽃 100개 수확', '안개연꽃을 누적 100개 수확하기'],
        ['솜부들 재배 기록', '솜부들을 누적 50개 수확하기'],
        ['물방울토란 재배 기록', '물방울토란을 누적 50개 수확하기'],
        ['물별초 재배 기록', '물별초를 누적 50개 수확하기'],
        ['안개 습지 표본 수집', '안개 습지의 식물 4종을 발견해 표본집에 기록하기']
      ]
    },
    {
      id: 'R04', name: '고대의 숲', color: 'ancient', planned: true,
      description: '쓰러진 통나무 둘레를 보호하고 오래된 숲의 어린 식물이 자랄 공간을 마련하는 확장 기획이에요.',
      tasks: [
        ["물길이 시작되는 능선", "고대의 숲 입구에서 물길이 시작되는 능선으로 가기", 10],
        ["숲에 돌아온 별빛", "오염된 별빛고사리를 정화하기", 1],
        ["별빛을 품은 씨앗", "정화한 별빛고사리에서 씨앗을 얻기", 2],
        ["손안의 첫 별빛포자", "정원에 별빛고사리를 심고 처음 수확하기", 4],
        ["고목 곁의 쉼터", "쓰러진 통나무 둘레를 보호 구간으로 표시하기", 10],
        ["이끼 사이의 새잎", "보호 구간에 돌아온 이끼와 어린 고사리를 관찰하기", 11]
      ],
      records: [
        ['별빛고사리 100개 수확', '별빛고사리를 누적 100개 수확하기'],
        ['달잠꽃 재배 기록', '추가 예정인 달잠꽃을 누적 50개 수확하기'],
        ['기억나무 재배 기록', '추가 예정인 기억나무를 누적 50개 수확하기'],
        ['보호 구간 관찰', '통나무 둘레에서 자라는 이끼·고사리·묘목을 관찰하기'],
        ['고대의 숲 표본 수집', '고대의 숲의 식물 3종을 발견해 표본집에 기록하기']
      ]
    }
  ];

  const title = '업적과 지역 숙련도';
  const description = '복원 달성과제 6개는 각 10점, 장기 업적 5개는 각 8점으로 지역별 숙련도 100점을 채워요.';
  const scopeNote = '지역별 상세 목록은 탐험 지도를 바탕으로 구성한 예시예요.';
  const view = document.getElementById('achievements-view');
  const nav = view.querySelector('#ach-region-nav');
  const overview = view.querySelector('#ach-region-overview');
  const mastery = view.querySelector('#ach-mastery');
  const lists = view.querySelector('#ach-record-lists');
  const picker = view.querySelector('#ach-crop');
  const milestones = view.querySelector('#ach-crop-milestones');
  view.querySelector('#flower-achievement-list').innerHTML = dyeFlowers.renderAchievements();
  view.querySelector('#ach-notebook-art').innerHTML = notebookFigure();
  const completion = new Map(regions.map(region => [region.id, new Set()]));
  let region = regions[0];

  nav.innerHTML = regions.map(({id, name, planned}) =>
    '<a data-ach-region="' + id + '" href="#achievements/' + id + '">' + name +
    (planned ? '<small>추후 확장</small>' : '') + '</a>'
  ).join('');
  picker.innerHTML = PLANTS.map(plant =>
    '<option value="' + plant.id + '"' + (plant.id === 'P002' ? ' selected' : '') +
    '>' + plant.name + '</option>'
  ).join('');

  function score() {
    return [...completion.get(region.id)].reduce((sum, key) => sum + points[key.split(':')[0]], 0);
  }

  function sprite(className, index, columns, rows) {
    const x = (index % columns) * 100 / (columns - 1);
    const y = Math.floor(index / columns) * 100 / (rows - 1);
    return '<span class="' + className + '" style="--ach-x:' + x + '%;--ach-y:' + y + '%" aria-hidden="true"></span>';
  }

  function badgeCards(total) {
    return badges.map((badge, index) => {
      const earned = total >= badge.points;
      return '<li class="ach-badge" data-earned="' + earned + '">' + sprite('ach-medal', index, 2, 2) +
        '<div><strong>' + badge.name + ' 배지</strong><span>' + badge.reward +
        '</span><small>' + badge.points + '점' + (earned ? ' · 획득' : '') + '</small></div></li>';
    }).join('');
  }

  function renderMastery() {
    const total = score();
    const target = badges.find(badge => badge.points > total);
    const next = region.planned ? '확장 예정 지역' :
      target ? target.name + ' 배지까지 ' + (target.points - total) + '점' : '모든 배지 획득';
    mastery.innerHTML = [
      '<div class="ach-score"><div><h3>지역 숙련도</h3><p>' + next + '</p></div>',
      '<p class="ach-total">' + total + '<small> / 100점</small></p></div>',
      '<progress max="100" value="' + total + '" aria-label="' + region.name + ' 숙련도"></progress>',
      '<ol class="ach-badges" aria-label="단계별 배지와 보상">' + badgeCards(total) + '</ol>'
    ].join('');
  }

  function renderList(kind, label) {
    const done = completion.get(region.id);
    return '<section class="ach-list-card"><header><h3>' + label + '</h3><span>각 ' + points[kind] + '점</span></header><ul>' +
      region[kind].map(([name, goal, art], index) => {
        const key = kind + ':' + index;
        const illustrated = kind === 'tasks';
        const className = 'ach-task' + (illustrated ? ' ach-task-illustrated' : '') + (region.planned ? ' ach-task-planned' : '');
        const content = (region.planned ? '' : '<span class="ach-checkbox" aria-hidden="true"></span>') +
          (illustrated ? sprite('ach-task-art', art, 4, 3) : '') +
          '<span><strong>' + name + '</strong><small>' + goal + '</small></span>';
        return '<li>' + (region.planned ? '<div class="' + className + '">' + content + '</div>' :
          '<button type="button" class="' + className + '" data-ach-task="' + key + '" aria-pressed="' +
          done.has(key) + '">' + content + '</button>') + '</li>';
      }).join('') + '</ul></section>';
  }

  function renderCrop(id) {
    const plant = PLANTS.find(entry => entry.id === id);
    if (!plant) return;
    picker.value = plant.id;
    milestones.innerHTML = harvestMilestones.map(quantity =>
      '<li><strong>' + quantity + '개</strong><span>' + plant.name + ' 누적 수확</span></li>'
    ).join('');
    view.querySelector('#ach-crop-link').href = '#plants/' + plant.id;
  }

  function render(id) {
    const crop = PLANTS.find(plant => plant.id === id);
    region = regions.find(entry => entry.id === id || (crop && entry.name === crop.region)) || regions[0];
    for (const link of nav.querySelectorAll('[data-ach-region]')) {
      if (link.dataset.achRegion === region.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    overview.dataset.regionColor = region.color;
    overview.innerHTML = '<div><h3>' + region.name + '</h3><p>' + region.description +
      '</p></div><a href="#map/' + region.id + '">지도에서 보기 ↗</a>';
    view.querySelector('#ach-preview-hint').textContent = region.planned ? scopeNote :
      scopeNote + ' 항목을 눌러 숙련도와 배지 획득을 미리 볼 수 있어요.';
    renderMastery();
    lists.innerHTML = renderList('tasks', '복원 달성과제') + renderList('records', '장기 업적');
    renderCrop(crop?.id || picker.value || 'P002');
  }

  lists.addEventListener('click', event => {
    const button = event.target.closest('button[data-ach-task]');
    if (!button || region.planned) return;
    const key = button.dataset.achTask;
    const done = completion.get(region.id);
    const checked = !done.has(key);
    if (checked) done.add(key);
    else done.delete(key);
    button.setAttribute('aria-pressed', String(checked));
    renderMastery();
    view.querySelector('#ach-live').textContent = region.name + ' 숙련도 ' + score() + '점';
  });
  picker.addEventListener('change', () => renderCrop(picker.value));

  function search(query) {
    const matches = regions.filter(entry =>
      [entry.name, ...entry.tasks.flatMap(([name, goal]) => [name, goal]), ...entry.records.flat()].join(' ').toLowerCase().includes(query)
    ).map(entry => ({url: '#achievements/' + entry.id, title: entry.name + ' 업적', description: '복원 달성과제 · 장기 업적'}));
    const crops = PLANTS.filter(plant => [plant.name, plant.name + ' 100개 수확'].join(' ').includes(query));
    matches.push(...crops.map(plant => ({
      url: '#achievements/' + plant.id, title: plant.name + ' 수확 업적', description: '누적 수확 10 · 50 · 100개'
    })));
    if ([title, description, '배지 뱃지 수확 기록'].join(' ').includes(query)) {
      matches.unshift({url: '#achievements', title, description: '지역별 과제와 업적, 단계별 배지'});
    }
    return matches;
  }

  function printRecords(items, label, perItem) {
    return '<h4>' + label + ' · 각 ' + perItem + '점</h4><ul class="doc-list">' +
      items.map(([name, condition]) => '<li><strong>' + name + '</strong> · ' + condition + '</li>').join('') + '</ul>';
  }

  function notebookFigure() {
    return '<figure class="design-screen"><h4>복원의 기록 수첩</h4><div class="design-screen-image">' +
      '<img src="system-art/achievement-notebook.webp" width="1500" height="844" loading="lazy" ' +
      'alt="가운데 제본선이 있는 펼친 가죽 수첩. 왼쪽에 지역 지도, 오른쪽에 달성과제와 장기 업적, 아래에 숙련도 배지가 보인다."></div>' +
      '<figcaption>지역 지도에서 탐험지를 고르고, 맞은편에서 달성과제와 장기 업적을 읽는 화면안입니다. 아래 띠에는 25·50·75·100점 배지를 차례로 표시합니다.</figcaption></figure>';
  }

  function renderPrint() {
    return '<article class="print-chapter" id="print-achievements"><header class="chapter-header"><h2>' + title +
      '</h2><p>' + description + '</p></header><p class="doc-paragraph">' + scopeNote + '</p>' +
      notebookFigure() + '<h3>숙련도 배지와 보상</h3><ul class="doc-list">' + badges.map(badge => '<li>' + badge.points + '점 · ' +
      badge.name + ' 배지 · ' + badge.reward + '</li>').join('') + '</ul>' +
      '<p class="doc-paragraph">작물 15종별 누적 수확 10 · 50 · 100개 기록. 숙련도는 다음 지역 해금 조건과 별도로 쌓여요.</p>' +
      regions.map(entry => '<section id="print-achievements-' + entry.id + '"><h3>' + entry.name +
      (entry.planned ? ' · 추후 확장' : '') + '</h3>' +
      printRecords(entry.tasks, '복원 달성과제', points.tasks) +
      printRecords(entry.records, '장기 업적', points.records) + '</section>').join('') +
      '<section><h3>염색꽃 과제와 업적 · 선택 정화 시안</h3>' + dyeFlowers.renderAchievements(false) + '</section></article>';
  }

  return {render, search, renderPrint};
})();
