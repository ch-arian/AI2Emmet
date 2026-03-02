import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmmetRenderer } from './EmmetRenderer';

describe('EmmetRenderer', () => {
  it('renders parsed emmet string', () => {
    render(<EmmetRenderer emmet="div.card>h1{Hello}" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading true', () => {
    render(<EmmetRenderer emmet="div" isLoading={true} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('shows error fallback on parse error', () => {
    render(<EmmetRenderer emmet=">>>" />); // Invalid emmet
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/failed to render/i)).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    render(<EmmetRenderer emmet=">>>" onError={onError} />);
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('retries parsing when retry button clicked', async () => {
    const user = userEvent.setup();
    render(<EmmetRenderer emmet=">>>" />);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    // Verify retry button still exists (error still present since emmet unchanged)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders empty div for empty emmet', () => {
    const { container } = render(<EmmetRenderer emmet="" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeEmptyDOMElement();
  });

  it('applies className to wrapper div', () => {
    const { container } = render(
      <EmmetRenderer emmet="span{Test}" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onAction when action element clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmmetRenderer
        emmet='div[data-action="testAction"]{Click me}'
        onAction={onAction}
      />
    );

    const element = screen.getByText('Click me');
    await user.click(element);

    expect(onAction).toHaveBeenCalledWith('testAction', undefined, expect.any(MouseEvent));
  });

  it('does not show loading skeleton when isLoading false', () => {
    render(<EmmetRenderer emmet="div{Content}" isLoading={false} />);
    expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders undefined emmet as empty div', () => {
    const { container } = render(<EmmetRenderer emmet={undefined} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeEmptyDOMElement();
  });

  it('error fallback includes retry button', () => {
    render(<EmmetRenderer emmet=">>>" />);
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('onError callback receives Error instance', () => {
    const onError = vi.fn();
    render(<EmmetRenderer emmet="invalid>>>" onError={onError} />);

    expect(onError).toHaveBeenCalledTimes(1);
    const error = onError.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
  });
});
