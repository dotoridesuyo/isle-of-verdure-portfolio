'use strict';

const petSummon = (() => {
  const title = '숲의 친구 소환';
  const odds = {equipment: 85, pet: 15};
  const guaranteeAfter = 20;
  const items = ANIMALS.map(animal => ({animal, ...petUpgrades.itemFor(animal)}));
  const perItem = rate => (rate / items.length) + '%';
  const duplicateRules = [
    ['이미 보유한 펫', '동일 종류의 기본 상태 개체 1마리 추가', '도감은 종류별 첫 획득에만 등록 · 보유 목록에서 총 마릿수와 개체별 상태 확인'],
    ['이미 보관 중인 전용 장비', '장비 재고 1개 추가', '대응 펫이 없거나 모두 진화한 상태에서도 전량 보관']
  ];
  const sources = [
    {url:'#chapter/01/section-7/recruit', title:'본편 Lv.4 첫 소환 안내', detail:'튜토리얼 전용 10장으로 무료 10연차 1회'},
    {url:'#chapter/20/section-4', title:'정원사 레벨 보상', detail:'Lv.5 펫 소환권 100장 · Lv.10·15·25 각 1장 · Lv.20 2장 · Lv.30 3장'},
    {url:'#quests/weekly/1', title:'주간 퀘스트', detail:'한 주에 과제 2개 완료 시 1장'},
    {url:'#chapter/21/section-3', title:'Lv.30 주간 랭킹', detail:'순위별 1~5장 · 복수 입상 시 가장 높은 순위 기준으로 주 최대 5장 지급하는 안'},
    {title:'특별 이벤트', detail:'이벤트 보상으로 지급하는 안'}
  ];

  function equipmentCard({animal, name, image, effect}) {
    return '<article class="shop-card summon-equipment-card" id="summon-entry-' + animal.id +
      '" aria-labelledby="summon-name-' + animal.id + '">' +
      '<div class="shop-art-frame"><img class="summon-item-art" src="' + image +
      '" width="128" height="128" loading="lazy" alt=""></div><div class="shop-card-copy">' +
      '<h4 id="summon-name-' + animal.id + '">' + name + '</h4>' +
      '<a class="summon-owner" href="#animals/' + animal.id + '/upgrade">' + petUpgrades.appearance(animal) +
      '<span>' + animal.name + ' 전용 ↗</span></a>' +
      '<p class="shop-card-design">' + effect + '</p></div></article>';
  }

  function renderOdds(prefix) {
    return '<section class="shop-paper summon-section" id="' + prefix + 'summon-entry-odds"><h3>일반 소환 확률</h3>' +
      '<dl class="summon-odds">' +
      '<div><dt>전용 장비</dt><dd><strong>' + odds.equipment + '%</strong><span>' +
      items.length + '종 · 각 ' + perItem(odds.equipment) + '</span></dd></div>' +
      '<div><dt>펫</dt><dd><strong>' + odds.pet + '%</strong><span>' +
      items.length + '종 · 각 ' + perItem(odds.pet) + '</span></dd></div></dl>' +
      '<p>소환 1회에 소환권 1장을 써서 결과 하나를 얻습니다. 10연 소환은 10장을 쓰며, 결과를 1회씩 순서대로 판정합니다. 펫 등급과 관계없이 각 풀 안의 항목은 같은 확률로 나옵니다.</p></section>';
  }

  function renderGuarantee(prefix) {
    return '<section class="shop-paper summon-section" id="' + prefix + 'summon-entry-guarantee"><h3>확정 소환</h3>' +
      '<p class="summon-guarantee">펫을 ' + guaranteeAfter + '회 연속 획득하지 못하면 <strong>' +
      (guaranteeAfter + 1) + '번째는 펫 확정</strong></p><ul class="doc-list">' +
      '<li>장비를 뽑으면 연속 미획득 횟수가 1 올라갑니다. 미획득 횟수가 ' + guaranteeAfter +
      '회에 도달하면 다음 소환의 펫 확률은 100%입니다. 기존 펫 ' + items.length + '종 중 한 마리가 나오며, 펫 한 종당 확률은 ' + perItem(100) + '입니다.</li>' +
      '<li>펫이 나오면 중복 여부와 관계없이 횟수를 0으로 초기화합니다. 확정 소환에서 이미 보유한 종류가 나오면 새 개체 1마리를 추가합니다.</li>' +
      '<li>연속 미획득 횟수는 계정에 저장해 재접속하거나 날짜가 바뀌어도 유지합니다. 10연 소환 도중 확정 조건을 채우면 다음 회차에 바로 적용합니다.</li>' +
      '</ul></section>';
  }

  function renderRewards(prefix) {
    return '<div class="summon-plans"><section class="shop-paper summon-section" id="' + prefix + 'summon-entry-duplicates">' +
      '<h3>중복 획득과 개체별 보관</h3><p class="shop-hint">기존 공용 펫 조각·정령 가루 잔액의 처리와 교환 정책은 검토 중입니다.</p>' +
      '<dl class="summon-duplicates">' + duplicateRules.map(([kind, reward, detail]) =>
        '<div><dt>' + kind + '</dt><dd>' + reward + '<span>' + detail + '</span></dd></div>').join('') +
      '</dl></section><section class="shop-paper summon-section" id="' + prefix + 'summon-entry-tickets">' +
      '<h3>소환권 획득</h3><p class="shop-hint">Lv.5 100장은 본편 개정 보상입니다. 랭킹 보상 수량은 플레이테스트 시안입니다.</p><ul class="doc-list">' +
      sources.map(({url, title, detail}) => '<li><strong>' +
        (url ? '<a class="summon-text-link" href="' + url + '">' + title + '</a>' : title) +
        '</strong> · ' + detail + '</li>').join('') +
      '</ul></section></div>';
  }

  function renderEquipment(prefix, print) {
    const equipment = print
      ? '<ul class="doc-list">' + items.map(({animal, name}) => '<li>' + animal.name + ' · ' + name + '</li>').join('') + '</ul>'
      : '<div class="shop-group-grid">' + items.map(equipmentCard).join('') + '</div>';
    return '<section class="summon-section summon-equipment" id="' + prefix + 'summon-entry-equipment"><header>' +
      '<h3>펫별 전용 장비 ' + items.length + '종</h3>' +
      '<p>전용 장비는 획득한 수량만큼 보관합니다. 대응 종류의 기본형 펫 한 마리를 선택해 장비 1개를 사용하면 해당 개체의 외형과 능력이 영구 업그레이드됩니다.</p>' +
      '<p>펫·장비 탭에서 보유 개체와 장비 재고를 확인합니다. 개체를 선택하면 능력, 진화 상태, 보유 전용 장비 수량과 장착 버튼이 표시됩니다.</p></header>' +
      '<figure class="opening-scene-art"><img src="intro-art/pet-inventory.webp" alt="펫과 장비 탭, 소리 개체 목록, 장비 재고와 장착 버튼이 보이는 보관함 시안" width="1672" height="941" loading="lazy" decoding="async"><figcaption>펫·장비 보관함 UI 시안</figcaption></figure>' + equipment + '</section>';
  }

  function renderContent(print = false) {
    const prefix = print ? 'print-' : '';
    return renderOdds(prefix) + renderGuarantee(prefix) + renderRewards(prefix) + renderEquipment(prefix, print);
  }

  document.getElementById('summon-content').innerHTML = renderContent();

  function search(query) {
    const entries = [
      {url:'#summon', title:'펫 뽑기 · ' + title, description:'펫 가챠 · 장비 ' + odds.equipment + '% · 펫 ' + odds.pet + '%'},
      {url:'#summon/guarantee', title:'확정 소환', description:guaranteeAfter + '회 연속 펫 미획득 · ' + (guaranteeAfter + 1) + '번째 펫 확정 · 천장'},
      {url:'#summon/duplicates', title:'중복 획득과 개체별 보관', description:'펫 개체 추가 · 전용 장비 전량 보관 · 펫 장비 인벤토리'},
      {url:'#summon/tickets', title:'소환권 획득', description:'정원사 레벨 보상 · 주간 퀘스트 · 주간 랭킹 · 특별 이벤트'},
      ...items.map(({animal, name, effect, summonUrl}) => ({
        url:summonUrl, title:name, description:animal.name + ' 전용 장비 · ' + effect
      }))
    ];
    return entries.filter(entry => (entry.title + ' ' + entry.description).toLowerCase().includes(query));
  }

  function renderPrint() {
    return '<article class="print-chapter" id="print-summon"><header class="chapter-header"><h2>펫 뽑기</h2><p>' +
      title + '</p></header>' + renderContent(true) + '</article>';
  }

  return {search, renderPrint};
})();
