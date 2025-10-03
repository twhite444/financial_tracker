import { describe, it, expect } from 'vitest';
import {
  pageTransition,
  cardContainer,
  cardItem,
  modalBackdrop,
  modalContent,
  accordionVariants,
  buttonTap,
  slideIn,
  scaleIn,
  fadeIn,
  toastVariants,
  listContainer,
  listItem,
  checkmarkVariants,
  shakeVariants,
} from '../../../src/utils/animations';

describe('Animation Variants', () => {
  describe('pageTransition', () => {
    it('should have correct animation states', () => {
      expect(pageTransition).toHaveProperty('initial');
      expect(pageTransition).toHaveProperty('animate');
      expect(pageTransition).toHaveProperty('exit');
      expect(pageTransition.initial).toEqual({ opacity: 0, y: 20 });
      expect(pageTransition.animate).toEqual({ opacity: 1, y: 0 });
      expect(pageTransition.exit).toEqual({ opacity: 0, y: -20 });
    });
  });

  describe('cardContainer and cardItem', () => {
    it('should have stagger configuration', () => {
      expect(cardContainer.hidden).toEqual({ opacity: 0 });
      expect(cardContainer.show).toHaveProperty('opacity', 1);
      expect(cardContainer.show).toHaveProperty('transition');
    });

    it('should have scale and opacity for items', () => {
      expect(cardItem.hidden).toEqual({ opacity: 0, y: 20, scale: 0.95 });
      expect(cardItem.show).toEqual({ opacity: 1, y: 0, scale: 1 });
    });
  });

  describe('modalBackdrop and modalContent', () => {
    it('should have fade in/out for backdrop', () => {
      expect(modalBackdrop.hidden).toEqual({ opacity: 0 });
      expect(modalBackdrop.visible).toEqual({ opacity: 1 });
    });

    it('should have scale and position for content', () => {
      expect(modalContent.hidden).toEqual({ opacity: 0, scale: 0.95, y: 20 });
      expect(modalContent.visible).toEqual({ opacity: 1, scale: 1, y: 0 });
      expect(modalContent.exit).toEqual({ opacity: 0, scale: 0.95, y: 20 });
    });
  });

  describe('accordionVariants', () => {
    it('should have height auto when open', () => {
      expect(accordionVariants.open).toEqual({ opacity: 1, height: 'auto' });
    });

    it('should have height 0 when collapsed', () => {
      expect(accordionVariants.collapsed).toEqual({ opacity: 0, height: 0 });
    });
  });

  describe('buttonTap', () => {
    it('should scale down on tap', () => {
      expect(buttonTap.scale).toBe(0.95);
      expect(buttonTap.transition).toHaveProperty('duration');
    });
  });

  describe('slideIn animations', () => {
    it('should have all four directions', () => {
      expect(slideIn).toHaveProperty('fromLeft');
      expect(slideIn).toHaveProperty('fromRight');
      expect(slideIn).toHaveProperty('fromTop');
      expect(slideIn).toHaveProperty('fromBottom');
    });

    it('should have correct initial positions', () => {
      expect(slideIn.fromLeft.initial).toEqual({ x: '-100%', opacity: 0 });
      expect(slideIn.fromRight.initial).toEqual({ x: '100%', opacity: 0 });
      expect(slideIn.fromTop.initial).toEqual({ y: '-100%', opacity: 0 });
      expect(slideIn.fromBottom.initial).toEqual({ y: '100%', opacity: 0 });
    });

    it('should animate to center position', () => {
      expect(slideIn.fromLeft.animate).toEqual({ x: 0, opacity: 1 });
      expect(slideIn.fromRight.animate).toEqual({ x: 0, opacity: 1 });
      expect(slideIn.fromTop.animate).toEqual({ y: 0, opacity: 1 });
      expect(slideIn.fromBottom.animate).toEqual({ y: 0, opacity: 1 });
    });
  });

  describe('scaleIn', () => {
    it('should scale from 0 to 1', () => {
      expect(scaleIn.initial).toEqual({ scale: 0, opacity: 0 });
      expect(scaleIn.animate).toEqual({ scale: 1, opacity: 1 });
      expect(scaleIn.exit).toEqual({ scale: 0, opacity: 0 });
    });
  });

  describe('fadeIn', () => {
    it('should fade opacity', () => {
      expect(fadeIn.initial).toEqual({ opacity: 0 });
      expect(fadeIn.animate).toEqual({ opacity: 1 });
      expect(fadeIn.exit).toEqual({ opacity: 0 });
    });
  });

  describe('toastVariants', () => {
    it('should have bounce-in effect', () => {
      expect(toastVariants.initial).toEqual({ opacity: 0, y: -50, scale: 0.3 });
      expect(toastVariants.animate).toEqual({ opacity: 1, y: 0, scale: 1 });
      expect(toastVariants.exit).toHaveProperty('opacity', 0);
      expect(toastVariants.exit).toHaveProperty('scale', 0.5);
    });
  });

  describe('listContainer and listItem', () => {
    it('should have stagger for list items', () => {
      expect(listContainer.hidden).toEqual({ opacity: 0 });
      expect(listContainer.visible).toHaveProperty('opacity', 1);
      expect(listContainer.visible).toHaveProperty('transition');
    });

    it('should slide in from left for items', () => {
      expect(listItem.hidden).toEqual({ opacity: 0, x: -20 });
      expect(listItem.visible).toEqual({ opacity: 1, x: 0 });
    });
  });

  describe('checkmarkVariants', () => {
    it('should animate path length', () => {
      expect(checkmarkVariants.hidden).toEqual({ pathLength: 0, opacity: 0 });
      expect(checkmarkVariants.visible).toHaveProperty('pathLength', 1);
      expect(checkmarkVariants.visible).toHaveProperty('opacity', 1);
    });
  });

  describe('shakeVariants', () => {
    it('should have shake animation', () => {
      expect(shakeVariants.shake).toHaveProperty('x');
      expect(shakeVariants.shake).toHaveProperty('transition');
    });
  });
});
