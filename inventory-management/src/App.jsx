import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inventoryData, setInventoryData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://magallanes-inventory-management.netlify.app/.netlify/functions/api');
        const data = await response.json();
        setInventoryData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewName(item.name);
    setNewQuantity(item.quantity);
  };

  const handleSaveEdit = async () => {
    const updatedItem = { ...editingItem, name: newName, quantity: parseInt(newQuantity, 10) };
    await updateItem(updatedItem);
    
    const updatedData = inventoryData.map((item) =>
      item._id === editingItem._id ? updatedItem : item
    );
    setInventoryData(updatedData);
    setEditingItem(null);
    setNewName('');
    setNewQuantity('');
  };

  const updateItem = async (updatedItem) => {
    try {
      const response = await fetch(`https://magallanes-inventory-management.netlify.app/.netlify/functions/api/${updatedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`https://magallanes-inventory-management.netlify.app/.netlify/functions/api/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      const updatedData = inventoryData.filter((item) => item._id !== itemId);
      setInventoryData(updatedData);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const addItem = async () => {
    const newItem = { name: newItemName, quantity: parseInt(newItemQuantity, 10) };
    try {
      const response = await fetch('https://magallanes-inventory-management.netlify.app/.netlify/functions/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
  
      const addedItem = await response.json();
      setInventoryData(prevData => [...prevData, addedItem]); // Use previous state
      setNewItemName('');
      setNewItemQuantity('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  

  return (
    
    <div className="container">
      <form>
        <h2>Office Inventory Management</h2>
        <label htmlFor="itemName">Item name:</label>
        <input
          type="text"
          id="itemName"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(e.target.value)}
        />
        <button type="button" onClick={addItem}>Add Item</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Maintain</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>
                {editingItem === item ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editingItem === item ? (
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {editingItem === item ? (
                  <button onClick={handleSaveEdit}>Save</button>
                ) : (
                  <div className="maintain-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
