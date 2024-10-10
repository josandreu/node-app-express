import PropTypes from 'prop-types';

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

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
