const ApiInfo = ({ info }) => (
  <div className="card">
    <h2>API Response</h2>
    <div className="info-grid">
      <div>
        <span className="label">Server</span>
        <span>{info.servername}</span>
      </div>
      <div>
        <span className="label">Version</span>
        <span>{info.version}</span>
      </div>
      <div>
        <span className="label">Datetime</span>
        <span>{new Date(info.datetime).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default ApiInfo;
