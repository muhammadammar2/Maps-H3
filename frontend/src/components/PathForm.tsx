import React, { useState } from "react";

interface PathFormProps {
  onSearch: (startLocation: string, endLocation: string) => void;
}

const PathForm: React.FC<PathFormProps> = ({ onSearch }) => {
  const [startLocation, setStartLocation] = useState<string>("Islamabad");
  const [endLocation, setEndLocation] = useState<string>("Rawalpindi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(startLocation, endLocation);
  };

  return (
    <div
      style={{
        padding: "10px",
        background: "white",
        position: "absolute",
        zIndex: 1,
      }}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Location: </label>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
        </div>
        <div>
          <label>End Location: </label>
          <input
            type="text"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
        </div>
        <button type="submit">Find Shortest Path</button>
      </form>
    </div>
  );
};

export default PathForm;
