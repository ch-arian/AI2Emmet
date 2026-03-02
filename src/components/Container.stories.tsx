import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';

const meta = {
  title: 'Components/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Container component maps to the div tag in Emmet abbreviations. It is a passthrough wrapper that accepts any div props and merges className with Tailwind.',
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Container content',
  },
};

export const WithClassName: Story = {
  args: {
    className: 'bg-gray-100 p-6 rounded-lg',
    children: <p>This container has custom Tailwind styling applied.</p>,
  },
};

export const AsLayoutWrapper: Story = {
  args: {
    className: 'flex gap-4 p-4 bg-slate-50 rounded-md',
    children: (
      <>
        <div className="flex-1 bg-white p-3 rounded border border-slate-200">Column 1</div>
        <div className="flex-1 bg-white p-3 rounded border border-slate-200">Column 2</div>
        <div className="flex-1 bg-white p-3 rounded border border-slate-200">Column 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Container used as a layout wrapper with Tailwind flex utilities.',
      },
    },
  },
};
