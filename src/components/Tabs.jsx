import React, { useState, useEffect } from 'react';
import Content from './Content.jsx';
import Search from './Search.jsx';
import Buttons from './Buttons.jsx';


const Tabs = () => {
    const [active, setActive] = useState('1');
    const [query, setQuery] = useState('');
    const [todos, setTodos] = useState([]);
    const [checked, setChecked] = useState([]);

    const API_URL = "http://localhost:3001/todos";

    const refreshContents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
    };
        useEffect(() => {
            refreshContents();
        }, []);

    const tabs = [
        { key: '1', label: 'All' },
        { key: '2', label: 'Active' },
        { key: '3', label: 'Completed' },
    ];

  return (
    <div className="w-full">
      {/* Thanh tab */}
      <div className="flex border-b border-gray-300">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
                setActive(tab.key);
                setChecked([]);
            }}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 w-[33.33%]
              ${active === tab.key
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

        {/* Thanh tìm kiếm và nút thêm/xoá */}
      <div className="flex w-full border border-t-0 border-gray-300 rounded-t-md bg-white">
        <Search query={query} setQuery={setQuery} />
        <Buttons 
          activeKey={active} 
          onUpdate={refreshContents}
          checked={checked}
          setChecked={setChecked}
        />
      </div>

      {/* Nội dung tab */}
      <div className="p-4 border border-gray-300 rounded-b-md bg-white">
        <Content 
          activeKey={active} 
          query={query} 
          todos={todos} 
          checked={checked} 
          setChecked={setChecked}
          onUpdate={refreshContents}
        />
      </div>
    </div>
  );
};

export default Tabs;
