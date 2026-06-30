import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptimizedImage from '../OptimizedImage';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, ...props }: any) => {
    // Next's <Image fill> is a special boolean prop, not a DOM attribute — React
    // drops a boolean `fill` off a raw <img>. Mirror it as a string attribute so
    // tests can assert the component opted into fill mode.
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} {...(fill ? { fill: 'true' } : {})} />;
  },
}));

describe('OptimizedImage', () => {
  let observerCallback: IntersectionObserverCallback;
  let mockObserver: IntersectionObserver;

  beforeEach(() => {
    // Setup IntersectionObserver mock
    mockObserver = {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
      takeRecords: jest.fn(() => []),
      root: null,
      rootMargin: '',
      thresholds: [],
    };

    global.IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return mockObserver;
    });
  });

  // OptimizedImage lazy-loads the <img> only once it scrolls into view (unless
  // `priority`). Tests that assert on the rendered <img> must first simulate the
  // element entering the viewport, exactly as the component's IntersectionObserver
  // callback would. Wrapped in act() so the resulting state update + re-render flush.
  const enterView = () =>
    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            target: document.body,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 1,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          },
        ],
        mockObserver
      );
    });

  it('renders with basic props', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    enterView();
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('image-container');
  });

  it('loads image when in viewport', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    // Simulate intersection
    observerCallback(
      [
        {
          isIntersecting: true,
          target: document.body,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ],
      mockObserver
    );

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/test-image.jpg');
      expect(img).toHaveAttribute('alt', 'Test image');
    });
  });

  it('loads immediately with priority prop', () => {
    render(
      <OptimizedImage
        src="/priority-image.jpg"
        alt="Priority image"
        width={300}
        height={200}
        priority
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/priority-image.jpg');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('applies custom className', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        className="custom-class"
      />
    );

    enterView();
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('image-container', 'custom-class');
  });

  it('uses fill mode when no dimensions provided', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
      />
    );

    enterView();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('fill', 'true');
    expect(img.style.objectFit).toBe('cover');
  });

  it('applies custom quality setting', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        quality={85}
      />
    );

    enterView();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('quality', '85');
  });

  it('uses provided blur data URL', () => {
    const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...';

    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />
    );

    enterView();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('blurDataURL', blurDataURL);
  });

  it('generates default blur placeholder when not provided', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        placeholder="blur"
      />
    );

    enterView();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('blurDataURL');
    expect(img.getAttribute('blurDataURL')).toContain('data:image/svg+xml;base64');
  });

  it('sets responsive sizes attribute', () => {
    const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        sizes={sizes}
      />
    );

    enterView();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('sizes', sizes);
  });

  it('shows placeholder before intersection', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    // Before intersection, should show placeholder
    const placeholder = document.querySelector('.image-placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('removes placeholder after intersection', async () => {
    const { container } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    // Simulate intersection
    observerCallback(
      [
        {
          isIntersecting: true,
          target: document.body,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ],
      mockObserver
    );

    await waitFor(() => {
      const placeholder = container.querySelector('.image-placeholder');
      expect(placeholder).not.toBeInTheDocument();
    });
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    unmount();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('sets lazy loading by default', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    enterView();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('uses rootMargin for earlier loading', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    );

    // Check that IntersectionObserver was called with rootMargin
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '50px',
        threshold: 0.01,
      })
    );
  });
});