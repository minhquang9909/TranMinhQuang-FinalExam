import React, { useState } from "react";

const Buttons = ({ activeKey, onUpdate, checked, setChecked, todos }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "all" hoặc "selected"
  
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

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    
    setShowPopup(false);
    setTodoTitle("");
    onUpdate();
  };

  // 🚫 Đóng popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setTodoTitle("");
  };

  // 🧨 Hiển thị popup confirm xóa tất cả
  const handleDeleteAllClick = () => {
    setDeleteType("all");
    setShowConfirmDelete(true);
  };

  // 🧨 Hiển thị popup confirm xóa các item được chọn
  const handleDeleteSelectedClick = () => {
    setDeleteType("selected");
    setShowConfirmDelete(true);
  };

  // 🧨 Xóa tất cả todo trong tab Completed
  const handleDeleteAll = async () => {
    const completedTodos = await fetch(`${API_URL}?level=Completed`).then(res => res.json());
    
    await Promise.all(
      completedTodos.map((todo) =>
        fetch(`${API_URL}/${todo.id}`, { method: "DELETE" })
      )
    );
    
    setChecked([]);
    setShowConfirmDelete(false);
    onUpdate();
  };

  // 🧨 Xóa các todo được chọn trong tab Completed
  const handleDeleteSelected = async () => {
    await Promise.all(
      checked.map((id) =>
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
      )
    );
    
    setChecked([]);
    setShowConfirmDelete(false);
    onUpdate();
  };

  // 🚫 Đóng popup confirm
  const handleCloseConfirm = () => {
    setShowConfirmDelete(false);
    setDeleteType("");
  };

  // Lấy danh sách todos sẽ bị xóa
  const getItemsToDelete = () => {
    return deleteType === "all" 
      ? todos.filter(todo => todo.level === "Completed")
      : todos.filter(todo => checked.includes(todo.id));
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
                onClick={handleDeleteAllClick}
                className="w-30 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete All
              </button>
            ) : (
              <button
                onClick={handleDeleteSelectedClick}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {/* Popup confirm delete */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              {deleteType === "all" ? "Xoá Hết? Chắc Chưa?" : "Check Lại Chưa?"}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {deleteType === "all" 
                ? "Bạn có chắc chắn muốn xóa tất cả todos đã hoàn thành?"
                : "Bạn có chắc chắn muốn xóa những todos đã chọn?"
              }
            </p>

            {/* Hiển thị danh sách sẽ bị xóa */}
            <div className="max-h-40 overflow-y-auto mb-4 border border-gray-200 rounded-md p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Những mục sẽ bị xóa:
              </p>
              {getItemsToDelete().map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-gray-600 line-through">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCloseConfirm}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Chưa Chắc :3 
              </button>
              <button
                onClick={deleteType === "all" ? handleDeleteAll : handleDeleteSelected}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Chắc!!! ({getItemsToDelete().length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Buttons;
