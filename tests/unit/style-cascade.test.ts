import { describe, expect, it } from 'vitest';

describe('style cascade', () => {
    it('keeps component class styles ahead of the global base reset', () => {
        document.head.innerHTML = '';

        const componentStyle = document.createElement('style');
        componentStyle.textContent = `
            .animal-btn-primary-test {
                color: rgb(121, 79, 39);
            }
        `;

        const resetStyle = document.createElement('style');
        resetStyle.textContent = `
            body {
                color: rgb(0, 0, 0);
            }
        `;

        document.head.append(componentStyle, resetStyle);

        const element = document.createElement('button');
        element.className = 'animal-btn-primary-test';
        document.body.appendChild(element);

        expect(window.getComputedStyle(element).color).toBe('rgb(121, 79, 39)');
    });
});
