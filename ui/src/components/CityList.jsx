import { useEffect, useMemo, useState } from "react";

const CityList = ({ cities, onDeleteCity, onUpdateCity, isWorking }) => {
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    setDrafts(() => {
      const updated = {};
      cities.forEach((city) => {
        const key = String(city.id ?? city._id);
        updated[key] = city.name ?? "";
      });
      return updated;
    });
  }, [cities]);

  const rows = useMemo(
    () =>
      cities.map((city) => {
        const key = String(city.id ?? city._id);
        return { city, key, draft: drafts[key] ?? "" };
      }),
    [cities, drafts]
  );

  const handleDraftChange = (key, value) => {
    setDrafts((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="card">
      <h2>City List</h2>
      {rows.length === 0 ? (
        <p>No cities available.</p>
      ) : (
        <ul className="city-list">
          {rows.map(({ city, key, draft }) => (
            <li key={key} className="city-row">
              <div className="city-main">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => handleDraftChange(key, event.target.value)}
                  aria-label={`City name ${city.name}`}
                  disabled={isWorking}
                />
                <span className="city-meta">
                  created {new Date(city.created_at).toLocaleString()}
                </span>
              </div>
              <div className="city-actions">
                <button
                  type="button"
                  onClick={() => onUpdateCity(city.id, draft)}
                  disabled={isWorking}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => onDeleteCity(city.id)}
                  disabled={isWorking}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityList;
