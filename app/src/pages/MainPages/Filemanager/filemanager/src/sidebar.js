import React from 'react';

function Sidebar() {
  return (
    <div>
      <img src = {require('./affordableLogo.png')} className ="logo" alt ="AFFORDABLE Logo"/>
      <ul className = "sideBarList">
        <li>Dashboard</li>
        <li>Application Center</li>
        <li>Health Utilizing Grants</li>
        <li>Medical Debt Marketplace</li>
        <li>SUPPORT</li>
      </ul>
    </div>
  );
}

export default Sidebar;
console.log("SIDEBAR EXPORTED");
