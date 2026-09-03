import { findTextNode, isScrollable, isVisible } from './dom';

describe('isScrollable', () => {
  it('returns true for elements with overflow auto or scroll', () => {
    const auto = document.createElement('div');
    auto.style.overflow = 'auto';
    document.body.appendChild(auto);

    const scroll = document.createElement('div');
    scroll.style.overflow = 'scroll';
    document.body.appendChild(scroll);

    expect(isScrollable(auto)).toBe(true);
    expect(isScrollable(scroll)).toBe(true);

    auto.remove();
    scroll.remove();
  });

  it('returns false for elements with hidden overflow', () => {
    const element = document.createElement('div');
    element.style.overflow = 'hidden';
    document.body.appendChild(element);

    expect(isScrollable(element)).toBe(false);

    element.remove();
  });
});

describe('findTextNode', () => {
  it('finds the first non-empty text node', () => {
    const element = document.createElement('div');
    element.textContent = 'hello';

    const textNode = findTextNode(element);

    expect(textNode).toBeDefined();
    expect(textNode?.nodeType).toBe(Node.TEXT_NODE);
    expect(textNode?.textContent).toBe('hello');
  });

  it('recurses into nested elements', () => {
    const element = document.createElement('div');
    element.innerHTML = '<span><strong>nested text</strong></span>';

    const textNode = findTextNode(element);

    expect(textNode?.textContent).toBe('nested text');
  });

  it('ignores whitespace-only text nodes', () => {
    const element = document.createElement('div');
    element.innerHTML = '   <span>real text</span>';

    const textNode = findTextNode(element);

    expect(textNode?.textContent).toBe('real text');
  });

  it('returns undefined when there is no text', () => {
    const element = document.createElement('div');

    expect(findTextNode(element)).toBeUndefined();
  });
});

describe('isVisible', () => {
  it('returns false for elements without layout (jsdom default)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    // jsdom has no layout engine: offsetWidth/offsetHeight are 0 and there are no client rects
    expect(isVisible(element)).toBe(false);

    element.remove();
  });

  it('returns true when the element has an offset width', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'offsetWidth', { value: 100 });

    expect(isVisible(element)).toBe(true);
  });

  it('returns true when the element has client rects', () => {
    const element = document.createElement('div');
    element.getClientRects = () => [{}] as unknown as DOMRectList;

    expect(isVisible(element)).toBe(true);
  });
});
