import type { ComponentShowcase, SectionContent } from '../types.js';

/**
 * Forms component showcase definitions for demo applications.
 */

export const inputShowcase: ComponentShowcase = {
  component: 'Input',
  title: 'Input',
  description: 'A text input field for collecting user data.',
  variants: ['default', 'disabled', 'error'],
  interactive: true,
};

export const textareaShowcase: ComponentShowcase = {
  component: 'Textarea',
  title: 'Textarea',
  description: 'A multi-line text input for longer content.',
  variants: ['default', 'disabled', 'error'],
  interactive: true,
};

export const selectShowcase: ComponentShowcase = {
  component: 'Select',
  title: 'Select',
  description: 'A dropdown selection component.',
  variants: ['default', 'disabled', 'placeholder'],
  interactive: true,
};

export const checkboxShowcase: ComponentShowcase = {
  component: 'Checkbox',
  title: 'Checkbox',
  description: 'A toggle for boolean options.',
  variants: ['default', 'checked', 'indeterminate', 'disabled'],
  interactive: true,
};

export const radioShowcase: ComponentShowcase = {
  component: 'Radio',
  title: 'Radio Group',
  description: 'A group of mutually exclusive options.',
  variants: ['horizontal', 'vertical'],
  interactive: true,
};

export const switchShowcase: ComponentShowcase = {
  component: 'Switch',
  title: 'Switch',
  description: 'A toggle switch for on/off states.',
  variants: ['default', 'checked', 'disabled'],
  interactive: true,
};

export const sliderShowcase: ComponentShowcase = {
  component: 'Slider',
  title: 'Slider',
  description: 'A range input for selecting numeric values.',
  variants: ['default', 'range', 'disabled'],
  interactive: true,
};

export const formsSectionContent: SectionContent = {
  id: 'forms',
  title: 'Forms',
  description: 'Components for building accessible and user-friendly forms, including inputs, selects, checkboxes, and more.',
  components: [
    inputShowcase,
    textareaShowcase,
    selectShowcase,
    checkboxShowcase,
    radioShowcase,
    switchShowcase,
    sliderShowcase,
  ],
};
