import React, { useEffect, useState } from "react";
import axios from "axios";

const PlacementsList = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/placements")
      .then(res => setPlacements(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading placement details...</div>;
  if (!placements.length) return <div className="p-4">No placement data available.</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {placements.map((p, idx) => (
        <div key={idx} className="p-4 shadow-md bg-white rounded-2xl">
          <h2 className="text-xl font-semibold mb-1">{p.company_name}</h2>
          <p><strong>Role:</strong> {p.role || "N/A"}</p>
          <p><strong>Date:</strong> {p.drive_date || "N/A"}</p>
          <p><strong>Package:</strong> {p.package_info || "N/A"}</p>
          <a
            href={p.source_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-sm"
          >
            View Source
          </a>
        </div>
      ))}
    </div>
  );
};

export default PlacementsList;
