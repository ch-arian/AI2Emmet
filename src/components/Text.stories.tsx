import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading, Paragraph, Span } from './Text';

const meta = {
  title: 'Components/Text',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'This file documents the Heading, Paragraph, and Span text components. These components map to h1, p, and span tags in Emmet abbreviations.',
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadingDefault: Story = {
  render: () => <Heading>Page Title</Heading>,
};

export const HeadingWithClass: Story = {
  render: () => <Heading className="text-4xl text-blue-600">Custom Heading</Heading>,
};

export const ParagraphDefault: Story = {
  render: () => (
    <Paragraph>
      This is a paragraph with default styling including relaxed line height and bottom margin.
    </Paragraph>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Paragraph component with default styles.',
      },
    },
  },
};

export const ParagraphWithClass: Story = {
  render: () => (
    <Paragraph className="text-lg text-slate-500">Custom styled paragraph.</Paragraph>
  ),
};

export const SpanDefault: Story = {
  render: () => <Span>Inline text</Span>,
  parameters: {
    docs: {
      description: {
        story: 'Span component for inline text.',
      },
    },
  },
};

export const SpanBold: Story = {
  render: () => <Span className="font-bold text-red-600">Bold colored span</Span>,
};
