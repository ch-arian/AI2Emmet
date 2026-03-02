import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from './Button';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Card Title</h2>
        <p style={{ color: '#64748b' }}>Card content goes here.</p>
      </>
    ),
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Welcome</h2>
        <p style={{ marginBottom: '1rem', color: '#475569' }}>
          This card contains rich content including headings, paragraphs, and interactive elements.
        </p>
        <Button variant="primary">Learn More</Button>
      </>
    ),
  },
};

export const WithTailwindClasses: Story = {
  args: {
    className: 'bg-blue-50 border-blue-200',
    children: <p>This card uses custom Tailwind classes to override the default styling.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates Tailwind class override via className prop.',
      },
    },
  },
};
