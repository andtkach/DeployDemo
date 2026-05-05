import { useCallback, useEffect, useState } from "react";

import packageJson from "../package.json";
import { createCity, fetchApiInfo, fetchCities } from "./api/cities";
import ApiInfo from "./components/ApiInfo";
import CityForm from "./components/CityForm";
import CityList from "./components/CityList";

const App = () => {
  const [apiInfo, setApiInfo] = useState(null);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [info, cityList] = await Promise.all([
        fetchApiInfo(),
        fetchCities(),
      ]);
      setApiInfo(info);
      setCities(cityList);
    } catch (err) {
      setError("API is not available right now. Please try again later.");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCity = async (name) => {
    setIsSubmitting(true);
    try {
      await createCity(name);
      await loadData();
    } catch (err) {
      setError("Unable to add city. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>DeployDemo Cities</h1>
        <p className="subtitle">UI version {packageJson.version}</p>
      </header>

      {error ? (
        <div className="card error">
          <h2>Service unavailable</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {apiInfo && <ApiInfo info={apiInfo} />}
          <CityForm onAddCity={handleAddCity} isSubmitting={isSubmitting} />
          <CityList cities={cities} />
        </>
      )}
    </div>
  );
};

export default App;
