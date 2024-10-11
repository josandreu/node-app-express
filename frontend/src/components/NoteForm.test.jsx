import { render, screen } from '@testing-library/react';
import NoteForm from './NoteForm';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  // eslint-disable-next-line no-undef
  const createNote = vi.fn();
  const user = userEvent.setup();

  render(<NoteForm createNote={createNote} />);

  const input = screen.getByPlaceholderText('write note content here');
  const sendButton = screen.getByText('Save');

  await user.type(input, 'testing a form...');
  await user.click(sendButton);

  console.log(createNote.mock.calls);

  expect(createNote.mock.calls).toHaveLength(1);
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
});

test('<NoteForm /> updates parent state and calls onSubmit, selecting input id', async () => {
  // eslint-disable-next-line no-undef
  const createNote = vi.fn();
  const user = userEvent.setup();

  const { container } = render(<NoteForm createNote={createNote} />);

  const input = container.querySelector('#note-input');
  const sendButton = screen.getByText('Save');

  await user.type(input, 'testing a form...');
  await user.click(sendButton);

  expect(createNote.mock.calls).toHaveLength(1);
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
});
