import React, { useEffect, useState } from 'react';
import List from './List';
import Alert from './Alert';

// this function is used for store the data locally
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(localStorage.getItem('list'));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // display alert
      showAlert(true, 'danger', `${'Atleast Add One Item :('}`);
    } else if (name && isEditing) {
      // deal with edit the item in the list
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditId(null);
      setIsEditing(false);
      showAlert(true, 'success', `${'item changed :)'}`);
    } else {
      // show alert
      showAlert(true, 'success', `${'1 item added to the list :)'}`);
      // add the new list in the item
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
    }
  };

  // its shows the alert message when the list is empty
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  // clear the all items in the list
  const clearList = () => {
    showAlert(true, 'danger', `${'all the items removed :('}`);
    setList([]);
  };

  // remove the item individually
  const removeItem = (id) => {
    showAlert(true, 'danger', `${'1 item removed... :('}`);
    setList(list.filter((item) => item.id !== id));
  };

  // edit the item in the given list
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };

  // adding a localStorage to display the list whenever the user refresh/re-render or closing the webpage the data cannot be deleted.
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} />}
        <h3>Grocery List</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='E.g. Add the item for your cooking....'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-conatiner'>
          <List
            items={list}
            removeItem={removeItem}
            editItem={editItem}
            list={list}
          />
          <button className='clear-btn' onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
