const CityList = ({ cities }) => (
  <div className="card">
    <h2>City List</h2>
    {cities.length === 0 ? (
      <p>No cities available.</p>
    ) : (
      <ul className="city-list">
        {cities.map((city) => (
          <li key={city._id ?? city.id}>
            <span className="city-name">{city.name}</span>
            <span className="city-meta">
              created {new Date(city.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default CityList;
