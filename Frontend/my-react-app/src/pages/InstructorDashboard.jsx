import { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';

const InstructorDashboard = () => {
  const [lectures, setLectures] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const { data } = await API.get('/instructor/lectures');
        setLectures(data);
      } catch (error) {
        console.error('Failed to fetch lectures');
      }
    };
    fetchLectures();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
            <p className="text-gray-400 mt-1">Here is your upcoming teaching schedule.</p>
        </div>
        <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition shadow-lg">Logout</button>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 bg-gray-700/50 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Your Schedule</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-300 border-b border-gray-700">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Course</th>
              <th className="p-4 font-semibold">Level</th>
              <th className="p-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {lectures.map((lec) => (
              <tr key={lec._id} className="hover:bg-gray-700/30 transition">
                <td className="p-4 text-white font-medium">{new Date(lec.date).toLocaleDateString()}</td>
                <td className="p-4 text-blue-300 font-semibold">{lec.course?.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${
                    lec.course?.level === 'Beginner' ? 'bg-green-900/30 text-green-300 border-green-800' :
                    lec.course?.level === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' :
                    'bg-red-900/30 text-red-300 border-red-800'
                  }`}>
                    {lec.course?.level}
                  </span>
                </td>
                <td className="p-4 text-gray-400 truncate max-w-xs">{lec.course?.description}</td>
              </tr>
            ))}
            {lectures.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">📅</span>
                        <p>No lectures assigned yet.</p>
                    </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorDashboard;
