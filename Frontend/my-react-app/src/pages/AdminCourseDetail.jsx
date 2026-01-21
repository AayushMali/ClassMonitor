import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const AdminCourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [instructors, setInstructors] = useState([]);
  
  const [formData, setFormData] = useState({ instructorId: '', date: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', level: '', description: '', image: '' });

  useEffect(() => {
    fetchCourseData();
    fetchInstructors();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await API.get(`/admin/courses/${id}`);
      setCourse(courseRes.data);
      // Initialize edit form with current data
      setEditData({
        name: courseRes.data.name,
        level: courseRes.data.level,
        description: courseRes.data.description,
        image: courseRes.data.image
      });
      const lecturesRes = await API.get(`/admin/courses/${id}/lectures`);
      setLectures(lecturesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/courses/${id}`, editData);
      setMessage({ type: 'success', text: 'Course updated successfully' });
      setIsEditing(false);
      fetchCourseData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update course' });
    }
  };

  const fetchInstructors = async () => {
    try {
      const { data } = await API.get('/admin/instructors');
      setInstructors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await API.post(`/admin/courses/${id}/lectures`, formData);
      setMessage({ type: 'success', text: 'Lecture scheduled successfully!' });
      fetchCourseData(); // Refresh list
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to schedule lecture' 
      });
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Are you sure you want to remove this lecture?')) {
      try {
        await API.delete(`/admin/lectures/${lectureId}`);
        fetchCourseData(); // Refresh list
        setMessage({ type: 'success', text: 'Lecture removed successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete lecture' });
      }
    }
  };

  if (!course) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link to="/admin/courses" className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-2 transition">
        &larr; Back to Courses
      </Link>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row gap-6">
            <img 
              src={course.image} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
              alt={course.name} 
              className="w-full sm:w-48 h-48 object-cover rounded-lg bg-gray-700" 
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-white mb-2">{course.name}</h1>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Edit Course
                </button>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
                 course.level === 'Beginner' ? 'bg-green-900 text-green-300' :
                 course.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' :
                 'bg-red-900 text-red-300'
              }`}>
                {course.level}
              </span>
              <p className="text-gray-300 leading-relaxed">{course.description}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateCourse} className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Edit Course</h2>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-gray-400 text-sm mb-1">Course Name</label>
                  <input
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    required
                  />
               </div>
               <div>
                  <label className="block text-gray-400 text-sm mb-1">Level</label>
                   <select
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                    value={editData.level}
                    onChange={(e) => setEditData({ ...editData, level: e.target.value })}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
               </div>
               <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Image URL</label>
                  <input
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                    value={editData.image}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                    required
                  />
               </div>
               <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Description</label>
                  <textarea
                    className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    required
                  />
               </div>
             </div>
             <div className="flex justify-end pt-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition font-medium">
                  Save Changes
                </button>
             </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule Form */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-white">Schedule Lecture</h2>
            {message.text && (
              <div className={`p-3 rounded mb-4 text-sm ${message.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/50 text-green-200 border border-green-800'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Instructor</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                  value={formData.instructorId}
                  onChange={(e) => setFormData({...formData, instructorId: e.target.value})}
                  required
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(inst => (
                    <option key={inst._id} value={inst._id}>{inst.name} ({inst.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Date</label>
                <input 
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-medium">
                Add Lecture
              </button>
            </form>
          </div>
        </div>

        {/* Lectures List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-white">Scheduled Lectures</h2>
          <div className="bg-gray-800 shadow-lg rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-700/50 text-gray-300">
                <tr>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Instructor</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {lectures.map(lec => (
                  <tr key={lec._id} className="hover:bg-gray-700/30 transition">
                    <td className="p-4 text-white">{new Date(lec.date).toLocaleDateString()}</td>
                    <td className="p-4">
                        <div className="text-white font-medium">{lec.instructor?.name || 'Unknown'}</div>
                        <div className="text-gray-400 text-xs">{lec.instructor?.email}</div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteLecture(lec._id)}
                        className="text-red-400 hover:text-red-300 font-medium text-sm bg-red-900/20 hover:bg-red-900/40 px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {lectures.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">No lectures scheduled yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetail;
