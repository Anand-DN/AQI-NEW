import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const API_BASE_URL = "https://aqi-new-1.onrender.com";
const CPCB = ["pm25", "pm10", "o3", "no2", "so2", "co"];

function App() {
  const [cities, setCities] = useState([]);
  const [pollutants, setPollutants] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [year, setYear] = useState(2025);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTests, setShowTests] = useState(false);

  const [tCity1, setTCity1] = useState(null);
  const [tCity2, setTCity2] = useState(null);
  const [tPollutant, setTPollutant] = useState(null);
  const [tResult, setTResult] = useState(null);
  const [tLoading, setTLoading] = useState(false);

  const [aCities, setACities] = useState([]);
  const [aPollutant, setAPollutant] = useState(null);
  const [aResult, setAResult] = useState(null);
  const [aLoading, setALoading] = useState(false);

  const [cCities, setCCities] = useState([]);
  const [cResult, setCResult] = useState(null);
  const [cLoading, setCLoading] = useState(false);

  const years = Array.from({ length: 12 }, (_, i) => 2015 + i);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/cities`)
      .then((res) =>
        setCities(res.data.cities.map((c) => ({ value: c, label: c })))
      )
      .catch(() => setCities([]));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/pollutants`)
      .then((res) => setPollutants(res.data.pollutants))
      .catch(() => setPollutants(CPCB));
  }, []);

  const handleAnalyze = async () => {
    if (selectedCities.length === 0) return;
    setLoading(true);
    setResults(null);
    try {
      const payload = {
        cities: selectedCities.map((c) => c.value),
        year: year,
      };
      const res = await axios.post(`${API_BASE_URL}/api/analyze`, payload);
      setResults(res.data);
    } catch {
      console.error("analysis failed");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="header">🌍 India AQI Dashboard</header>

      <div className="panel">
        <h3>Select Cities:</h3>
        <Select
          isMulti
          options={cities}
          onChange={setSelectedCities}
          placeholder="Cities"
        />

        <h3 style={{ marginTop: "15px" }}>Select Year:</h3>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="year-select"
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <button className="btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {results && (
        <div className="results">
          {/* SUMMARY */}
          <section className="stats-card">
            <h3>Summary Statistics</h3>
            <div>Mean: {results.summary_stats.mean.toFixed(2)}</div>
            <div>Median: {results.summary_stats.median.toFixed(2)}</div>
            <div>Std: {results.variability_metrics.std_dev.toFixed(2)}</div>
            <div>IQR: {results.variability_metrics.iqr.toFixed(2)}</div>
          </section>

          {/* VISUALIZATIONS */}
          {results.visualizations && (
            <section className="viz-card">
              <h3>AQI Boxplot (Cities)</h3>
              <img
                src={`data:image/png;base64,${results.visualizations.boxplot}`}
              />
            </section>
          )}

          {/* CORRELATION */}
          {results.correlation && (
            <section className="viz-card">
              <h3>Correlation (Spearman)</h3>
              <pre>{JSON.stringify(results.correlation.pairs, null, 2)}</pre>
            </section>
          )}

          {/* QQ GRID */}
          <section className="viz-card">
            <h3>QQ Plots</h3>
            <div className="qq-grid">
              {results.qqplots?.aqi && (
                <div className="qq-card">
                  <strong>AQI</strong>
                  <img src={`data:image/png;base64,${results.qqplots.aqi}`} />
                </div>
              )}

              {CPCB.filter((p) => results.qqplots?.[p]).map((p) => (
                <div key={p} className="qq-card">
                  <strong>{p.toUpperCase()}</strong>
                  <img src={`data:image/png;base64,${results.qqplots[p]}`} />
                </div>
              ))}
            </div>
          </section>

          {/* NORMALITY */}
          <section className="stats-card">
            <h3>Normality (Shapiro + KS + Dagostino)</h3>

            {/* AQI */}
            {results.normality?.aqi && (
              <div>
                <strong>AQI — </strong>
                {Object.entries(results.normality.aqi.tests)
                  .map(([k, v]) => `${k}(${v.toFixed(3)})`)
                  .join(", ")}
                {" → "}
                {results.normality.aqi.is_normal ? "✔ Normal" : "❌ Not Normal"}
              </div>
            )}

            {/* Pollutants */}
            {results.normality?.pollutants &&
              CPCB.filter((p) => results.normality.pollutants[p]).map((p) => {
                const r = results.normality.pollutants[p];
                return (
                  <div key={p}>
                    <strong>{p.toUpperCase()} — </strong>
                    {Object.entries(r.tests)
                      .map(([k, v]) => `${k}(${v.toFixed(3)})`)
                      .join(", ")}
                    {" → "}
                    {r.is_normal ? "✔ Normal" : "❌ Not Normal"}
                  </div>
                );
              })}
          </section>

          {/* ADVANCED TESTS */}
          <section className="panel">
            <button className="btn" onClick={() => setShowTests(!showTests)}>
              {showTests ? "Hide Tests" : "Show Tests"}
            </button>
          </section>

          {showTests && (
            <>
              {/* TTEST */}
              <section className="panel">
                <h3>T-Test</h3>
                <div className="row">
                  <Select
                    options={cities}
                    onChange={setTCity1}
                    placeholder="City 1"
                  />
                  <Select
                    options={cities}
                    onChange={setTCity2}
                    placeholder="City 2"
                  />
                  <select
                    value={tPollutant || ""}
                    onChange={(e) => setTPollutant(e.target.value)}
                  >
                    <option value="">Pollutant</option>
                    {CPCB.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn"
                  disabled={!tCity1 || !tCity2 || !tPollutant || tLoading}
                  onClick={async () => {
                    setTLoading(true);
                    try {
                      const payload = {
                        city1: tCity1.value,
                        city2: tCity2.value,
                        pollutant: tPollutant,
                        cities: [],
                        year,
                      };
                      const res = await axios.post(
                        `${API_BASE_URL}/api/ttest`,
                        payload
                      );
                      setTResult(res.data);
                    } finally {
                      setTLoading(false);
                    }
                  }}
                >
                  Run T-Test
                </button>
                {tResult && (
                  <div className="stats-card">
                    <div>Method: {tResult.method}</div>
                    <div>p-value: {tResult.pvalue.toFixed(4)}</div>
                  </div>
                )}
              </section>

              {/* ANOVA */}
              <section className="panel">
                <h3>ANOVA</h3>
                <Select
                  isMulti
                  options={cities}
                  onChange={setACities}
                  placeholder="Cities"
                />
                <select
                  value={aPollutant || ""}
                  onChange={(e) => setAPollutant(e.target.value)}
                >
                  <option value="">Pollutant</option>
                  {CPCB.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <button
                  className="btn"
                  disabled={aCities.length < 2 || !aPollutant || aLoading}
                  onClick={async () => {
                    setALoading(true);
                    try {
                      const payload = {
                        cities: aCities.map((c) => c.value),
                        pollutant: aPollutant,
                        year,
                      };
                      const res = await axios.post(
                        `${API_BASE_URL}/api/anova`,
                        payload
                      );
                      setAResult(res.data);
                    } finally {
                      setALoading(false);
                    }
                  }}
                >
                  Run ANOVA
                </button>
                {aResult && (
                  <div className="stats-card">
                    <div>F: {aResult.f.toFixed(3)}</div>
                    <div>P: {aResult.pvalue.toFixed(4)}</div>
                    {aResult.warning && (
                      <div style={{ color: "red" }}>
                        ⚠ Data non-normal → ANOVA may be invalid
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* CHI */}
              <section className="panel">
                <h3>Chi-Square (City × Category)</h3>
                <Select isMulti options={cities} onChange={setCCities} />
                <button
                  className="btn"
                  disabled={cCities.length < 2 || cLoading}
                  onClick={async () => {
                    setCLoading(true);
                    try {
                      const payload = {
                        cities: cCities.map((c) => c.value),
                        year,
                      };
                      const res = await axios.post(
                        `${API_BASE_URL}/api/chisquare`,
                        payload
                      );
                      setCResult(res.data);
                    } finally {
                      setCLoading(false);
                    }
                  }}
                >
                  Run Chi-Square
                </button>
                {cResult && (
                  <div className="stats-card">
                    <div>Chi²: {cResult.chi.toFixed(3)}</div>
                    <div>P: {cResult.pvalue.toFixed(4)}</div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
