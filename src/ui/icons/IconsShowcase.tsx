import './IconsShowcase.css';

import { useEffect, useMemo, useState } from 'react';

import type { IconComponent } from '../types';
import * as Icons from './index';

export interface IconsShowcaseProps {
	size?: number;
	color?: string;
}

// Filter out app icons (they're exported from apps/index.ts via re-export)
const allIconEntries = (Object.entries(Icons) as [string, IconComponent][]).filter(
	([name, component]) => {
		// Skip non-component exports and app-specific icons
		return (
			typeof component === 'function' &&
			!name.includes('App') &&
			!['CookieIcon', 'SliderAppIcon', 'TableAppIcon', 'TabsIcon'].includes(name)
		);
	}
);

export const IconsShowcase = ({ size: sizeProp = 24, color: colorProp = 'currentColor' }: IconsShowcaseProps) => {
	const [size, setSize] = useState(sizeProp);
	const [color, setColor] = useState(colorProp);
	const [search, setSearch] = useState('');

	useEffect(() => setSize(sizeProp), [sizeProp]);
	useEffect(() => setColor(colorProp), [colorProp]);

	const iconEntries = useMemo(
		() =>
			search
				? allIconEntries.filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
				: allIconEntries,
		[search]
	);

	const matchCount = iconEntries.length;

	return (
		<div className="fs-icons-showcase">
			<div className="controls">
				<label>
					Search:
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Filter icons..."
						className="search-input"
					/>
				</label>
				<label>
					Size (px):
					<input
						type="number"
						value={size}
						onChange={(e) => setSize(Number(e.target.value))}
						min="8"
						max="128"
						step="1"
					/>
				</label>
				<label>
					Color:
					<input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
					<input
						type="text"
						value={color}
						onChange={(e) => setColor(e.target.value)}
						style={{ width: 80 }}
					/>
				</label>
				<span className="count">{matchCount} icons</span>
			</div>

			<div className="icons-grid" style={{ color }}>
				{iconEntries.map(([name, Icon]) => (
					<div className="icon-item" key={name}>
						<div className="icon-wrapper" style={{ width: `${size}px`, height: `${size}px` }}>
							<Icon />
						</div>
						<span className="icon-name">{name}</span>
					</div>
				))}
			</div>
		</div>
	);
};
