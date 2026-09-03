import { isHTMLElement } from './guards';

/**
 * Check if an element is scrollable
 * @param element
 * @returns True or false
 */
export const isScrollable = (element: Element): boolean => {
  const { overflow } = getComputedStyle(element);
  return overflow === 'auto' || overflow === 'scroll';
};

/**
 * Finds the first child text node of an element
 * @param element The element to search into.
 */
export const findTextNode = (element: HTMLElement): ChildNode | undefined => {
  let textNode: ChildNode | undefined;

  for (const node of Array.from(element.childNodes)) {
    if (isHTMLElement(node) && node.childNodes.length) textNode = findTextNode(node);
    else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) textNode = node;

    if (textNode) break;
  }

  return textNode;
};

/**
 * Checks if an element is visible
 * @param element
 */
export const isVisible = (element: HTMLElement): boolean =>
  !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
