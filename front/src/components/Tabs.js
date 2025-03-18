import React, { useState } from "react";
import Settings from "./Settings";
import Categories from "./Categories";
import '../index.css'

function Tabs({ socket, start, categoriesData }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const tabs = [

    {
      title: "Categories",
      content: <Categories socket={socket} start={start} categoriesData={categoriesData}/>,
    },
    {
      title: "Game Settings",
      content: <Settings socket={socket} start={start} />,
    },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`tab-link ${activeTab === index ? "active" : ""}`}
          onClick={() => handleTabClick(index)}
          data-tab={`tab${index + 1}`}
        >
          {tab.title}
        </button>
      ))}
      {tabs.map((tab, index) => (
        <div
          key={index}
          id={`tab${index + 1}`}
          className={`tab-content ${activeTab === index ? "active" : ""}`}
        >
          <div>{tab.content}</div>
        </div>
      ))}
    </div>
  );
}

export default Tabs;
