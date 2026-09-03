import { render } from '@testing-library/react';

import { Loader } from './Loader';

describe('Loader', () => {
  it('renders an svg sized by the size prop', () => {
    const { container } = render(<Loader size={100} />);
    const svg = container.querySelector('svg.loader-svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '100');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
  });

  it('scales radius and stroke proportionally (24px design base)', () => {
    const { container } = render(<Loader size={24} />);
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
    expect(circles[0]).toHaveAttribute('r', '9');
    expect(circles[0]).toHaveAttribute('stroke-width', '2');
  });

  it('applies color, trackColor, speed and margin', () => {
    const { container } = render(
      <Loader size={48} color="#ff0000" trackColor="#00ff00" speed={2} margin="10px" />
    );
    const [track, arc] = Array.from(container.querySelectorAll('circle'));
    expect(track).toHaveAttribute('stroke', '#00ff00');
    expect(arc).toHaveAttribute('stroke', '#ff0000');
    expect(arc.style.animationDuration).toBe('2s');
    const wrapper = container.querySelector<HTMLElement>('.fs-loader-wrapper');
    expect(wrapper?.style.margin).toBe('10px');
  });

  it('uses defaults when no props are given', () => {
    const { container } = render(<Loader />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '48');
    const [, arc] = Array.from(container.querySelectorAll('circle'));
    expect(arc).toHaveAttribute('stroke', 'white');
  });
});
