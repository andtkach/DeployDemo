import { useCallback, useEffect, useState } from "react";

import packageJson from "../package.json";
import {
  createCity,
  deleteCity,
  fetchApiInfo,
  fetchCities,
  updateCity,
} from "./api/cities";
import ApiInfo from "./components/ApiInfo";
import CityForm from "./components/CityForm";
import CityList from "./components/CityList";

const App = () => {
  const [apiInfo, setApiInfo] = useState(null);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientHost = typeof window !== "undefined" ? window.location.hostname : "unknown";

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

  const handleUpdateCity = async (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("City name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCity(id, trimmed);
      await loadData();
    } catch (err) {
      setError("Unable to update city. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCity = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteCity(id);
      await loadData();
    } catch (err) {
      setError("Unable to delete city. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>DeployDemo Cities</h1>
        <div className="header-meta">
          <span>UI {packageJson.version}</span>
          {/* <span>Client {clientHost}</span> */}
          {apiInfo && <span>API {apiInfo.servername} {apiInfo.version}</span>}
          {/* {apiInfo && (
            <span>API time {new Date(apiInfo.datetime).toLocaleString()}</span>
          )} */}
        </div>
      </header>

      {error ? (
        <div className="card error">
          <h2>Service unavailable</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* {apiInfo && <ApiInfo info={apiInfo} />} */}
          <CityForm onAddCity={handleAddCity} isSubmitting={isSubmitting} />
          <CityList
            cities={cities}
            onDeleteCity={handleDeleteCity}
            onUpdateCity={handleUpdateCity}
            isWorking={isSubmitting}
          />
        </>
      )}
    </div>
  );
};

export default App;
