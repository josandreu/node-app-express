const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username{' '}
          <input
            type='text'
            name='Username'
            id='username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            name='Password'
            id='password'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <br />
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
