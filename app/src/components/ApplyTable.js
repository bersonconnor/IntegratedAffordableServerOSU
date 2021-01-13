import "../styles/apply-table.css";

import React from "react";

function generateTHRow(headerRow) {
  return headerRow.map((curr, i) => {
    return <th key={`${curr}-${i}`}>{curr}</th>;
  });
}

const ApplyTableRow = ({ children, row, handleCharityClick }) => {
  return (
    <tr onClick={handleCharityClick ? handleCharityClick : undefined}>
      {children}
      {row.map(info => {
        return <td>{info}</td>;
      })}
    </tr>
  );
};

const ApplyTable = ({ headerRow, contentRows, handleCharityClick }) => {
  return (
    <table className="table table-striped mb-0 fixed">
      <thead className="apply-table-thead">
        <tr>{generateTHRow(headerRow)}</tr>
      </thead>
      <tbody>
        {contentRows
          ? contentRows.map((row, index) => (
              <ApplyTableRow
                row={row}
                key={index}
                handleCharityClick={
                  handleCharityClick ? handleCharityClick(index) : undefined
                }
              />
            ))
          : null}
      </tbody>
    </table>
  );
};

export default ApplyTable;
