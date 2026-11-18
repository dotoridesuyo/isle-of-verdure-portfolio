'use strict';

const explorationMap = (() => {
  const regions = [
    {
      id: 'R00', name: '정원', concept: '재배·제작·꾸미기 거점', position: [23, 71],
      terrain: '할아버지의 오두막과 평평한 텃밭이 있는 숲 가장자리. 탐험에서 가져온 씨앗을 여기서 키워 다음 지역을 준비한다.',
      task: '리프에게 받은 이슬풀 씨앗을 연습 밭에 심는다. 이슬풀을 한 개 수확해 일반 정화 물약을 만들고 첫 오염 구역의 정화를 준비한다.',
      recovery: '오두막 옆 텃밭에서 이슬풀이 다시 자란다. 정원에 꽃띠를 심으면 작은 벌이 찾아온다.',
      unlock: '게임 시작부터 이용할 수 있는 거점.',
      plantIds: ['P001']
    },
    {
      id: 'R01', name: '이슬 숲', concept: '개울과 목교가 있는 첫 정화 지역', position: [49, 50],
      terrain: '이끼 낀 바위 사이로 좁은 개울이 흐른다. 목교 근처 지름길에는 밟혀 드러난 맨흙이 보인다.',
      task: '기초 정화액으로 이슬종꽃을 치료한다. 지름길 입구에 표식을 놓아 목교 쪽으로 이동을 유도하는 복원 활동을 제안했다.',
      recovery: '맨흙 가장자리에 낙엽이 쌓이고 낮은 풀과 고사리 새잎이 올라온다.',
      unlock: '정원에서 첫 이슬풀을 수확해 일반 정화 물약을 만들면 첫 오염 구역으로 이동한다.',
      plantIds: ['P001', 'P002', 'P003', 'P008'],
      discoveries: { P008: '목교를 건너는 길가 · 기본 제작' }
    },
    {
      id: 'R02', name: '햇살 초원', concept: '바람이 부는 꽃과 풀의 구릉', position: [27, 30],
      terrain: '햇볕이 잘 드는 완만한 언덕. 넓은 풀밭 곳곳에 작은 꽃무리가 떨어져 있다.',
      task: '햇살 정화액으로 햇살방울꽃을 치료한다. 비어 있는 구간에 개화 시기가 다른 자생 꽃을 심는 복원 활동을 제안했다.',
      recovery: '작은 꽃무리 사이로 벌과 나비가 오간다.',
      unlock: '이슬 숲의 필수 구역 정화와 핵심 복원 조건을 완료하면 이동할 수 있다. 햇살 정화액은 현장 정화에 사용한다.',
      plantIds: ['P004', 'P005', 'P010', 'P009'],
      discoveries: { P010: '초원 입구 · 작은 화단 장식', P009: '초원 안쪽 바람길 · 꽃다발과 화분 장식' }
    },
    {
      id: 'R03', name: '안개 습지', concept: '개울 하류의 얕은 물과 나무 데크', position: [74, 74],
      terrain: '이슬 숲을 지난 개울이 낮은 지대에서 넓어진다. 옛 배수 홈 때문에 비 뒤에도 물이 오래 고이지 않는다.',
      task: '안개 정화액으로 안개연꽃을 치료한다. 돌과 흙으로 옛 배수 홈의 입구를 막는 복원 활동을 제안했다.',
      recovery: '얕은 물이 더 오래 남고 수초 사이에 올챙이가 찾아온다.',
      unlock: '햇살 초원의 필수 구역 정화와 핵심 복원 조건을 완료하면 이동할 수 있다. 안개 정화액은 현장 정화에 사용한다.',
      plantIds: ['P006', 'P012', 'P011', 'P013'],
      discoveries: {
        P012: '나무 데크 입구 · 섬유 장식', P011: '데크 옆 얕은 물가 · 잎 장식',
        P013: '배수 홈 복원 후 드러나는 물가 · 수변 장식'
      }
    },
    {
      id: 'R04', name: '고대의 숲', concept: '물길이 시작되는 오래된 능선 숲', position: [77, 29],
      terrain: '높은 능선에 굵은 나무가 겹겹이 서 있다. 그늘 아래 어린 식물이 자리 잡을 공간이 줄어들었다.',
      task: '확장 기획에서는 별빛고사리를 정화하고, 쓰러진 통나무 둘레를 보호 구간으로 표시한다.',
      recovery: '통나무에 이끼가 자리 잡고 어린 고사리와 묘목이 자란다.',
      unlock: '확장 기획에서는 안개 습지의 필수 구역 정화와 핵심 복원을 완료하면 이동할 수 있다. 별빛고사리 복원에는 고대숲 치료제를 사용한다.',
      plantIds: ['P007', 'P014', 'P015'],
      discoveries: {P007:'확장 지역의 첫 정화 대상', P014:'추후 확장', P015:'추후 확장'},
      plantNote: '고대의 숲은 데모 이후 확장 지역입니다. 아래 선택 정화 식물도 확장안입니다.'
    }
  ];

  const view = document.getElementById('map-view');
  const pins = view.querySelector('#map-pins');
  const viewport = view.querySelector('.map-viewport');
  const routeLinks = view.querySelector('#map-route-links');
  const detail = view.querySelector('#map-detail');
  let stage = 'start';
  let selected = regions[0];

  function regionStatus(region) {
    if (region.id === 'R00') return '시작 거점';
    if (region.id === 'R04') return '추후 확장';
    return region.id === 'R01' && stage === 'dew' ? '해금' : '잠김';
  }

  function regionLink({id, name}, className, style = '') {
    return `<a class="${className}" data-map-region="${id}" href="#map/${id}"${style}>
      <span class="map-region-icon" aria-hidden="true"></span>
      <span>${name}</span>
    </a>`;
  }

  pins.innerHTML = regions.map(region =>
    regionLink(region, 'map-pin', ` style="--pin-x:${region.position[0]}%;--pin-y:${region.position[1]}%"`)
  ).join('');
  routeLinks.innerHTML = regions.map(region => regionLink(region, 'map-route-link')).join('');

  function render(id) {
    selected = regions.find(region => region.id === id) || regions[0];
    for (const region of regions) {
      const status = regionStatus(region);
      for (const link of view.querySelectorAll(`[data-map-region="${region.id}"]`)) {
        link.dataset.locked = String(status === '잠김' || status === '추후 확장');
        link.setAttribute('aria-label', `${region.name}, ${status}`);
        if (region === selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
    for (const button of view.querySelectorAll('[data-map-stage]')) {
      button.setAttribute('aria-pressed', String(button.dataset.mapStage === stage));
    }

    const status = regionStatus(selected);
    detail.innerHTML = `
      <header class="map-detail-header">
        <h3>${selected.name}</h3>
        <span class="map-state" data-locked="${status === '잠김' || status === '추후 확장'}">${status}</span>
      </header>
      <p class="map-concept">${selected.concept}</p>
      <p>${selected.terrain}</p>
      ${selected.id === "R00" ? '<a class="map-recipe-link" href="#shop">상점 · 오두막에서 텃밭으로 가는 길 옆 ↗</a>' : ""}
      <section class="map-detail-block">
        <h4>정화와 복원</h4><p>${selected.task}</p>
        <a class="map-recipe-link" href="#chapter/18">정화 물약 레시피 ↗</a>
        <p class="map-recovery"><strong>복원 연출 시안</strong> ${selected.recovery}</p>
      </section>
      <section class="map-detail-block">
        <h4>식물과 수확 재료</h4>${renderMaterials(selected, true)}
        ${selected.plantNote ? `<p class="map-plant-note">${selected.plantNote}</p>` : ''}
        ${dyeFlowers.mapNotes(selected.id)}
      </section>
      <section class="map-detail-block">
        <h4>이동 해금 <small>본편 기획 기준</small></h4>
        <p>${selected.unlock}</p>
      </section>`;
  }

  for (const button of view.querySelectorAll('[data-map-stage]')) {
    button.addEventListener('click', () => {
      stage = button.dataset.mapStage;
      viewport.dataset.mapArt = stage;
      render(selected.id);
    });
  }

  function renderMaterials(region, linkToCatalog = false) {
    return '<dl class="map-materials">' + region.plantIds.map(id => {
      const plant = PLANTS.find(entry => entry.id === id);
      const discovery = region.discoveries?.[id];
      const label = linkToCatalog ? '<a href="#plants/' + id + '">' + plant.name + '</a>' : plant.name;
      const potion = purificationPlan.describePlant(id, linkToCatalog);
      return '<div><dt>' + label + (discovery ? '<small>' + discovery + '</small>' : '') +
        '</dt><dd>' + PLANT_HARVESTS[id] + '<small class="map-potion">' + potion + '</small></dd></div>';
    }).join('') + '</dl>';
  }

  function renderPrint() {
    const labels = regions.map(region => '<span class="map-pin" style="--pin-x:' +
      region.position[0] + '%;--pin-y:' + region.position[1] + '%">' + region.name + '</span>').join('');
    return '<figure class="print-map-figure"><div class="map-viewport">' +
      '<img class="map-illustration" src="island-atlas.webp" width="1536" height="1024" alt="정원과 네 탐험 지역이 있는 신록의 섬 지도">' +
      labels + '</div><figcaption>데모 탐험은 이슬 숲 · 햇살 초원 · 안개 습지에서 진행합니다.</figcaption></figure>' +
      regions.map(region => '<section class="print-map-region"><h3>' + region.name + ' <small>' +
        (region.id === 'R00' ? '시작 거점' : region.id === 'R04' ? '추후 확장' : '데모 탐험 지역') +
        '</small></h3><p>' + region.terrain + '</p><p>' + region.task + '</p>' + renderMaterials(region) + dyeFlowers.mapNotes(region.id, false) +
        (region.plantNote ? '<p>' + region.plantNote + '</p>' : '') + '<p><strong>이동 해금</strong> ' +
        region.unlock + '</p></section>').join('');
  }

  function search(query) {
    return regions.filter(region => [region.name, region.concept, region.terrain, region.task, region.recovery,
      region.unlock, region.plantNote, ...region.plantIds.map(id => PLANT_HARVESTS[id])].join(' ').toLowerCase().includes(query));
  }

  return { render, renderPrint, search };
})();
