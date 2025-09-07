import React, { useState,useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE } from '../config/api'; 
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const PotholeMap = () => {
  const [potholes, setPotholes] = useState([]);

   const loadPotholes = async () => {
    const res = await fetch(`${API_BASE}/report/potholes`);
    const data = await res.json();
    setPotholes(data);
  };

  useEffect(() => {
    loadPotholes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Pothole Map View</h1>
            <p className="text-gray-600 mt-2">
              Interactive map showing all reported potholes
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <MapContainer
              center={[17.385, 78.4867]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {potholes.map((p, i) => (
                <Marker key={i} position={[p.latitude, p.longitude]}>
                  <Popup>
                    <b>Pothole reported</b>
                    <br />
                    {new Date(p.timestamp).toLocaleString()}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Severity legend */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-800">High Severity</span>
              </div>
              <p className="text-sm text-red-700">Immediate attention required</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-yellow-800">Medium Severity</span>
              </div>
              <p className="text-sm text-yellow-700">Should be addressed soon</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Low Severity</span>
              </div>
              <p className="text-sm text-green-700">Minor issue, low priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotholeMap;
