import React from "react";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({ qIdx, question, selected, onSelect }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "1.25rem",
      marginBottom: "1rem",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    }}>
      <p style={{ fontWeight: 500, marginBottom: "0.75rem" }}>
        {qIdx + 1}. {question.question}
      </p>

      {question.options.map((opt, oIdx) => (
        <label key={oIdx} style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          borderRadius: 8,
          cursor: "pointer",
          background: selected === oIdx ? "#eef1fd" : "transparent",
          marginBottom: 4,
          border: selected === oIdx ? "1px solid #4361ee" : "1px solid #e5e7eb"
        }}>
          <input
            type="radio"
            name={`q${qIdx}`}
            value={oIdx}
            checked={selected === oIdx}
            onChange={() => onSelect(qIdx, oIdx)}
          />
          <span style={{
            fontWeight: "700",
            width: 24,
            textAlign: "center",
            color: selected === oIdx ? "#4361ee" : "#374151"
          }}>
            {LETTERS[oIdx]}
          </span>
          {opt}
        </label>
      ))}
    </div>
  );
}