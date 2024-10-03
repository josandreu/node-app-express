// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { useState, useEffect } from 'react';
import './App.css';
import Note from './components/Note';
import Notification from './components/Notification';
import noteService from './services/notes';
import loginService from './services/login';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const hook = () => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  };

  useEffect(hook, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []); // El array vacío como parámetro del effect hook asegura que el hook se ejecute solo cuando el componente es renderizado por primera vez.

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      setUser(user);
      noteService.setToken(user.token);
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    const newObject = {
      //id: notes.length + 1,
      content: newNote,
      important: Math.random() > 0.5,
    };

    noteService.create(newObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    });
  };

  const toggleImportance = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        alert(`the note '${note.content}' was already deleted from server`);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const filteredNotes = showAll
    ? notes
    : notes.filter((note) => note.important);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username{' '}
        <input
          type='text'
          name='Username'
          id='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type='password'
          name='Password'
          id='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <br />
      <button type='submit'>login</button>
    </form>
  );

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type='submit'>save</button>
    </form>
  );

  return (
    <>
      <div>
        <h1>Notes</h1>

        <Notification message={errorMessage} />
        {user !== null && (
          <div>
            <p>{user.name} logged-in</p>
          </div>
        )}
        {user === null && loginForm()}
        <br />
        <hr />
        <br />
        {filteredNotes.map((note) => {
          return (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportance(note.id)}
            />
          );
        })}
      </div>
      <br />
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show important' : 'Show All'}
      </button>
      <hr />
      {user !== null && noteForm()}
    </>
  );
}

export default App;
