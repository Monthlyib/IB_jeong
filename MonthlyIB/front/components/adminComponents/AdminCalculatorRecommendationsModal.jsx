"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./AdminStyle.module.css";

const createBandDraft = () => ({
  key: `band-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: "새 점수대",
  minScore: 0,
});

const createCountryDraft = () => ({
  code: `country-${Date.now()}`,
  label: "새 국가",
  schools: [],
});

const createSchoolDraft = () => ({
  id: `school-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "새 학교",
  img: "",
  ibScore: "",
  rank: "",
  tuition: "",
  bandKeys: [],
});

const normalizeConfig = (config) => ({
  scoreBands: Array.isArray(config?.scoreBands) ? config.scoreBands : [],
  countries: Array.isArray(config?.countries) ? config.countries : [],
});

const AdminCalculatorRecommendationsModal = ({
  config,
  onClose,
  onSave,
  saving,
}) => {
  const closeRef = useRef(null);
  const [draft, setDraft] = useState(normalizeConfig(config));
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    normalizeConfig(config).countries[0]?.code ?? ""
  );

  useEffect(() => {
    const normalized = normalizeConfig(config);
    setDraft(normalized);
    setSelectedCountryCode((prev) => {
      if (normalized.countries.some((country) => country.code === prev)) {
        return prev;
      }
      return normalized.countries[0]?.code ?? "";
    });
  }, [config]);

  const activeCountry = useMemo(
    () =>
      draft.countries.find((country) => country.code === selectedCountryCode) ??
      null,
    [draft.countries, selectedCountryCode]
  );

  const updateBand = (bandKey, field, value) => {
    setDraft((prev) => ({
      ...prev,
      scoreBands: prev.scoreBands.map((band) =>
        band.key === bandKey
          ? {
              ...band,
              [field]: field === "minScore" ? Number(value || 0) : value,
            }
          : band
      ),
    }));
  };

  const removeBand = (bandKey) => {
    setDraft((prev) => ({
      scoreBands: prev.scoreBands.filter((band) => band.key !== bandKey),
      countries: prev.countries.map((country) => ({
        ...country,
        schools: country.schools.map((school) => ({
          ...school,
          bandKeys: school.bandKeys.filter((key) => key !== bandKey),
        })),
      })),
    }));
  };

  const addBand = () => {
    setDraft((prev) => ({
      ...prev,
      scoreBands: [...prev.scoreBands, createBandDraft()],
    }));
  };

  const addCountry = () => {
    const nextCountry = createCountryDraft();
    setDraft((prev) => ({
      ...prev,
      countries: [...prev.countries, nextCountry],
    }));
    setSelectedCountryCode(nextCountry.code);
  };

  const updateCountry = (countryCode, field, value) => {
    const nextValue = field === "code" ? value.toLowerCase() : value;
    setDraft((prev) => ({
      ...prev,
      countries: prev.countries.map((country) =>
        country.code === countryCode
          ? { ...country, [field]: nextValue }
          : country
      ),
    }));
    if (field === "code") {
      setSelectedCountryCode(nextValue);
    }
  };

  const removeCountry = (countryCode) => {
    setDraft((prev) => ({
      ...prev,
      countries: prev.countries.filter((country) => country.code !== countryCode),
    }));
    setSelectedCountryCode((prev) => {
      if (prev !== countryCode) {
        return prev;
      }
      const remainingCountry = draft.countries.find(
        (country) => country.code !== countryCode
      );
      return remainingCountry?.code ?? "";
    });
  };

  const addSchool = () => {
    if (!activeCountry) {
      return;
    }

    const nextSchool = createSchoolDraft();
    setDraft((prev) => ({
      ...prev,
      countries: prev.countries.map((country) =>
        country.code === activeCountry.code
          ? { ...country, schools: [...country.schools, nextSchool] }
          : country
      ),
    }));
  };

  const updateSchool = (schoolId, field, value) => {
    if (!activeCountry) {
      return;
    }

    setDraft((prev) => ({
      ...prev,
      countries: prev.countries.map((country) =>
        country.code === activeCountry.code
          ? {
              ...country,
              schools: country.schools.map((school) =>
                school.id === schoolId ? { ...school, [field]: value } : school
              ),
            }
          : country
      ),
    }));
  };

  const toggleSchoolBand = (schoolId, bandKey) => {
    if (!activeCountry) {
      return;
    }

    setDraft((prev) => ({
      ...prev,
      countries: prev.countries.map((country) =>
        country.code === activeCountry.code
          ? {
              ...country,
              schools: country.schools.map((school) => {
                if (school.id !== schoolId) {
                  return school;
                }

                const hasBand = school.bandKeys.includes(bandKey);
                return {
                  ...school,
                  bandKeys: hasBand
                    ? school.bandKeys.filter((key) => key !== bandKey)
                    : [...school.bandKeys, bandKey],
                };
              }),
            }
          : country
      ),
    }));
  };

  const removeSchool = (schoolId) => {
    if (!activeCountry) {
      return;
    }

    setDraft((prev) => ({
      ...prev,
      countries: prev.countries.map((country) =>
        country.code === activeCountry.code
          ? {
              ...country,
              schools: country.schools.filter((school) => school.id !== schoolId),
            }
          : country
      ),
    }));
  };

  return (
    <div className={styles.calculatorConfigModal}>
      <div
        className={styles.calculatorConfigBackdrop}
        ref={closeRef}
        onClick={(event) => {
          if (closeRef.current === event.target) {
            onClose();
          }
        }}
      >
        <div className={styles.calculatorConfigDialog}>
          <div className={styles.calculatorConfigHeader}>
            <div>
              <span className={styles.adminEyebrow}>Calculator Admin</span>
              <h3>추천학교 기준 관리</h3>
              <p>
                점수대와 국가별 추천 학교를 수정하면 합격 예측 계산기 화면에 바로
                반영됩니다.
              </p>
            </div>
            <div className={styles.calculatorModalActions}>
              <button
                type="button"
                className={styles.calculatorSecondaryButton}
                onClick={onClose}
                disabled={saving}
              >
                닫기
              </button>
              <button
                type="button"
                className={styles.calculatorPrimaryButton}
                onClick={() => onSave(draft)}
                disabled={saving}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>

          <div className={styles.calculatorConfigBody}>
            <div className={styles.calculatorConfigColumn}>
              <div className={styles.calculatorSectionHeader}>
                <h4>점수대 설정</h4>
                <button
                  type="button"
                  className={styles.calculatorSecondaryButton}
                  onClick={addBand}
                >
                  점수대 추가
                </button>
              </div>
              <div className={styles.calculatorBandList}>
                {draft.scoreBands.map((band) => (
                  <div className={styles.calculatorBandRow} key={band.key}>
                    <div className={styles.calculatorField}>
                      <span>라벨</span>
                      <input
                        type="text"
                        value={band.label}
                        onChange={(event) =>
                          updateBand(band.key, "label", event.target.value)
                        }
                      />
                    </div>
                    <div className={styles.calculatorField}>
                      <span>최소 점수</span>
                      <input
                        type="number"
                        value={band.minScore}
                        onChange={(event) =>
                          updateBand(band.key, "minScore", event.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.calculatorDangerButton}
                      onClick={() => removeBand(band.key)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.calculatorConfigColumnWide}>
              <div className={styles.calculatorSectionHeader}>
                <h4>국가 및 학교 설정</h4>
                <button
                  type="button"
                  className={styles.calculatorSecondaryButton}
                  onClick={addCountry}
                >
                  국가 추가
                </button>
              </div>

              <div className={styles.calculatorCountryTabs}>
                {draft.countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    className={`${styles.calculatorCountryTab} ${
                      selectedCountryCode === country.code
                        ? styles.calculatorCountryTabActive
                        : ""
                    }`}
                    onClick={() => setSelectedCountryCode(country.code)}
                  >
                    {country.label}
                  </button>
                ))}
              </div>

              {activeCountry ? (
                <>
                  <div className={styles.calculatorCountryEditor}>
                    <div className={styles.calculatorInlineFields}>
                      <div className={styles.calculatorField}>
                        <span>국가 코드</span>
                        <input
                          type="text"
                          value={activeCountry.code}
                          onChange={(event) =>
                            updateCountry(
                              activeCountry.code,
                              "code",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className={styles.calculatorField}>
                        <span>국가명</span>
                        <input
                          type="text"
                          value={activeCountry.label}
                          onChange={(event) =>
                            updateCountry(
                              activeCountry.code,
                              "label",
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.calculatorDangerButton}
                      onClick={() => removeCountry(activeCountry.code)}
                    >
                      국가 삭제
                    </button>
                  </div>

                  <div className={styles.calculatorSectionHeader}>
                    <h4>학교 목록</h4>
                    <button
                      type="button"
                      className={styles.calculatorSecondaryButton}
                      onClick={addSchool}
                    >
                      학교 추가
                    </button>
                  </div>

                  <div className={styles.calculatorSchoolList}>
                    {activeCountry.schools.map((school) => (
                      <div className={styles.calculatorSchoolCard} key={school.id}>
                        <div className={styles.calculatorSchoolHeader}>
                          <strong>{school.name || "새 학교"}</strong>
                          <button
                            type="button"
                            className={styles.calculatorDangerButton}
                            onClick={() => removeSchool(school.id)}
                          >
                            삭제
                          </button>
                        </div>

                        <div className={styles.calculatorInlineFields}>
                          <div className={styles.calculatorField}>
                            <span>학교명</span>
                            <input
                              type="text"
                              value={school.name}
                              onChange={(event) =>
                                updateSchool(school.id, "name", event.target.value)
                              }
                            />
                          </div>
                          <div className={styles.calculatorField}>
                            <span>이미지 URL</span>
                            <input
                              type="text"
                              value={school.img}
                              onChange={(event) =>
                                updateSchool(school.id, "img", event.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.calculatorInlineFields}>
                          <div className={styles.calculatorField}>
                            <span>IB Score</span>
                            <input
                              type="text"
                              value={school.ibScore}
                              onChange={(event) =>
                                updateSchool(school.id, "ibScore", event.target.value)
                              }
                            />
                          </div>
                          <div className={styles.calculatorField}>
                            <span>World Ranking</span>
                            <input
                              type="text"
                              value={school.rank}
                              onChange={(event) =>
                                updateSchool(school.id, "rank", event.target.value)
                              }
                            />
                          </div>
                          <div className={styles.calculatorField}>
                            <span>Tuition</span>
                            <input
                              type="text"
                              value={school.tuition}
                              onChange={(event) =>
                                updateSchool(school.id, "tuition", event.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.calculatorField}>
                          <span>노출 점수대</span>
                          <div className={styles.calculatorCheckboxGrid}>
                            {draft.scoreBands.map((band) => (
                              <label key={band.key}>
                                <input
                                  type="checkbox"
                                  checked={school.bandKeys.includes(band.key)}
                                  onChange={() => toggleSchoolBand(school.id, band.key)}
                                />
                                {band.label}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {activeCountry.schools.length === 0 && (
                      <div className={styles.calculatorEmpty}>
                        아직 등록된 학교가 없습니다.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.calculatorEmpty}>
                  먼저 국가를 추가한 뒤 학교를 등록해 주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalculatorRecommendationsModal;
