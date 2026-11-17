'use strict';

const purificationPlan = (() => {
  const recipes = [
    {name:'기초 정화액', ingredients:[['P001',2]], targets:['P002','P003','D01','D03'], phase:'basic',
      access:'이슬풀 첫 정원 수확 뒤 제작'},
    {name:'햇살 정화액', ingredients:[['P002',2],['P001',1]], targets:['P004','P005','P010','D02'], phase:'basic',
      access:'이슬종꽃 첫 정원 수확 뒤 제작'},
    {name:'안개 정화액', ingredients:[['P004',2],['P002',1]], targets:['P006'], phase:'basic',
      access:'햇살방울꽃 첫 정원 수확 뒤 제작'},
    {name:'고대숲 치료제', ingredients:[['P006',2],['P004',1]], targets:['P007'], phase:'basic',
      access:'안개연꽃 첫 정원 수확 뒤 제작 · 고대의 숲 확장안'},
    {name:'이끼숨결 정화액', ingredients:[['P001',1],['P002',1]], targets:['P008'], phase:'special',
      access:'이슬 숲 · 선택 정화'},
    {name:'구름향 정화액', ingredients:[['P004',1],['P003',1]], targets:['P009'], phase:'special',
      access:'햇살 초원 · 선택 정화'},
    {name:'물결잎 정화액', ingredients:[['P006',1],['P008',1]], targets:['P011'], phase:'special',
      access:'안개 습지 · 선택 정화'},
    {name:'솜안개 정화액', ingredients:[['P006',1],['P009',1]], targets:['P012'], phase:'special',
      access:'안개 습지 · 선택 정화'},
    {name:'물별 정화액', ingredients:[['P006',1],['P010',1]], targets:['P013'], phase:'special',
      access:'안개 습지 · 선택 정화'},
    {name:'달빛 정화액', ingredients:[['P007',1],['P011',1],['P012',1]], targets:['P014','D04'], phase:'special',
      access:'고대의 숲 확장안 · 선택 정화'},
    {name:'기억의 새싹 정화액', ingredients:[['P007',2],['P014',1],['P013',1]], targets:['P015'], phase:'special',
      access:'고대의 숲 확장안 · 선택 정화'}
  ];
  const plantNames = Object.fromEntries([
    ...PLANTS.map(plant => [plant.id, plant.name]),
    ...dyeFlowers.flowers.map(plant => [plant.id, plant.name])
  ]);
  const potionByPlant = new Map(recipes.flatMap(recipe => recipe.targets.map(id => [id, recipe])));

  function section(recipe) {
    return '#chapter/18/section-' + (recipe.phase === 'basic' ? 2 : 3);
  }

  function plantLabel(id, text, links) {
    return links ? '<a href="#plants/' + id + '">' + text + '</a>' : text;
  }

  function ingredientList(recipe, links) {
    return recipe.ingredients.map(([id, count]) =>
      plantLabel(id, PLANT_HARVESTS[id], links) + ' ' + count + '개').join(' + ');
  }

  function targetList(recipe, links) {
    return recipe.targets.map(id => plantLabel(id, plantNames[id], links)).join(' · ');
  }

  function table(phase) {
    return '<div class="table-scroll"><table class="potion-table"><thead><tr>' +
      '<th scope="col">정화 물약</th><th scope="col">재료 · 제조 1회 기준</th>' +
      '<th scope="col">정화 대상</th><th scope="col">진행 조건</th></tr></thead><tbody>' +
      recipes.filter(recipe => recipe.phase === phase).map(recipe =>
        '<tr><th scope="row">' + recipe.name + '</th><td>' + ingredientList(recipe, true) + '</td><td>' +
        targetList(recipe, true) + '</td><td>' + recipe.access + '</td></tr>'
      ).join('') + '</tbody></table></div>';
  }

  function describePlant(id, links = true) {
    const recipe = potionByPlant.get(id);
    if (!recipe) return id === 'P001' ? '튜토리얼에서 리프가 구조해 첫 재배에 사용' : '';
    const label = links ? '<a href="' + section(recipe) + '">' + recipe.name + '</a>' : recipe.name;
    return label + ' 1병 사용 · 제조 재료 ' + ingredientList(recipe, false);
  }

  function search(query) {
    return recipes.filter(recipe => [recipe.name, ingredientList(recipe, false), targetList(recipe, false)]
      .join(' ').toLowerCase().includes(query))
      .map(recipe => ({url:section(recipe), title:recipe.name, description:ingredientList(recipe, false) +
        ' · 정화 대상 ' + targetList(recipe, false)}));
  }

  return {table, describePlant, search};
})();
