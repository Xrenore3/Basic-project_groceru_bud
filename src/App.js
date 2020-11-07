import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "nice",
    type: "success",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // display alert
      showAlert(true, "please, enter value", "danger");
    } else if (name && isEditing) {
      // deal with edit
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      showAlert(true, "value changed", "success");

      setIsEditing(false);
      setName("");
      setEditID(null);
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      showAlert(true, "item added to the list", "success");
      setName("");
    }
  };

  const clearList = () => {
    showAlert(true, "all items cleared", "danger");
    setList([]);
  };
  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };
  const deleteItem = (id) => {
    showAlert(true, "success deleted item", "success");
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  };
  const editItem = (id) => {
    const editingItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setName(editingItem.title);
    setEditID(id);
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show ? (
          <Alert {...alert} removeAlert={showAlert} list={list} />
        ) : (
          <p className="alert"></p>
        )}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e. g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit-btn" type="submit">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List
            items={list}
            deleteItem={deleteItem}
            editItem={editItem}
            setEditID={setEditID}
          />
       
            <button disabled={isEditing} className="clear-btn" onClick={clearList}>
              clear items
            </button>
        
        </div>
      )}
    </section>
  );
}

export default App;
