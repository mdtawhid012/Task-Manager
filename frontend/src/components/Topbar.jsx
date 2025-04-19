const Topbar = () => {
    return (
      <div className="w-full bg-gray-800 text-white flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="p-2 rounded bg-gray-700 text-white"
          />
          <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded">
            ➕ Add Task
          </button>
          <div className="flex items-center gap-2">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <span>John Doe</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default Topbar;
  