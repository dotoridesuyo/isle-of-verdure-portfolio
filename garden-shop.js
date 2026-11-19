'use strict';

const gardenShop = (() => {
  const groups = [
    {id:'initial', name:'정원', condition:'첫 기초 정화액 제작 후 진열'},
    {id:'dew', name:'이슬 숲', condition:'이슬 숲 첫 방문 후 정원에 돌아오면 진열'},
    {id:'meadow', name:'햇살 초원', condition:'햇살 초원 첫 방문 후 정원에 돌아오면 진열'},
    {id:'marsh', name:'안개 습지', condition:'안개 습지 첫 방문 후 정원에 돌아오면 진열'},
    {id:'ancient', name:'고대의 숲', condition:'고대의 숲 확장 후 진열 예정'},
    {id:'rare', name:'희귀 작물 제작 장식', condition:'인삼당근을 재료로 사용'}
  ];
  const craftGroup = 5;
  const products = [
    ["F01", 0, "납작돌 길", "1×1", 3, "회색 납작돌 세 개가 놓인 흙길. 길 위로 통행 가능."],
    ["F02", 0, "낮은 나무 울타리", "1×1", 10, "연한 목재 기둥과 두 줄의 가로대. 옆 칸의 울타리와 이어짐."],
    ["F03", 0, "작은 흰꽃 화분", "1×1", 15, "흰 꽃 세 송이를 담은 토분. 현관 옆과 화단 모서리 배치용."],
    ["F04", 0, "나무 표지판", "1×1", 13, "새싹을 새긴 목재 안내판. 텃밭 입구에 배치."],
    ["F05", 0, "통나무 벤치", "2×1", 26, "둥근 받침 두 개가 받치는 낮은 통나무 좌석."],
    ["F06", 0, "오두막 등불", "1×1", 21, "짧은 나무 기둥에 매단 황동 등. 밤에는 작은 불빛이 점등."],
    ["F07", 1, "이끼 디딤돌", "1×1", 6, "회색 돌 가장자리에 이끼가 자란 디딤돌. 위로 통행 가능."],
    ["F08", 1, "고사리 화분", "1×1", 20, "낮은 화분에서 고사리가 부채처럼 펼쳐짐."],
    ["F09", 1, "개울돌 물확", "1×1", 31, "물방울이 떨어지는 둥근 돌그릇."],
    ["F10", 1, "이슬꽃 아치", "2×1", 62, "연한 목재에 연청색 종꽃 덩굴이 감긴 아치. 아래로 통행 가능."],
    ["F11", 2, "햇살꽃 꽃상자", "2×1", 53, "길쭉한 나무 상자에 노란 꽃이 배치."],
    ["F12", 2, "바람개비", "1×1", 35, "크림색·하늘색 날개에 바람 방향 회전 연출 적용."],
    ["F13", 2, "줄무늬 피크닉 매트", "2×2", 50, "살구색과 크림색 줄무늬 매트. 위로 통행 가능."],
    ["F14", 2, "천막 테이블", "2×2", 101, "천막 아래 원목 탁자와 낮은 좌석을 배치."],
    ["F15", 3, "물가 나무 데크", "1×1", 13, "물가에 이어 까는 나무판. 위로 통행 가능."],
    ["F16", 3, "수련 수반", "2×2", 60, "연분홍 수련을 띄운 돌 수반에 잔물결 연출 적용."],
    ["F17", 3, "갈대 등불", "1×1", 43, "갈대 모양 받침의 유리 등. 밤에는 연보라 불빛이 점등."],
    ["F18", 4, "별빛고사리 화분", "1×1", 47, "짙은 잎 끝에 작은 빛이 보이는 화분."],
    ["F19", 4, "뿌리 책장", "2×1", 92, "굵은 뿌리 사이에 표본병과 낡은 책이 놓인 선반."],
    ["F20", 4, "고목 쉼터", "3×2", 138, "속이 빈 고목 안에 길고 낮은 좌석을 배치."],
    ["F22", 1, "개울가 낮은 의자", "1×1", 22, "개울가에 두는 등받이 의자. 이끼가 낀 돌받침 위에 좌석 배치."],
    ["F23", 2, "그늘 해먹", "2×2", 63, "낮은 목재 기둥에 줄무늬 천을 걸어 가볍게 흔들리는 쉼터."],
    ["F24", 0, "습지 관찰 안내판", "1×1", 38, "갈대 무늬를 새긴 녹색 안내판. 첫 기초 정화액 제작으로 상점이 개방되면 진열. 습지 데크나 개울가에 배치."]
  ].map(([id, group, name, size, price, design]) => ({id, group, name, size, price, design}));
  products.push({
    id: 'F21', group: craftGroup, name: '인삼당근 랜턴',
    design: '인삼당근 뿌리 형태의 정원용 랜턴. 따뜻한 색상의 조명 연출.'
  });

  const artSheets = {
    original: {columns: 3, rows: 2, side: 512, ids: ['F05', 'F03', 'F06', 'F02', 'F10', 'F16']},
    garden: {columns: 3, rows: 2, side: 512, ids: ['F01', 'F04', 'F07', 'F08', 'F09', 'F11']},
    meadow: {columns: 3, rows: 2, side: 512, ids: ['F12', 'F13', 'F14', 'F15', 'F17', 'F18']},
    ancient: {columns: 2, rows: 2, side: 627, ids: ['F19', 'F20']},
    lantern: {columns: 1, rows: 1, side: 1254, ids: ['F21']},
    workshop: {columns: 3, rows: 2, side: 512, ids: ['F22', 'F23', 'F24']}
  };
  // A few silhouettes extend into the margins of their grid cells.
  const artCrops = {F03: [525, 0, 490], F10: [501, 495, 520], F12: [0, 12, 490], F13: [480, 0, 512], F21: [115, 123, 1024]};
  const artwork = Object.fromEntries(Object.entries(artSheets).flatMap(([name, sheet]) =>
    sheet.ids.map((id, index) => {
      const {columns, rows, side} = sheet;
      const [left, top, crop] = artCrops[id] || [(index % columns) * side, Math.floor(index / columns) * side, side];
      return [id, {name, width: columns * side, height: rows * side, left, top, crop}];
    })
  ));
  const craftSource = '희귀 작물 제작 장식';
  const craftRecipe = '인삼당근 사용 · 필요 수량과 추가 재료 미정';

  const plantPrices = {
    P001: [6, 2], P002: [8, 3], P003: [7, 3], P004: [11, 4], P005: [10, 4],
    P006: [14, 5], P007: [19, 6], P008: [7, 3], P009: [11, 4], P010: [10, 4],
    P011: [13, 5], P012: [13, 5], P013: [14, 5], P014: [null, 6], P015: [null, 7]
  };
  const harvestRates = [['목재', 5], ['돌', 3]];
  const shopTitle = '상점';
  const shopIntro = '첫 기초 정화액 제작 후 개방. 아이템과 가구의 진열 조건을 확인 가능.';
  const shopLocation = '정원 오두막에서 텃밭으로 가는 길 옆 연녹색 천막.';
  const designNote = '가격과 진열 조건은 플레이테스트용 시안.';
  const supplies = [
    {id:'dew-grass',name:'이슬풀 씨앗',use:'이슬잎을 얻기 위한 재파종',condition:'정원에서 이슬풀을 처음 기른 이후',href:'#plants/P001'},
    {id:'dew-flower',name:'이슬종꽃 씨앗',use:'종꽃잎을 얻기 위한 재파종',condition:'정원에서 이슬종꽃을 처음 기른 이후',href:'#plants/P002'},
    {id:'sun-flower',name:'햇살방울꽃 씨앗',use:'햇살꽃잎을 얻기 위한 재파종',condition:'정원에서 햇살방울꽃을 처음 기른 이후',href:'#plants/P004'},
    {id:'wood',name:'목재',use:'꽃받침대와 벤치 등 가구 제작',condition:'상점 개방 이후',href:'#workshop'},
    {id:'stone',name:'돌',use:'채집·장식 제작에 사용하는 기초 재료',condition:'상점 개방 이후',href:'#shop/materials'}
  ];
  const suppliesNote = '재파종과 각종 제작에 쓰는 기본 품목. 진열 조건은 시안이며 골드 구매가는 미정.';


  const rules = [
    ['상점 재화와 퀘스트 보상', '상점에서는 재료를 팔아 골드를 얻고 골드로 구매. 보상안의 새싹 코인과 상점 골드를 같은 재화로 볼지는 검토 중.'],
    ['재료 판매', '다음 필수 정화에 쓰는 수확물과 첫 식재용 씨앗을 남겨두고 여유분을 판매할 수 있음.'],
    ['가구 배치', '구매한 가구는 장식 보관함에 보관됨. 90도 회전과 회수·재배치가 가능하고 통로나 기존 시설은 막을 수 없음.']
  ];

  function formatGold(value) {
    return value.toLocaleString('ko-KR') + ' G';
  }

  function illustration(item) {
    const {name, width, height, left, top, crop} = artwork[item.id];
    const position = (offset, length) => length === crop ? '0%' : (offset * 100 / (length - crop)).toFixed(3) + '%';
    const style = [
      '--art-image:url(furniture/' + name + '.webp)',
      '--art-width:' + (width * 100 / crop).toFixed(3) + '%',
      '--art-height:' + (height * 100 / crop).toFixed(3) + '%',
      '--art-x:' + position(left, width),
      '--art-y:' + position(top, height)
    ].join(';');
    return '<span class="shop-art" style="' + style + '" aria-hidden="true"></span>';
  }

  function rulesList() {
    return '<dl class="shop-rule-list">' +
      rules.map(([name, rule]) => '<div><dt>' + name + '</dt><dd>' + rule + '</dd></div>').join('') + '</dl>';
  }

  function salesTable() {
    return '<div class="table-scroll"><table class="shop-sales-table"><thead><tr><th scope="col">품목</th>' +
      '<th scope="col">수확물·채집 재료</th><th scope="col">씨앗</th></tr></thead><tbody>' +
      harvestRates.map(([name, price]) => '<tr><th scope="row">' + name + '</th><td>' + formatGold(price) +
        '</td><td>—</td></tr>').join('') +
      PLANTS.map(plant => {
        const [harvest, seed] = plantPrices[plant.id];
        const value = harvest ? PLANT_HARVESTS[plant.id] + ' · ' + formatGold(harvest) : '—';
        return '<tr><th scope="row">' + plant.name + '</th><td>' + value + '</td><td>' + formatGold(seed) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function productCard(item) {
    const price = item.price ? '<span class="shop-price">' + formatGold(item.price) + '</span>' :
      '<span class="shop-recipe-tag">' + craftSource + '</span>';
    return '<article class="shop-card" id="shop-entry-' + item.id + '" aria-labelledby="shop-name-' + item.id + '">' +
      '<div class="shop-art-frame">' + illustration(item) + '</div><div class="shop-card-copy"><div class="shop-card-title">' +
      '<h4 id="shop-name-' + item.id + '">' + item.name + '</h4>' + price + '</div>' +
      '<p class="shop-card-meta">' + (item.size ? '배치 ' + item.size + '칸' : craftRecipe) + '</p>' +
      '<p class="shop-card-design">' + item.design + '</p></div></article>';
  }

  function suppliesTable(print = false) {
    const prefix = print ? 'print-' : '';
    return '<div class="table-scroll"><table class="shop-sales-table"><thead><tr><th scope="col">품목</th>' +
      '<th scope="col">용도</th><th scope="col">진열 조건 시안</th></tr></thead><tbody>' +
      supplies.map(item => '<tr id="' + prefix + 'shop-entry-supply-' + item.id + '"><th scope="row">' +
        '<a href="' + item.href + '">' + item.name + '</a></th><td>' + item.use + '</td><td>' + item.condition +
        '</td></tr>').join('') + '</tbody></table></div>';
  }

  function printItems() {
    return '<section id="print-shop-entry-items"><h3>아이템</h3><section id="print-shop-entry-supplies">' +
      '<h4>씨앗·기초 재료 구매 시안</h4><p class="doc-paragraph">' + suppliesNote + '</p>' +
      suppliesTable(true) + '</section></section>';
  }

  const view = document.getElementById('shop-view');
  view.querySelector('#shop-intro-copy').textContent = shopIntro;
  view.querySelector('#shop-location').textContent = shopLocation;
  view.querySelector('#shop-design-note').textContent = designNote;
  view.querySelector('#shop-rules').innerHTML = rulesList();
  view.querySelector('#shop-sale-rates').innerHTML = salesTable();
  view.querySelector('#shop-supplies-note').textContent = suppliesNote;
  view.querySelector('#shop-supplies-table').innerHTML = suppliesTable();
  view.querySelector('#shop-index').innerHTML = groups
    .map(({id, name}) => '<a href="#shop/' + id + '">' + name + '</a>').join('');
  view.querySelector('#shop-catalog').innerHTML = groups.map((group, index) =>
    '<section class="shop-group" id="shop-entry-' + group.id + '" aria-labelledby="shop-section-' + group.id + '">' +
    '<header class="shop-group-heading"><h3 id="shop-section-' + group.id + '">' + group.name +
    '</h3><p>' + group.condition + '</p></header>' +
    '<div class="shop-group-grid">' + products.filter(item => item.group === index).map(productCard).join('') +
    '</div></section>').join('');

  function target(id) {
    return document.getElementById('shop-entry-' + id);
  }

  function search(query) {
    const entries = products.filter(item =>
      [item.name, item.design, item.price ? formatGold(item.price) : craftRecipe].join(' ').toLowerCase().includes(query)
    ).map(item => ({
      url: '#shop/' + item.id, title: item.name,
      description: groups[item.group].name + ' · ' + (item.price ? formatGold(item.price) : craftSource)
    }));
    entries.push(...supplies.filter(item => [item.name,item.use,'씨앗 기초 재료 아이템'].join(' ').includes(query))
      .map(item => ({url:'#shop/supply-' + item.id,title:item.name,description:'씨앗·기초 재료 구매 시안'})));
    if ([shopTitle, shopIntro, '가구상점 가구 상점'].join(' ').includes(query)) {
      entries.unshift({url: '#shop', title: shopTitle, description: '아이템 · 가구 · 재료 판매 단가'});
    }
    if ('재료 판매 단가 수확물 씨앗 골드'.includes(query)) {
      entries.push({url:'#shop/materials', title:'재료 판매 단가', description:'채집 재료 · 수확물 · 씨앗'});
    }
    return entries;
  }

  function renderPrint() {
    return [
      '<article class="print-chapter" id="print-shop"><header class="chapter-header"><h2>' + shopTitle + '</h2><p>' +
        shopIntro + '</p></header>',
      '<p class="doc-paragraph">' + shopLocation + ' ' + designNote + '</p>',
      printItems(),
      '<section id="print-shop-entry-furniture"><h3>가구</h3><div class="table-scroll"><table><thead><tr><th scope="col">가구</th><th scope="col">진열 조건</th>' +
        '<th scope="col">가격 · 제작 재료</th><th scope="col">크기</th></tr></thead><tbody>',
      groups.map((group, index) => products.filter(item => item.group === index).map(item =>
        '<tr id="print-shop-entry-' + item.id + '"><th scope="row">' + item.name + '</th><td>' + group.name +
        ' · ' + group.condition + '</td><td>' + (item.price ? formatGold(item.price) : craftRecipe) +
        '</td><td>' + (item.size ? item.size + '칸' : '미정') + '</td></tr>').join('')).join(''),
      '</tbody></table></div></section><section id="print-shop-entry-materials"><h3>재료 판매 단가</h3>', salesTable(), '</section>', rulesList(), '</article>'
    ].join('');
  }

  return {target, search, renderPrint};
})();
