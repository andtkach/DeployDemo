import { useEffect, useMemo, useState } from "react";

const CityList = ({ cities, onDeleteCity, onUpdateCity, isWorking }) => {
  const [drafts, setDrafts] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setDrafts(() => {
      const updated = {};
      cities.forEach((city) => {
        const key = String(city.id ?? city._id);
        updated[key] = city.name ?? "";
      });
      return updated;
    });
    setEditingId(null);
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
                {editingId === key ? (
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => handleDraftChange(key, event.target.value)}
                    aria-label={`City name ${city.name}`}
                    disabled={isWorking}
                  />
                ) : (
                  <span className="city-name">{city.name}</span>
                )}
                <div className="city-actions">
                  <button
                    type="button"
                    onClick={() => {
                      if (editingId !== key) {
                        setEditingId(key);
                        return;
                      }

                      onUpdateCity(city.id, draft);
                    }}
                    disabled={isWorking}
                    aria-label={editingId === key ? "Save city" : "Edit city"}
                    title={editingId === key ? "Save" : "Edit"}
                  >
                    {editingId === key ? "✔" : "✎"}
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => onDeleteCity(city.id)}
                    disabled={isWorking}
                    aria-label="Delete city"
                    title="Delete"
                  >
                    ✖
                  </button>
                </div>
              </div>
              <span className="city-meta">
                created {new Date(city.created_at).toLocaleString()}
                {city.updated_at
                  ? ` · modified ${new Date(city.updated_at).toLocaleString()}`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityList;
