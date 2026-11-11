# 신록의 섬 · 동물 도감 Unity 구현 자료

현재 포트폴리오의 동물 10종을 Unity 게임의 도감에 연결하기 위한 자료입니다. 작성일 2026.11.12, 버전 v1.0.

## 바로 열기

- [전체 구현 기획서](ANIMAL_CODEX_SPEC.ko.md): 캐릭터 설정, UI, 등급·범위, 수집 기록, 게임 연결 규칙
- [Unity 가져오기 파일](IsleOfVerdure-AnimalCodex-v1.0.unitypackage?raw=true): 압축 해제 없이 Unity에서 Import
- [Unity 소스 묶음](IsleOfVerdure-AnimalCodex-Source-v1.0.zip?raw=true): Assets 폴더 구조와 C# 원본·메타 포함
- [그림이 포함된 기획서](https://dotoridesuyo.github.io/isle-of-verdure-portfolio/UnityAnimalCodex/AnimalCodex-Implementation.ko.html)
- [캐릭터 JSON](animal-catalog.json) · [전체 표 CSV](AnimalCatalog.csv) · [설치·연동 설명](START-HERE.ko.txt)
- [실제 검증 결과와 한계](VALIDATION.txt)

## 등급과 관리 범위

| 등급 | 관리 범위 | 너비 × 깊이 | 동물 친구 |
|---|---:|---:|---|
| 일반 | 2칸 | 2 × 1 | 모리·노루, 토리·토끼, 밤이·고슴도치, 소리·다람쥐 |
| 특별 | 4칸 | 2 × 2 | 누리·수달, 나리·나비, 두리·거북 |
| 희귀 | 6칸 | 3 × 2 | 루나·여우, 포리·너구리 |
| 전설 | 9칸 | 3 × 3 | 별이·부엉이 |

종별 고정 등급. 식물과 같은 일반·특별·희귀·전설 체계 사용. 모서리 배치와 식재 칸 미점유 유지.

## Unity에서 확인

1. Assets → Import Package → Custom Package에서 unitypackage 파일 가져오기.
2. Tools → Isle of Verdure → 동물 도감 → 샘플 생성.
3. 생성된 AnimalCodexSample 씬을 열고 Play.

도감 UI, 검색·필터, 캐릭터 데이터, 관리 범위 계산, 발견·수집 기록 저장 코드를 포함합니다. 샘플의 전체 열람 옵션은 실제 수집 기록을 변경하지 않습니다.

실제 게임에서는 Preview All Entries를 해제하고 기존 작물·인벤토리·정원 시스템에 연결합니다. 현재 그림은 UI용 정지 콘셉트 시안입니다.

## 검증 상태

C# 전체 컴파일과 관리 범위 16패턴 실행 검사를 통과했습니다. Unity 편집기 Import/Play와 Unity 6 환경의 최종 연동은 미검증입니다. 이 환경의 설치된 Unity는 라이선스 미활성 상태이며 Unity 6 편집기는 설치돼 있지 않습니다.

등급 배분·범위는 현재 기획안입니다. 능력 보정 수치·발동 주기·소환 확률은 확정하지 않았습니다.
