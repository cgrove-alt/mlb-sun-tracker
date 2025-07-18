import React from 'react';

export const TestFilter: React.FC = () => {
  return (
    <div style={{ background: 'yellow', padding: '20px', border: '2px solid red' }}>
      <h3>TEST FILTER - THIS SHOULD BE VISIBLE</h3>
      <div style={{ background: 'lightblue', padding: '10px', margin: '10px 0' }}>
        <input type="radio" id="test1" name="test" value="1" />
        <label htmlFor="test1">Test Option 1</label>
      </div>
      <div style={{ background: 'lightgreen', padding: '10px', margin: '10px 0' }}>
        <input type="radio" id="test2" name="test" value="2" />
        <label htmlFor="test2">Test Option 2</label>
      </div>
    </div>
  );
};