import { useState } from "react";

const CityForm = ({ onAddCity, isSubmitting }) => {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    onAddCity(trimmed);
    setName("");
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Add City</h2>
      <div className="form-row">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="City name"
          aria-label="City name"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default CityForm;
