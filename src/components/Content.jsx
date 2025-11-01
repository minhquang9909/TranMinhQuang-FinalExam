import React from "react";

const Content = ({ activeKey, query, checked, setChecked, todos, onUpdate }) => {
  const API_URL = "http://localhost:3001/todos";

  // Lọc theo tab
  let filtered = todos;
  if (activeKey === "2") {
    filtered = todos.filter((item) => item.level === "Active");
  } else if (activeKey === "3") {
    filtered = todos.filter((item) => item.level === "Completed");
  }

  // Lọc theo search
  if (query) {
    filtered = filtered.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // ✅ Đổi trạng thái Active <-> Completed
  const toggleLevel = async (id) => {
    const item = todos.find((i) => i.id === id); // Sử dụng === vì tất cả ID đều là string
    
    if (!item) {
      console.error("Item not found with id:", id);
      return;
    }

    const newLevel = item.level === "Completed" ? "Active" : "Completed";

    try {
      // Gửi PATCH lên API
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: newLevel }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Cập nhật UI
      onUpdate(); // Refresh data từ parent component
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Lỗi khi cập nhật todo. Vui lòng thử lại!");
    }
  };

  // ✅ Xử lý tick chọn xoá
  const handleCheckDelete = (id) => {
    if (checked.includes(id)) {
      setChecked(checked.filter((i) => i !== id));
    } else {
      setChecked([...checked, id]);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {filtered.length === 0 ? (
        <p className="text-gray-400 py-2">No todos found.</p>
      ) : (
        filtered.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-2"
          >
            {/* Bên trái: checkbox Completed */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.level === "Completed"}
                onChange={() => toggleLevel(item.id)}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <span
                className={`${
                  item.level === "Completed"
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }`}
              >
                {item.title}
              </span>
            </div>

            {/* Bên phải: checkbox Delete (luôn hiện ở tab Completed) */}
            {activeKey === "3" && (
              <input
                type="checkbox"
                checked={checked.includes(item.id)}
                onChange={() => handleCheckDelete(item.id)}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Content;
