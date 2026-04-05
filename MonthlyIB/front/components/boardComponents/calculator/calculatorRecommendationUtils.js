import { infoWrap, listWrap } from "./UniversityList";

export const DEFAULT_CALCULATOR_GROUPS = [
  {
    key: "Group1",
    label: "Group 1",
    maxSelectableCount: 2,
    subjects: [
      { name: "English Literature", slEnabled: true, hlEnabled: true },
      { name: "English Language", slEnabled: true, hlEnabled: true },
      { name: "Korean", slEnabled: true, hlEnabled: true },
    ],
  },
  {
    key: "Group2",
    label: "Group 2",
    maxSelectableCount: 2,
    subjects: [
      { name: "English B", slEnabled: true, hlEnabled: true },
      { name: "Mandarin B", slEnabled: true, hlEnabled: true },
      { name: "Spanish B", slEnabled: true, hlEnabled: true },
    ],
  },
  {
    key: "Group3",
    label: "Group 3",
    maxSelectableCount: 2,
    subjects: [
      { name: "Economics", slEnabled: true, hlEnabled: true },
      { name: "Business & Management", slEnabled: true, hlEnabled: true },
      { name: "Psychology", slEnabled: true, hlEnabled: true },
      { name: "Geography", slEnabled: true, hlEnabled: true },
      { name: "History", slEnabled: true, hlEnabled: true },
      { name: "Global Politics", slEnabled: true, hlEnabled: true },
      { name: "Digital Society", slEnabled: true, hlEnabled: true },
      { name: "Philosophy", slEnabled: true, hlEnabled: true },
      {
        name: "Social & Cultural Anthropology",
        slEnabled: true,
        hlEnabled: true,
      },
      { name: "World Religions", slEnabled: true, hlEnabled: false },
    ],
  },
  {
    key: "Group4",
    label: "Group 4",
    maxSelectableCount: 2,
    subjects: [
      { name: "Physics", slEnabled: true, hlEnabled: true },
      { name: "Chemistry", slEnabled: true, hlEnabled: true },
      { name: "Biology", slEnabled: true, hlEnabled: true },
      { name: "Design Technology", slEnabled: true, hlEnabled: true },
      {
        name: "Sports, Exercise & Health Science",
        slEnabled: true,
        hlEnabled: true,
      },
      {
        name: "Environmental System & Societies",
        slEnabled: true,
        hlEnabled: true,
      },
    ],
  },
  {
    key: "Group5",
    label: "Group 5",
    maxSelectableCount: 1,
    subjects: [
      { name: "Math AA", slEnabled: true, hlEnabled: true },
      { name: "Math AI", slEnabled: true, hlEnabled: true },
    ],
  },
  {
    key: "Group6",
    label: "Group 6",
    maxSelectableCount: 1,
    subjects: [
      { name: "Visual Arts", slEnabled: true, hlEnabled: true },
      { name: "Dance", slEnabled: true, hlEnabled: true },
      { name: "Music", slEnabled: true, hlEnabled: true },
      { name: "Film", slEnabled: true, hlEnabled: true },
      { name: "Theatre", slEnabled: true, hlEnabled: true },
    ],
  },
];

export const DEFAULT_SCORE_BANDS = [
  { key: "44", label: "44+", minScore: 44 },
  { key: "43", label: "43+", minScore: 43 },
  { key: "40", label: "40+", minScore: 40 },
  { key: "37", label: "37+", minScore: 37 },
  { key: "34", label: "34+", minScore: 34 },
  { key: "33", label: "33+", minScore: 7 },
];

export const DEFAULT_COUNTRY_OPTIONS = [
  { code: "us", label: "미국" },
  { code: "gb", label: "영국" },
  { code: "sg", label: "싱가포르" },
  { code: "kr", label: "한국" },
  { code: "hk", label: "홍콩" },
  { code: "ca", label: "캐나다" },
  { code: "au", label: "호주" },
  { code: "jp", label: "일본" },
];

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value ?? "";

const normalizeGroupKey = (value) => normalizeText(value).replace(/\s+/g, "");

const buildOrderedSchoolNames = (countryCode) => {
  const orderedNames = [];
  const visitedNames = new Set();
  const countryList = listWrap[countryCode] || {};
  const countryInfo = infoWrap[countryCode] || {};

  DEFAULT_SCORE_BANDS.forEach((band) => {
    (countryList[band.key] || []).forEach((schoolName) => {
      if (visitedNames.has(schoolName)) {
        return;
      }
      visitedNames.add(schoolName);
      orderedNames.push(schoolName);
    });
  });

  Object.keys(countryInfo).forEach((schoolName) => {
    if (visitedNames.has(schoolName)) {
      return;
    }
    visitedNames.add(schoolName);
    orderedNames.push(schoolName);
  });

  return orderedNames;
};

export const buildDefaultCalculatorRecommendationConfig = () => ({
  groups: DEFAULT_CALCULATOR_GROUPS.map((group) => ({
    ...group,
    subjects: group.subjects.map((subject) => ({ ...subject })),
  })),
  scoreBands: DEFAULT_SCORE_BANDS.map((band) => ({ ...band })),
  countries: DEFAULT_COUNTRY_OPTIONS.map((country) => {
    const countryList = listWrap[country.code] || {};
    const countryInfo = infoWrap[country.code] || {};
    const orderedNames = buildOrderedSchoolNames(country.code);

    return {
      code: country.code,
      label: country.label,
      schools: orderedNames.map((schoolName, index) => {
        const schoolInfo = countryInfo[schoolName] || {};

        return {
          id: `${country.code}-${index + 1}`,
          name: normalizeText(schoolInfo.name) || schoolName,
          img: normalizeText(schoolInfo.img),
          ibScore: normalizeText(schoolInfo.IBScore),
          rank: normalizeText(schoolInfo.rank),
          tuition: normalizeText(schoolInfo.tuition),
          bandKeys: DEFAULT_SCORE_BANDS.filter((band) =>
            (countryList[band.key] || []).includes(schoolName)
          ).map((band) => band.key),
        };
      }),
    };
  }),
});

export const normalizeCalculatorRecommendationConfig = (config) => {
  const fallbackConfig = buildDefaultCalculatorRecommendationConfig();
  const incomingGroups = Array.isArray(config?.groups)
    ? config.groups
    : fallbackConfig.groups;
  const incomingBands = Array.isArray(config?.scoreBands)
    ? config.scoreBands
    : fallbackConfig.scoreBands;
  const incomingCountries = Array.isArray(config?.countries)
    ? config.countries
    : fallbackConfig.countries;

  const groups = fallbackConfig.groups.map((fallbackGroup) => {
    const incomingGroup =
      incomingGroups.find(
        (group) => normalizeGroupKey(group?.key) === fallbackGroup.key
      ) || fallbackGroup;

    const seenSubjects = new Set();
    const subjects = Array.isArray(incomingGroup?.subjects)
      ? incomingGroup.subjects
          .map((subject) => {
            const name = normalizeText(subject?.name);
            const slEnabled =
              typeof subject?.slEnabled === "boolean" ? subject.slEnabled : true;
            const hlEnabled =
              typeof subject?.hlEnabled === "boolean" ? subject.hlEnabled : true;

            if (!name || seenSubjects.has(name)) {
              return null;
            }

            seenSubjects.add(name);

            if (!slEnabled && !hlEnabled) {
              return { name, slEnabled: true, hlEnabled: true };
            }

            return { name, slEnabled, hlEnabled };
          })
          .filter(Boolean)
      : [];

    return {
      key: fallbackGroup.key,
      label: normalizeText(incomingGroup?.label) || fallbackGroup.label,
      maxSelectableCount:
        Number(incomingGroup?.maxSelectableCount) > 0
          ? Math.min(Number(incomingGroup.maxSelectableCount), 6)
          : fallbackGroup.maxSelectableCount,
      subjects:
        subjects.length > 0
          ? subjects
          : fallbackGroup.subjects.map((subject) => ({ ...subject })),
    };
  });

  const scoreBands = incomingBands
    .map((band, index) => ({
      key: normalizeText(band?.key) || `${band?.minScore ?? index}`,
      label:
        normalizeText(band?.label) ||
        `${normalizeText(band?.key) || band?.minScore || index}+`,
      minScore: Number(band?.minScore ?? 0),
    }))
    .filter((band, index, array) => {
      if (!band.key) {
        return false;
      }
      return array.findIndex((item) => item.key === band.key) === index;
    })
    .sort((left, right) => right.minScore - left.minScore);

  const countries = incomingCountries
    .map((country, countryIndex) => ({
      code: normalizeText(country?.code).toLowerCase(),
      label:
        normalizeText(country?.label) ||
        DEFAULT_COUNTRY_OPTIONS.find(
          (item) => item.code === normalizeText(country?.code).toLowerCase()
        )?.label ||
        normalizeText(country?.code).toUpperCase(),
      schools: Array.isArray(country?.schools)
        ? country.schools.map((school, schoolIndex) => ({
            id:
              normalizeText(school?.id) ||
              `${normalizeText(country?.code).toLowerCase()}-${schoolIndex + 1}`,
            name: normalizeText(school?.name) || "새 학교",
            img: normalizeText(school?.img),
            ibScore: normalizeText(school?.ibScore),
            rank: normalizeText(school?.rank),
            tuition: normalizeText(school?.tuition),
            bandKeys: Array.isArray(school?.bandKeys)
              ? school.bandKeys
                  .map((bandKey) => normalizeText(bandKey))
                  .filter((bandKey, index, array) => {
                    if (!scoreBands.some((band) => band.key === bandKey)) {
                      return false;
                    }
                    return array.indexOf(bandKey) === index;
                  })
              : [],
          }))
        : [],
    }))
    .filter((country, index, array) => {
      if (!country.code || country.code === "all") {
        return false;
      }
      return array.findIndex((item) => item.code === country.code) === index;
    });

  return {
    groups,
    scoreBands: scoreBands.length > 0 ? scoreBands : fallbackConfig.scoreBands,
    countries: countries.length > 0 ? countries : fallbackConfig.countries,
  };
};

export const getCalculatorGroups = (config) =>
  normalizeCalculatorRecommendationConfig(config).groups;

export const getPointBandForTotal = (config, totalPoint) =>
  normalizeCalculatorRecommendationConfig(config).scoreBands.find(
    (band) => totalPoint >= Number(band.minScore || 0)
  ) || null;

export const getCalculatorCountryOptions = (config) => {
  const normalized = normalizeCalculatorRecommendationConfig(config);

  return [
    { code: "all", label: "전체 국가" },
    ...normalized.countries.map((country) => ({
      code: country.code,
      label: country.label,
    })),
  ];
};

const withCountryLabel = (school, countryLabel) => ({
  ...school,
  countryLabel,
});

export const getRecommendedSchools = (config, countryCode, bandKey) => {
  if (!bandKey) {
    return [];
  }

  const normalized = normalizeCalculatorRecommendationConfig(config);

  if (countryCode === "all") {
    return normalized.countries.flatMap((country) =>
      country.schools
        .filter((school) => school.bandKeys.includes(bandKey))
        .map((school) => withCountryLabel(school, country.label))
    );
  }

  const country = normalized.countries.find((item) => item.code === countryCode);
  if (!country) {
    return [];
  }

  return country.schools
    .filter((school) => school.bandKeys.includes(bandKey))
    .map((school) => withCountryLabel(school, country.label));
};
