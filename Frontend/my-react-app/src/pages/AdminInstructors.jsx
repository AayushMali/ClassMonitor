import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data } = await API.get('/admin/instructors');
        setInstructors(data);
      } catch (error) {
        console.error('Failed to fetch instructors');
      }
    };
    fetchInstructors();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">All Instructors</h1>
        <div>
            <Link to="/admin/courses" className="text-blue-400 hover:text-blue-300 font-medium">View Courses &rarr;</Link>
        </div>
      </div>
      <div className="bg-gray-800 shadow-lg rounded-lg border border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-700">
          {instructors.map((inst) => (
            <li key={inst._id} className="p-4 hover:bg-gray-700/50 transition flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-lg">{inst.name}</div>
                <div className="text-gray-400 text-sm">{inst.email}</div>
              </div>
              <div className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded text-xs border border-blue-800">
                Instructor
              </div>
            </li>
          ))}
          {instructors.length === 0 && (
              <li className="p-6 text-center text-gray-500">No instructors found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminInstructors;
