import React, { useState } from "react";
import styles from "./index.module.css";
import sqlLogo from "./assets/sql-server.png";

function App() {
  const [queryDescription, setQueryDescription] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSqlQuery("");
    setAnswer("");
    setRows([]);

    if (!queryDescription.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateQuery(queryDescription.trim());
      // data expected: { sqlQuery, answer, result: { rows: [...] } }
      setSqlQuery(data.sqlQuery || "");
      setAnswer(data.answer || "");
      setRows((data.result && data.result.rows) || []);
    } catch (err) {
      console.error(err);
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const generateQuery = async (description) => {
    const response = await fetch("http://localhost:3005/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // IMPORTANT: ask server to run the SQL by setting runAgainstDb: true
      body: JSON.stringify({
        queryDescription: description,
        runAgainstDb: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} ${text}`);
    }

    return response.json();
  };

  return (
    <main className={styles.main}>
      <img src={sqlLogo} className={styles.icon} alt="SQL" />
      <h3>Chat My Database</h3>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="query-description"
          placeholder="What question do you want answered?"
          value={queryDescription}
          onChange={(e) => setQueryDescription(e.target.value)}
        />
        <input
          type="submit"
          value={loading ? "Generating..." : "Generate Answer"}
        />
      </form>

      {error && <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>}

      {sqlQuery && (
        <div className={styles.queryOutput} style={{ marginTop: 16 }}>
          <strong>SQL:</strong>
          <pre style={{ margin: "8px 0" }}>{sqlQuery}</pre>
        </div>
      )}

      {answer && (
        <div style={{ marginTop: 12, fontWeight: 600 }}>
          <span>Answer: </span>
          <span>{answer}</span>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className={styles.queryOutput} style={{ marginTop: 12 }}>
          <strong>Raw result preview (first 5 rows):</strong>
          <pre style={{ marginTop: 8 }}>
            {JSON.stringify(rows.slice(0, 5), null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}

export default App;
