import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Note from './Note';
import { expect, test } from 'vitest';

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.getByText(
    'Component testing is done with react-testing-library'
  );

  screen.debug(element);

  expect(element).toBeDefined();
});

test('renders content, searching with a text that is not the same', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.getByText('Component testing is done with', {
    exact: false,
  });

  // const element = await screen.findByText('Component testing is done with'); // otra forma

  expect(element).toBeDefined();
});

test('renders content selecting with className', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };

  const { container } = render(<Note note={note} />);

  const div = container.querySelector('.note');
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  );
});

test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.queryByText('do not want this thing to be rendered');
  expect(element).toBeNull();
});

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };

  // eslint-disable-next-line no-undef
  const mockHandler = vi.fn(); // El controlador de eventos es la función mock definida con Vitest

  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup(); // Se inicia una session (sesión) para interactuar con el componente renderizado
  const button = screen.getByText('make not important');
  await user.click(button);

  // Las llamadas a la mock function son guardadas en el array mock.calls dentro del objeto de la mock function
  expect(mockHandler.mock.calls).toHaveLength(1); // La expectativa de la prueba utiliza toHaveLength para verificar que la mock function (función simulada) se haya llamado exactamente una vez
});
