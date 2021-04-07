import React from 'react';

const MenuBar = ({ menu, children, view }) => {
  const {state, dispatch} = view;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        borderBottom: '1px black solid',
      }}
    >
      {children && (
        <div style={{ marginRight: '5px' }}>
          {children}
        </div>
      )}
      {
        // first iterate over the top level menu groupings
        Object.entries(menu).map(([key, values]) => (
          <div key={key} style={{ marginRight: '5px' }}>
            {
              // next iterate over renderable actions within groupings
              values.map((v) => v(state, dispatch))
            }
          </div>
        ))
      }
    </div>
  );
};

export default MenuBar;
