import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButtons, CompactShareButtons } from '../ShareButtons';

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe('ShareButtons', () => {
  const mockProps = {
    url: 'https://theshadium.com/worldcup2026',
    title: 'FIFA World Cup 2026 Shaded Seats',
    description: 'Find the best shaded seats at all 16 venues',
    hashtags: ['WorldCup2026', 'TheShadium'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  describe('ShareButtons (full version)', () => {
    it('renders share button', () => {
      render(<ShareButtons {...mockProps} />);
      expect(screen.getByRole('button', { name: /share this page/i })).toBeInTheDocument();
    });

    it('shows share menu when clicked (no native share)', () => {
      // Mock no native share support
      Object.assign(navigator, { share: undefined });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });

      fireEvent.click(shareButton);

      expect(screen.getByText(/share on twitter/i)).toBeInTheDocument();
      expect(screen.getByText(/share on facebook/i)).toBeInTheDocument();
      expect(screen.getByText(/copy link/i)).toBeInTheDocument();
    });

    it('generates correct Twitter share URL', () => {
      Object.assign(navigator, { share: undefined });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      const twitterLink = screen.getByText(/share on twitter/i).closest('a');
      expect(twitterLink).toHaveAttribute('href');
      expect(twitterLink?.getAttribute('href')).toContain('twitter.com/intent/tweet');
      expect(twitterLink?.getAttribute('href')).toContain(encodeURIComponent(mockProps.url));
      expect(twitterLink?.getAttribute('href')).toContain(encodeURIComponent(mockProps.title));
      expect(twitterLink?.getAttribute('href')).toContain('WorldCup2026,TheShadium');
    });

    it('generates correct Facebook share URL', () => {
      Object.assign(navigator, { share: undefined });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      const facebookLink = screen.getByText(/share on facebook/i).closest('a');
      expect(facebookLink).toHaveAttribute('href');
      expect(facebookLink?.getAttribute('href')).toContain('facebook.com/sharer');
      expect(facebookLink?.getAttribute('href')).toContain(encodeURIComponent(mockProps.url));
    });

    it('copies link to clipboard', async () => {
      Object.assign(navigator, { share: undefined });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      const copyButton = screen.getByText(/copy link/i).closest('button');
      fireEvent.click(copyButton!);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(mockProps.url);
      });

      expect(screen.getByText(/link copied/i)).toBeInTheDocument();
    });

    it('shows copied state temporarily', async () => {
      Object.assign(navigator, { share: undefined });
      jest.useFakeTimers();

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      const copyButton = screen.getByText(/copy link/i).closest('button');
      fireEvent.click(copyButton!);

      await waitFor(() => {
        expect(screen.getByText(/link copied/i)).toBeInTheDocument();
      });

      // Fast forward 2 seconds
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.queryByText(/link copied/i)).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('closes menu when clicking outside', () => {
      Object.assign(navigator, { share: undefined });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      expect(screen.getByText(/share on twitter/i)).toBeInTheDocument();

      // Click overlay
      const overlay = document.querySelector('.fixed.inset-0');
      fireEvent.click(overlay!);

      expect(screen.queryByText(/share on twitter/i)).not.toBeInTheDocument();
    });

    it('uses native share API when available', () => {
      const mockShare = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { share: mockShare });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      expect(mockShare).toHaveBeenCalledWith({
        title: mockProps.title,
        text: mockProps.description,
        url: mockProps.url,
      });

      // Menu should not appear
      expect(screen.queryByText(/share on twitter/i)).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<ShareButtons {...mockProps} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('CompactShareButtons', () => {
    it('renders all compact share buttons', () => {
      render(<CompactShareButtons {...mockProps} />);

      expect(screen.getByLabelText(/share on twitter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share on facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/copy link/i)).toBeInTheDocument();
    });

    it('generates correct share URLs in compact mode', () => {
      render(<CompactShareButtons {...mockProps} />);

      const twitterLink = screen.getByLabelText(/share on twitter/i);
      expect(twitterLink).toHaveAttribute('href');
      expect(twitterLink.getAttribute('href')).toContain('twitter.com/intent/tweet');

      const facebookLink = screen.getByLabelText(/share on facebook/i);
      expect(facebookLink).toHaveAttribute('href');
      expect(facebookLink.getAttribute('href')).toContain('facebook.com/sharer');
    });

    it('copies link in compact mode', async () => {
      render(<CompactShareButtons {...mockProps} />);

      const copyButton = screen.getByLabelText(/copy link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(mockProps.url);
      });

      expect(screen.getByLabelText(/link copied/i)).toBeInTheDocument();
    });

    it('stops event propagation on clicks', () => {
      const mockOnClick = jest.fn();

      render(
        <div onClick={mockOnClick}>
          <CompactShareButtons {...mockProps} />
        </div>
      );

      const twitterLink = screen.getByLabelText(/share on twitter/i);
      fireEvent.click(twitterLink);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('shows copied state in compact mode', async () => {
      jest.useFakeTimers();

      render(<CompactShareButtons {...mockProps} />);

      const copyButton = screen.getByLabelText(/copy link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/link copied/i)).toBeInTheDocument();
      });

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.queryByLabelText(/link copied/i)).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('applies custom className in compact mode', () => {
      const { container } = render(
        <CompactShareButtons {...mockProps} className="compact-custom" />
      );
      expect(container.firstChild).toHaveClass('compact-custom');
    });
  });

  describe('Error handling', () => {
    it('handles clipboard write failures gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));

      Object.assign(navigator, { share: undefined });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      const copyButton = screen.getByText(/copy link/i).closest('button');
      fireEvent.click(copyButton!);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
      });

      consoleError.mockRestore();
    });

    it('handles native share cancellation', async () => {
      const consoleLog = jest.spyOn(console, 'log').mockImplementation();
      const mockShare = jest.fn().mockRejectedValue(new Error('User cancelled'));
      Object.assign(navigator, { share: mockShare });

      render(<ShareButtons {...mockProps} />);
      const shareButton = screen.getByRole('button', { name: /share this page/i });
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(consoleLog).toHaveBeenCalledWith('Share cancelled or failed:', expect.any(Error));
      });

      consoleLog.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      Object.assign(navigator, { share: undefined });

      render(<ShareButtons {...mockProps} />);

      expect(screen.getByRole('button', { name: /share this page/i })).toBeInTheDocument();
    });

    it('has proper ARIA labels in compact mode', () => {
      render(<CompactShareButtons {...mockProps} />);

      expect(screen.getByLabelText(/share on twitter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share on facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/copy link/i)).toBeInTheDocument();
    });

    it('opens social links in new tab with security', () => {
      render(<CompactShareButtons {...mockProps} />);

      const twitterLink = screen.getByLabelText(/share on twitter/i);
      expect(twitterLink).toHaveAttribute('target', '_blank');
      expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

      const facebookLink = screen.getByLabelText(/share on facebook/i);
      expect(facebookLink).toHaveAttribute('target', '_blank');
      expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
