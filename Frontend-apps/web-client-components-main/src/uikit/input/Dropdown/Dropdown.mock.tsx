import React from 'react';
import { Icon } from '../../feedback';

export const options = [
  { label: 'Option 1', value: 'opt-1' },
  { label: 'Option 2', value: 'opt-2' },
  { label: 'Option 3', value: 'opt-3' },
  { label: 'Option 4', value: 'opt-4' },
  { label: 'Option 5', value: 'opt-5' },
  { label: 'Option 6', value: 'opt-6' },
  { label: 'Option 7', value: 'opt-7' }
];

export const largeOptions = [
  {
    label: 'This is an extremely long label with a lot of text',
    value: 'opt-1'
  },
  {
    label: 'This is another extremely long label with a lot of text',
    value: 'opt-2'
  },
  {
    label: 'Yet another extremely long label with a lot of text',
    value: 'opt-3'
  },
  {
    label: 'An additional extremely long label with a lot of text',
    value: 'opt-4'
  },
  {
    label: 'Another one of those extremely long labels with a lot of text',
    value: 'opt-5'
  },
  {
    label: 'Yet again, an extremely long label with a lot of text',
    value: 'opt-6'
  },
  {
    label: 'Once more, an extremely long label with a lot of text',
    value: 'opt-7'
  }
];

export const optionsWithIcons = [
  {
    label: (
      <span className="flex gap-1 items-center">
        <Icon name="done" />
        Option 1
      </span>
    ),
    value: 'opt-1'
  },
  {
    label: (
      <span className="flex gap-1 items-center">
        <Icon name="done" />
        Option 2
      </span>
    ),
    value: 'opt-2'
  },
  {
    label: (
      <span className="flex gap-1 items-center">
        <Icon name="done" />
        Option 3
      </span>
    ),
    value: 'opt-3'
  },
  {
    label: (
      <span className="flex gap-1 items-center">
        <Icon name="done" />
        Option 4
      </span>
    ),
    value: 'opt-4'
  },
  {
    label: (
      <span className="flex gap-1 items-center">
        <Icon name="done" />
        Option 5
      </span>
    ),
    value: 'opt-5'
  },
  {
    label: (
      <span className="flex gap-1 items-center">
        <Icon name="done" />
        Option 6
      </span>
    ),
    value: 'opt-6'
  },
  {
    label: (
      <span className="flex gap-1 items-center">
        <Icon name="done" />
        Option 7
      </span>
    ),
    value: 'opt-7'
  }
];
