import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API_BASE } from '../../config/api'; 

function MunicipalDashboard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [potholes, setPotholes] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
  const [completedPotholes, setCompletedPotholes] = useState({
    assigned: [],
    completed: []
  });

  // Fetch reported potholes
// Fetch reported potholes
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/report/reported`);
      const data = await res.json();
     if (data.success && Array.isArray(data.potholes)) {
        setPotholes(data.potholes);
      } else {
        setPotholes([]);
      }
    } catch (err) {
      console.error("Error fetching potholes:", err);
      setPotholes([]);
    }
  };
  fetchData();
}, []);

// Fetch potholes assigned & completed
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/report/pothole/completed/${user._id}`);
      const data = await res.json();
      if (data.success) {
        setCompletedPotholes({
          assigned: data.assigned || [],
          completed: data.completed || []
        });
      }
      console.log(data);
    } catch (err) {
      console.error("Error fetching pothole data:", err);
    }
  };
  fetchData();
}, [user._id]);


  // Assign pothole to logged-in user
  function assignPothole(potholeId) {
    fetch(`${API_BASE}/report/pothole/assign/${potholeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assignedTo: user._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Pothole assigned successfully") {
          setPotholes((prev) => prev.filter((p) => p._id !== potholeId));
          // Refresh assigned list
          setCompletedPotholes((prev) => ({
            ...prev,
            assigned: [...prev.assigned, potholes.find((p) => p._id === potholeId)]
          }));
        } else {
          console.error("Error assigning pothole:", data.message);
        }
      })
      .catch((err) => console.error("Error assigning pothole:", err));
  }

  // Mark pothole as completed
  function completePothole(potholeId) {
    fetch(`${API_BASE}/report/pothole/complete/${potholeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Pothole marked as completed") {
          setCompletedPotholes((prev) => {
            const pothole = prev.assigned.find((p) => p._id === potholeId);
            return {
              assigned: prev.assigned.filter((p) => p._id !== potholeId),
              completed: [...prev.completed, pothole]
            };
          });
        } else {
          console.error("Error completing pothole:", data);
        }
      })
      .catch((err) => console.error("Error completing pothole:", err));
  }

  // Open pothole image in a new tab
    const viewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Potholes Available</h1>
      <div className="pothole-list space-y-6">
       {Array.isArray(potholes) && potholes.length > 0 && (
  potholes.map((pothole) => (
    <div key={pothole._id} className="pothole-card bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-white">Location: {pothole.location}</h2>
      <p className="text-white mb-2">Severity: {pothole.severity}</p>
      <button
        onClick={() => viewImage(pothole.image)}
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mr-2"
      >
        View Image
      </button>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={() => assignPothole(pothole._id)}
      >
        Assign to me
      </button>
    </div>
  ))
)}
     <h1 className="text-2xl font-bold mt-8 mb-4 text-white">Assigned to You</h1>
        {completedPotholes.assigned.map((pothole) => (
          <div key={pothole._id} className="pothole-card bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-white">Location: {pothole.location}</h2>
            <p className="text-white mb-2">Description: {pothole.description}</p>
            <p className="text-white mb-2">Severity: {pothole.severity}</p>
            <p className="text-white mb-2">Status: {pothole.status}</p>
            <p className='text-white mb-2'>{pothole.assignedDate && `Assigned Date: ${new Date(pothole.assignedDate).toLocaleDateString()}`}</p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => completePothole(pothole._id)}
            >
              Mark as Completed
            </button>
          </div>
        ))}

        <h1 className="text-2xl font-bold mt-8 mb-4 text-white">Your Completed Works</h1>
        {completedPotholes.completed.map((pothole) => (
          <div key={pothole._id} className="pothole-card bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-white">Location: {pothole.location}</h2>
            <p className="text-white mb-2">Description: {pothole.description}</p>
            <p className="text-white mb-2">Severity: {pothole.severity}</p>
            <p className='text-white mb-2'>Completed On: {new Date(pothole.dateOfCompletion).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
       {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10 transition-colors duration-200"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Pothole"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDUwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMzMgMTUwTDI4MyAxMDBIMzE3TDI2NyAxNTBMMzE3IDIwMEgyODNMMjMzIDE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwhLS0gQ29tZW50IC0tPgo8L3A+CjxyZWN0IHg9IjIwMCIgeT0iMTMwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIyNTAiIHk9IjE1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K";
              }}
            />
            <div className={`absolute bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-black/70' : 'bg-white/90'} p-4`}>
              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-center font-medium`}>
                Pothole Image - Click outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MunicipalDashboard;
