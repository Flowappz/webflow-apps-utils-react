import { render } from '@testing-library/react';

import type { IconComponent } from '../types';
import * as Icons from './index';

const iconEntries = (Object.entries(Icons) as [string, IconComponent][]).filter(
	([, component]) => typeof component === 'function'
);

describe('icons barrel', () => {
	it('exports icon components', () => {
		expect(iconEntries.length).toBeGreaterThan(100);
	});

	it.each(iconEntries)('%s renders an <svg> element', (_name, Icon) => {
		const { container } = render(<Icon />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});
});
