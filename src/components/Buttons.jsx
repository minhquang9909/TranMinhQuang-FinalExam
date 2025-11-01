import React, { useState } from "react";

const Buttons = ({ activeKey, onUpdate, checked, setChecked }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  
    const API_URL = "http://localhost:3001/todos";

  // 🧩 Hiển thị popup để nhập title
  const handleAddClick = () => {
    setShowPopup(true);
    setTodoTitle("");
  };

  // 🧩 Thêm todo mới với title từ popup
  const handleAddTodo = async () => {
    if (!todoTitle.trim()) {
      alert("Vui lòng nhập tiêu đề todo!");
      return;
    }

    const newTodo = {
      title: todoTitle.trim(),
      level: "Active",
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      setShowPopup(false);
      setTodoTitle("");
      onUpdate(); // Refresh lại danh sách sau khi thêm
    } catch (error) {
      console.error("Lỗi khi thêm todo:", error);
    }
  };

  // 🚫 Đóng popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setTodoTitle("");
  };

  // 🧨 Xóa tất cả todo trong tab Completed
  const handleDeleteAll = async () => {
    try {
      // Lấy tất cả todos có level = "Completed"
      const completedTodos = await fetch(`${API_URL}?level=Completed`).then(res => res.json());
      
      // Xóa tất cả completed todos
      await Promise.all(
        completedTodos.map((todo) =>
          fetch(`${API_URL}/${todo.id}`, { method: "DELETE" })
        )
      );
      
      setChecked([]); // reset danh sách được chọn
      onUpdate(); // refresh lại danh sách
    } catch (error) {
      console.error("Lỗi khi xoá tất cả todo:", error);
    }
  };

  // 🧨 Xóa các todo được chọn trong tab Completed
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        checked.map((id) =>
          fetch(`${API_URL}/${id}`, { method: "DELETE" })
        )
      );
      setChecked([]); // reset danh sách được chọn
      onUpdate(); // refresh lại danh sách
    } catch (error) {
      console.error("Lỗi khi xoá todo được chọn:", error);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center p-2">
        {/* Nếu là tab All hoặc Active → hiện nút Add */}
        {(activeKey === "1" || activeKey === "2") && (
          <button
            onClick={handleAddClick}
            className="w-30 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        )}

        {/* Nếu là tab Completed → hiện Delete All hoặc Delete */}
        {activeKey === "3" && (
          <>
            {checked.length === 0 ? (
              <button
                onClick={handleDeleteAll}
                className="w-30 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete All
              </button>
            ) : (
              <button
                onClick={handleDeleteSelected}
                className="w-30 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete ({checked.length})
              </button>
            )}
          </>
        )}
      </div>

      {/* Popup để nhập todo title */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Nhập #todo mới</h3>
            
            <input
              type="text"
              placeholder="Nhập #todo..."
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Buttons;
