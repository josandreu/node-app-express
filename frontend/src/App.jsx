// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import Note from './components/Note';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import NoteForm from './components/NoteForm';
import noteService from './services/notes';
import loginService from './services/login';

function App() {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

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

  const noteFormRef = useRef();

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

  const hanldeLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    window.location.reload();
  };

  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility();

    try {
      const returnedNote = await noteService.create(noteObject);
      if (returnedNote) {
        setNotes(notes.concat(returnedNote));
      }
    } catch (error) {
      setErrorMessage(error.response.statusText);
    }
  };

  const noteForm = () => (
    <Togglable buttonLabel={'New note'} ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  );

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

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' };
    const showWhenVisible = { display: loginVisible ? '' : 'none' };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            handleSubmit={handleLogin}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            password={password}
            username={username}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        <h1>Notes</h1>

        <Notification message={errorMessage} />
        {user !== null && (
          <div>
            <p>{user.name} logged-in</p>
            <button onClick={hanldeLogout}>Log out</button>
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
