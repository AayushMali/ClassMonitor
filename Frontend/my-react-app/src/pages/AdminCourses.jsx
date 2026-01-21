import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', level: 'Beginner', description: '', image: '' });
  const [message, setMessage] = useState('');
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await API.get('/admin/courses');
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await API.delete(`/admin/courses/${id}`);
        fetchCourses();
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/courses', newCourse);
      setMessage('Course created successfully');
      setNewCourse({ name: '', level: 'Beginner', description: '', image: '' });
      fetchCourses();
    } catch (error) {
      setMessage('Error creating course');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                <Link to="/admin/instructors" className="text-blue-400 hover:text-blue-300 transition">Manage Instructors</Link>
                <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">Logout</button>
            </div>
        </div>
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-white">Create New Course</h2>
            {message && <p className="mb-4 text-green-400 bg-green-900/30 p-2 rounded text-sm">{message}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Course Name</label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Advanced React Patterns"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Level</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                  value={newCourse.level}
                  onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Description</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                  placeholder="Brief summary of the course..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Cover Image URL</label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                  value={newCourse.image}
                  onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                  required
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-medium">
                Create Course
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-white">All Courses</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-600 transition">
                <div className="flex gap-4 items-center">
                   <img 
                    src={course.image} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    alt={course.name} 
                    className="w-16 h-16 object-cover rounded bg-gray-700" 
                  />
                  <div>
                    <h3 className="font-bold text-lg text-white">{course.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      course.level === 'Beginner' ? 'bg-green-900 text-green-300' :
                      course.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link to={`/admin/courses/${course._id}`} className="flex-1 sm:flex-none text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition text-sm">
                    Manage
                  </Link>
                  <button 
                    onClick={() => handleDelete(course._id)} 
                    className="flex-1 sm:flex-none text-center bg-red-900/50 hover:bg-red-900 text-red-200 px-4 py-2 rounded transition text-sm border border-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
             {courses.length === 0 && (
                <div className="text-center p-8 text-gray-500 bg-gray-800 rounded border border-gray-700 border-dashed">
                    No courses found. Create one to get started.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
