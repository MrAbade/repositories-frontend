import React, { useState } from "react";

const EntryTech = ({ techNameEntry, techNameRemove }) => {
  const [techName, setTechName] = useState("");
  const techs = [];
  let lastTech = "";

  return (
    <tr className="entry-item" id="techs-entry">
      <td className="td-label" align="right">
        <label htmlFor="tech-item">Tech</label>
      </td>
      <td>
        <input
          id="tech-item"
          type="text"
          value={techName}
          onChange={(event) => {
            if (!event.target.value) {
              techs.splice(
                techs.findIndex((name) => name === lastTech),
                1
              );
            }
            setTechName(event.target.value);
          }}
          onBlur={() => {
            if (!techs.includes(techName.trim()) && techName) {
              techNameEntry(techName);
              lastTech = techName;
              techs.push(techName);
            }
          }}
        />
      </td>
    </tr>
  );
};

export default EntryTech;
