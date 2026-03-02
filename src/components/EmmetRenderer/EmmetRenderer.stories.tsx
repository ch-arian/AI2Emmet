import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmmetRenderer } from './EmmetRenderer';
import { ErrorFallback } from './ErrorFallback';

const meta = {
  title: 'Components/EmmetRenderer',
  component: EmmetRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Renders React components from Emmet abbreviations. The core component of the emmet-ui library, transforming compact Emmet strings into interactive React component trees with security sanitization.',
      },
    },
  },
  argTypes: {
    emmet: {
      control: 'text',
      description: 'Emmet abbreviation string to render',
    },
    onAction: {
      action: 'onAction',
      description: 'Callback fired when a component with data-action is clicked',
    },
    className: {
      control: 'text',
      description: 'CSS class applied to the wrapper div',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading skeleton when true',
    },
  },
} satisfies Meta<typeof EmmetRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground for experimenting with Emmet abbreviations.
 * Edit the emmet string in the Controls panel to see live updates.
 */
export const Playground: Story = {
  args: {
    emmet: 'div.card>h2{Hello World}+p{Rendered from Emmet abbreviation}',
  },
};

/**
 * Demonstrates the Emmet-to-React transformation pipeline.
 * Shows the input Emmet string alongside the rendered React output.
 */
export const TransformationDemo: Story = {
  args: {
    emmet: 'div.card>h1{Dashboard}+p{Welcome to your dashboard}+button.primary[data-action="refresh"]{Refresh Data}',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Input (Emmet)
        </h3>
        <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
          <code>{args.emmet}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Output (React)
        </h3>
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}>
          <EmmetRenderer {...args} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The EmmetRenderer transforms compact Emmet abbreviations into React elements. This example shows how a single Emmet string expands into a card with heading, paragraph, and interactive button.',
      },
    },
  },
};

/**
 * Demonstrates the action handling system.
 * Click any button to see the action logged in the Actions panel below.
 */
export const WithActions: Story = {
  args: {
    emmet: 'div>button.primary[data-action="save"]{Save}+button.secondary[data-action="cancel"]{Cancel}+button.danger[data-action="delete"]{Delete}',
  },
  parameters: {
    docs: {
      description: {
        story: 'Components with `data-action` attributes trigger the `onAction` callback when clicked. This enables event handling without writing explicit onClick handlers. The action name is extracted from the data-action attribute value.',
      },
    },
  },
};

/**
 * Shows the loading skeleton state.
 * Useful when waiting for LLM-generated Emmet strings.
 */
export const LoadingState: Story = {
  args: {
    emmet: undefined,
    isLoading: true,
  },
};

/**
 * Shows the error fallback UI when parsing fails.
 * In development mode, displays full error details. In production, shows a generic error message.
 */
export const ErrorState: Story = {
  args: {
    emmet: undefined,
  },
  render: () => (
    <ErrorFallback
      error={new Error('Invalid Emmet syntax: unexpected token "{{{"')}
      onRetry={() => console.log('Retry clicked')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'When the Emmet parser encounters invalid syntax, EmmetRenderer displays an error fallback with a retry button. Error details are shown in development but hidden in production for security.',
      },
    },
  },
};

/**
 * Demonstrates complex nested component hierarchies.
 * Shows that deep nesting and multiple sibling elements work correctly.
 */
export const NestedComponents: Story = {
  args: {
    emmet: 'div.card>h1{Profile}+div>p{Name: Alice}+p{Role: Developer}+button.primary[data-action="edit"]{Edit Profile}',
  },
};
