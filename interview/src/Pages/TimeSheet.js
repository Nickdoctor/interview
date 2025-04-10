import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../Styles/TimeSheet.css';
import React, { useState } from 'react';

function TimeSheetPage() {
    const [rate, setRate] = useState("");
    const [description, setDescription] = useState("");
    const [lineItems, setLineItems] = useState([{ date: "", minutes: ""}]);
  
    const handleLineItemChange = (index, field, value) => {
      const updated = [...lineItems];
      updated[index][field] = value;
      setLineItems(updated);
    };

    const handleSave = () => {
        const savedData = {
            lineItems, // Array of dates and hours
            totalTime, // Total hours worked
            rate, // Rate per hour
            description, // Description
            totalCost, // Total pay
        };

        console.log("Saved Data:", savedData);
        alert("Data saved successfully!");
    };
  
    const addLineItem = () => {
      setLineItems([...lineItems, { date: "", minutes: ""}]);
    };
  
    const totalTime = lineItems.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
    const totalCost = totalTime * Number(rate || 0) / 60;
  
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Timesheet</h1>
  
          {/* Line Items */}
          {lineItems.map((item, index) => (
            <div key={index} className="mb-4 flex gap-4">
              <input
                type="date"
                value={item.date}
                onChange={(e) => handleLineItemChange(index, "date", e.target.value)}
                className="flex-1 border rounded-lg p-2"
              />
              <input
                type="number"
                value={item.minutes}
                onChange={(e) => handleLineItemChange(index, "minutes", e.target.value)}
                className="flex-1 border rounded-lg p-2"
                placeholder="Minutes"
                min="0"
              />
            </div>
          ))}
  
          <button
            type="button"
            onClick={addLineItem}
            className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Day
          </button>
  
          {/* Rate */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rate ($ Per Hour)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Enter rate"
              min="0"
            />
          </div>
  
          {/* Totals */}
          <div className="mt-6 border-t pt-4">
            <div className="text-lg font-medium text-gray-700">
              Total Time Worked: <span className="font-bold">{totalTime} Minutes </span>
            </div>
            <div className="text-lg font-medium text-gray-700">
              Total Pay: <span className="font-bold">${totalCost.toFixed(2)}</span>
            </div>
            <textarea
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 border rounded-lg p-2"
                min="0"
              />
            <div>
                <Button variant="primary" className="mt-4" onClick={handleSave}>
                  Save </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default TimeSheetPage;