import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE } from '../config/api'; 

const Dashboard = () => {
  const { user } = useAuth();
   const { theme } = useTheme();
  const [potholes, setPotholes] = useState({
    reported: [],
    underRepair: [],
    finished: []
  });
    const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  // Mock data for demonstration - replace with actual API calls
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/report/pothole/${user.id}`);
      const data = await res.json();
      setPotholes(data);
      // console.log("Fetched pothole data:", data);
    } catch (err) {
      console.error("Error fetching pothole data:", err);
    }
  };

  fetchData();
}, [user.id]);



  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };
   const openModal = (type) => {
    setModalType(type);
    setModalData(potholes[type]);
    setModalOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
    setModalData([]);
    setSelectedImage(null);
    setSelectedMap(null);
    // Restore background scrolling
    document.body.style.overflow = 'unset';
  };

  const viewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const viewMap = (mapUrl) => {
    window.open(mapUrl, '_blank');
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
          border-radius: 12px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, ${theme === 'dark' ? '#6b7280' : '#9ca3af'}, ${theme === 'dark' ? '#4b5563' : '#6b7280'});
          border-radius: 12px;
          border: 2px solid ${theme === 'dark' ? '#374151' : '#f3f4f6'};
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, ${theme === 'dark' ? '#9ca3af' : '#6b7280'}, ${theme === 'dark' ? '#6b7280' : '#4b5563'});
          transform: scale(1.1);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Stats Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-white to-orange-400' : 'from-gray-900 to-orange-600'} bg-clip-text text-transparent`}>
              Dashboard
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Track and manage pothole reports in your area</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={() => openModal('reported')}
              className={`${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-300/30 hover:bg-gray-200'} backdrop-blur-lg border rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300 border-l-4 border-l-orange-400 cursor-pointer`}
            >
              <div className="text-5xl mb-4">📍</div>
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>{potholes.reported.length}</div>
              <div className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Reported</div>
            </div>
            <div 
              onClick={() => openModal('underRepair')}
              className={`${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-300/30 hover:bg-gray-200'} backdrop-blur-lg border rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300 border-l-4 border-l-blue-400 cursor-pointer`}
            >
              <div className="text-5xl mb-4">🚧</div>
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>{potholes.underRepair.length}</div>
              <div className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Under Repair</div>
            </div>
            <div 
              onClick={() => openModal('finished')}
              className={`${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-300/30 hover:bg-gray-200'} backdrop-blur-lg border rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300 border-l-4 border-l-green-400 cursor-pointer`}
            >
              <div className="text-5xl mb-4">✅</div>
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>{potholes.finished.length}</div>
              <div className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Graphs Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Analytics & Insights
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive overview of pothole management statistics
            </p>
          </div>

          {/* Top Row - Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Trends Chart */}
            <div className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Monthly Trends
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  Last 6 Months
                </div>
              </div>
              
              {/* Line Chart Simulation */}
              <div className="h-64 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs font-medium py-2">
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>50</span>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>40</span>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>30</span>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>20</span>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>10</span>
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>0</span>
                </div>
                
                {/* Chart Area */}
                <div className="ml-8 h-full relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className={`h-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                  
                  {/* Bars */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 h-full">
                    {[
                      { month: 'Apr', reported: 35, completed: 28, height1: '70%', height2: '56%' },
                      { month: 'May', reported: 42, completed: 31, height1: '84%', height2: '62%' },
                      { month: 'Jun', reported: 28, completed: 25, height1: '56%', height2: '50%' },
                      { month: 'Jul', reported: 38, completed: 35, height1: '76%', height2: '70%' },
                      { month: 'Aug', reported: 45, completed: 40, height1: '90%', height2: '80%' },
                      { month: 'Sep', reported: 32, completed: 28, height1: '64%', height2: '56%' }
                    ].map((data, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2 w-16">
                        <div className="flex items-end space-x-1 h-48">
                          <div 
                            className="w-6 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm transition-all duration-500 hover:scale-110"
                            style={{ height: data.height1 }}
                            title={`Reported: ${data.reported}`}
                          ></div>
                          <div 
                            className="w-6 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-500 hover:scale-110"
                            style={{ height: data.height2 }}
                            title={`Completed: ${data.completed}`}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {data.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Reported</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Completed</span>
                </div>
              </div>
            </div>

            {/* Severity Distribution Pie Chart */}
            <div className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Severity Distribution
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                  Current Period
                </div>
              </div>

              {/* Donut Chart Simulation */}
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  {/* Outer Ring */}
                  <div className="w-48 h-48 rounded-full relative" style={{
                    background: `conic-gradient(
                      #ef4444 0deg 120deg,
                      #f59e0b 120deg 240deg,
                      #10b981 240deg 360deg
                    )`
                  }}>
                    {/* Inner Circle */}
                    <div className={`absolute top-6 left-6 w-36 h-36 rounded-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {potholes.reported.length + potholes.underRepair.length + potholes.finished.length}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total Reports
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>High Severity</span>
                  </div>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>33%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Medium Severity</span>
                  </div>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>44%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Low Severity</span>
                  </div>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>23%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Response Time Analytics */}
            <div className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                Response Times
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Average Response</span>
                    <span className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>2.3 days</span>
                  </div>
                  <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</span>
                    <span className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>87%</span>
                  </div>
                  <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div className="w-5/6 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Quality Rating</span>
                    <span className={`text-lg font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>4.2/5</span>
                  </div>
                  <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div className="w-4/5 h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                Geographic Distribution
              </h3>
              
              <div className="space-y-3">
                {[
                  { area: 'Downtown', count: 45, percentage: 85 },
                  { area: 'North District', count: 32, percentage: 60 },
                  { area: 'South Zone', count: 28, percentage: 50 },
                  { area: 'East Side', count: 19, percentage: 35 },
                  { area: 'West End', count: 12, percentage: 20 }
                ].map((area, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {area.area}
                        </span>
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {area.count}
                        </span>
                      </div>
                      <div className={`w-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full bg-gradient-to-r ${
                            index === 0 ? 'from-red-500 to-red-400' :
                            index === 1 ? 'from-orange-500 to-orange-400' :
                            index === 2 ? 'from-yellow-500 to-yellow-400' :
                            index === 3 ? 'from-green-500 to-green-400' :
                            'from-blue-500 to-blue-400'
                          } rounded-full transition-all duration-500`}
                          style={{ width: `${area.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                Performance Metrics
              </h3>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mb-1`}>
                    +23%
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Efficiency Improvement
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mb-1`}>
                    48h
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Average Fix Time
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mb-1`}>
                    96%
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Citizen Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Only the summary stats - no individual cards */}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border rounded-xl shadow-2xl max-w-7xl w-full h-[85vh] flex flex-col overflow-hidden`}>
            {/* Modal Header - Fixed */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b p-6 flex justify-between items-center flex-shrink-0`}>
              <div className="flex items-center space-x-3">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {modalType === 'reported' ? 'Reported Potholes' : 
                   modalType === 'underRepair' ? 'Under Repair' : 
                   'Completed Repairs'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} text-xl font-bold transition-colors duration-200`}
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Scrollable Table */}
            <div className="flex-1 overflow-hidden relative max-h-[70vh]">
              {/* Scroll Progress Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} z-20`}>
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 w-0 transition-all duration-300 rounded-full" id="scroll-indicator"></div>
              </div>

              {/* Table Container with Custom Scrollbar */}
              <div 
                className="h-full overflow-y-auto overflow-x-auto custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === 'dark' ? '#4B5563 #1F2937' : '#9CA3AF #F3F4F6',
                  maxHeight: '70vh'
                }}
                onScroll={(e) => {
                  const scrollTop = e.target.scrollTop;
                  const scrollHeight = e.target.scrollHeight - e.target.clientHeight;
                  const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                  const indicator = document.getElementById('scroll-indicator');
                  if (indicator) {
                    indicator.style.width = `${scrollPercent}%`;
                  }
                }}
              >
                {/* Table */}
                <div className="pb-20">
                  <table className="w-full min-w-[1200px]">
                    {/* Table Header */}
                    <thead className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <tr>
                        <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[150px]`}>
                          Reported By
                        </th>
                        <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[200px]`}>
                          Location
                        </th>
                        <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[120px]`}>
                          Date
                        </th>
                        <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[120px]`}>
                          Severity
                        </th>
                        <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[250px]`}>
                          Description
                        </th>
                        
                        {/* Columns for Reported Potholes */}
                        {modalType === 'reported' && (
                          <>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[140px]`}>
                              Reported Image
                            </th>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[120px]`}>
                              Map Location
                            </th>
                          </>
                        )}

                        {/* Columns for Under Repair */}
                        {modalType === 'underRepair' && (
                          <>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[150px]`}>
                              Progress
                            </th>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[160px]`}>
                              Estimated Completion
                            </th>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[140px]`}>
                              Assigned Worker
                            </th>
                          </>
                        )}

                        {/* Columns for Completed */}
                        {modalType === 'finished' && (
                          <>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[120px]`}>
                              Duration
                            </th>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[140px]`}>
                              Completed By
                            </th>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[120px]`}>
                              Municipal
                            </th>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[100px]`}>
                              Rating
                            </th>
                            <th className={`${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[140px]`}>
                              Completion Image
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>

                  {/* Table Body */}
                  <tbody className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                    {modalData.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50/50') : (theme === 'dark' ? 'bg-gray-800/30' : 'bg-white')} hover:${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'} transition-all duration-200 border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'}`}
                      >
                        {/* Reported By */}
                        <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-6 py-4`}>
                          <span className="font-medium">{item.submittedBy}</span>
                        </td>

                        {/* Location */}
                        <td className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} px-6 py-4 font-medium`}>
                          <span className="font-semibold">{item.location}</span>
                        </td>

                        {/* Date */}
                        <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-6 py-4 font-medium`}>
                          {modalType === 'underRepair' ? item.startDate : 
                           modalType === 'finished' ? item.completedDate : 
                           new Date(item.dateOfSubmission).toLocaleDateString()}
                        </td>

                        {/* Severity */}
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getSeverityColor(item.severity)}`}>
                            {item.severity}
                          </span>
                        </td>

                        {/* Description */}
                        <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-6 py-4`}>
                          <div className="max-w-[200px]">
                            <p className="text-sm leading-relaxed">{item.description}</p>
                            {item.description.length > 50 && (
                              <button 
                                className={`text-xs ${theme === 'dark' ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'} mt-1 font-medium`}
                                onClick={() => {/* Add expand functionality if needed */}}
                              >
                                Minimize
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Columns for Reported Potholes */}
                        {modalType === 'reported' && (
                          <>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => viewImage(item.image)}
                                className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 w-full text-center min-w-[120px]`}
                              >
                                View Image
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => viewMap(item.mapUrl)}
                                className={`${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 w-full text-center min-w-[120px]`}
                              >
                                View Map
                              </button>
                            </td>
                          </>
                        )}

                        {/* Columns for Under Repair */}
                        {modalType === 'underRepair' && (
                          <>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className={`flex-1 h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 rounded-full"
                                    style={{width: `${item.progress}%`}}
                                  ></div>
                                </div>
                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} min-w-[40px]`}>
                                  {item.progress}%
                                </span>
                              </div>
                            </td>
                            <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-6 py-4 font-medium`}>
                              {item.estimatedCompletion || '2025-09-15'}
                            </td>
                            <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-6 py-4 font-medium`}>
                              {item.assignedWorker || 'Municipal Worker #' + (index + 1)}
                            </td>
                          </>
                        )}

                        {/* Columns for Completed */}
                        {modalType === 'finished' && (
                          <>
                            <td className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} px-6 py-4 font-bold`}>
                              {item.duration || '3 days'}
                            </td>
                            <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-6 py-4 font-medium`}>
                              {item.completedBy || 'Municipal Team ' + (index + 1)}
                            </td>
                            <td className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-6 py-4 font-medium`}>
                              {item.municipal || 'City Council Ward ' + (index + 1)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span 
                                    key={star} 
                                    className={`text-lg ${star <= (item.rating || 4) ? 'text-yellow-400' : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')}`}
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => viewImage(item.image)}
                                className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 w-full text-center min-w-[120px]`}
                              >
                                View Completion
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t p-6 flex justify-end space-x-4 flex-shrink-0`}>
              <button
                onClick={closeModal}
                className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-6 py-2 rounded-lg font-medium transition-colors duration-200`}
              >
                Close
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
                Export Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
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
    </>
  );
};

export default Dashboard;