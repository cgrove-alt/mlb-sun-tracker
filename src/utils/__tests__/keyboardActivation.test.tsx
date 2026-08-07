/**
 * A `<div onClick>` is invisible to keyboard and switch users — only natively
 * focusable elements fire a click from Enter/Space. Several components carried
 * `role="button"` and `tabIndex={0}` but no key handler, which is worse than
 * doing nothing: the element announces itself as a button, accepts focus, then
 * ignores activation.
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { onActivateKeyDown, activatableProps } from '../keyboardActivation';

describe('onActivateKeyDown', () => {
  it.each(['Enter', ' ', 'Spacebar'])('activates on %s', key => {
    const onActivate = jest.fn();
    render(<div data-testid="t" onKeyDown={onActivateKeyDown(onActivate)} />);
    fireEvent.keyDown(screen.getByTestId('t'), { key });
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it.each(['a', 'Escape', 'Tab', 'ArrowDown', 'Shift'])('ignores %s', key => {
    const onActivate = jest.fn();
    render(<div data-testid="t" onKeyDown={onActivateKeyDown(onActivate)} />);
    fireEvent.keyDown(screen.getByTestId('t'), { key });
    expect(onActivate).not.toHaveBeenCalled();
  });

  // Space's default action on a focused non-input is to scroll the page.
  it('prevents default on Space but not on Enter', () => {
    const onActivate = jest.fn();
    render(<div data-testid="t" onKeyDown={onActivateKeyDown(onActivate)} />);
    const el = screen.getByTestId('t');

    const space = fireEvent.keyDown(el, { key: ' ', cancelable: true });
    expect(space).toBe(false); // preventDefault called -> dispatchEvent returns false

    const enter = fireEvent.keyDown(el, { key: 'Enter', cancelable: true });
    expect(enter).toBe(true);
  });

  // Otherwise activating a nested button double-fires: once natively, once here.
  it('does not fire when the key originates in a nested control', () => {
    const onActivate = jest.fn();
    render(
      <div data-testid="outer" onKeyDown={onActivateKeyDown(onActivate)}>
        <button data-testid="inner">inner</button>
      </div>
    );
    fireEvent.keyDown(screen.getByTestId('inner'), { key: 'Enter' });
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('still fires for a non-control descendant', () => {
    const onActivate = jest.fn();
    render(
      <div data-testid="outer" onKeyDown={onActivateKeyDown(onActivate)}>
        <span data-testid="inner">text</span>
      </div>
    );
    fireEvent.keyDown(screen.getByTestId('inner'), { key: 'Enter' });
    expect(onActivate).toHaveBeenCalledTimes(1);
  });
});

describe('activatableProps', () => {
  it('supplies the full button contract, not just part of it', () => {
    const onActivate = jest.fn();
    const props = activatableProps(onActivate);
    expect(props.role).toBe('button');
    expect(props.tabIndex).toBe(0);
    expect(typeof props.onKeyDown).toBe('function');
  });

  it('takes a disabled element out of the tab order', () => {
    expect(activatableProps(() => {}, { disabled: true }).tabIndex).toBe(-1);
  });

  it('renders an element that is focusable and keyboard-activatable', () => {
    const onActivate = jest.fn();
    render(<div data-testid="t" {...activatableProps(onActivate, { label: 'Toggle' })} />);
    const el = screen.getByRole('button', { name: 'Toggle' });
    expect(el).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(el, { key: 'Enter' });
    expect(onActivate).toHaveBeenCalled();
  });
});
