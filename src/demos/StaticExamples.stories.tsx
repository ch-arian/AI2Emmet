import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmmetRenderer } from '../components/EmmetRenderer/EmmetRenderer';

const meta = {
  title: 'Examples/Static Examples',
  component: EmmetRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Real-world examples showing how Emmet abbreviations transform into fully rendered React UI. Each example demonstrates a common UI pattern, displaying the compact Emmet input alongside its rendered output.',
      },
    },
  },
} satisfies Meta<typeof EmmetRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Dashboard card with heading, welcome message, and action button.
 * Demonstrates basic card layout with interactive element.
 */
export const DashboardCard: Story = {
  args: {
    emmet: 'div.card>h1{Dashboard}+p{Welcome to your dashboard}+button.primary[data-action="refresh"]{Refresh Data}',
  },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Emmet Input
        </h3>
        <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
          <code>{args.emmet}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Rendered Output
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
        story: 'A dashboard card component built from a single Emmet string. Shows how class names (`.card`, `.primary`), text content (`{Dashboard}`), and data attributes (`data-action="refresh"`) combine to create an interactive card.',
      },
    },
  },
};

/**
 * User profile card displaying user information.
 * Demonstrates nested content structure with multiple paragraphs.
 */
export const UserProfile: Story = {
  args: {
    emmet: 'div.card>h2{User Profile}+div>p{Name: Alice}+p{Role: Developer}+p{Status: Active}',
  },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Emmet Input
        </h3>
        <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
          <code>{args.emmet}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Rendered Output
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
        story: 'A user profile display with structured data. The nested `div>p+p+p` pattern creates a container with multiple sibling paragraphs, demonstrating how Emmet handles content hierarchy.',
      },
    },
  },
};

/**
 * Navigation menu with multiple links.
 * Demonstrates list-based navigation structure.
 */
export const NavigationMenu: Story = {
  args: {
    emmet: 'nav>ul>li>a[href="#home"]{Home}+li>a[href="#about"]{About}+li>a[href="#contact"]{Contact}',
  },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Emmet Input
        </h3>
        <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
          <code>{args.emmet}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Rendered Output
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
        story: 'A navigation menu demonstrating semantic HTML structure. The `nav>ul>li>a` pattern creates proper list-based navigation with anchor links, showing how Emmet handles attributes like `href`.',
      },
    },
  },
};

/**
 * Alert banner with warning message and action button.
 * Demonstrates alert component with multiple content types.
 */
export const AlertBanner: Story = {
  args: {
    emmet: 'div.alert>h3{Warning}+p{Your session will expire in 5 minutes}+button.secondary[data-action="extend"]{Extend Session}',
  },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Emmet Input
        </h3>
        <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
          <code>{args.emmet}</code>
        </pre>
      </div>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
          Rendered Output
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
        story: 'An alert banner combining heading, message text, and action button. Demonstrates how different element types (h3, p, button) work together in a single Emmet string to create a complete alert component.',
      },
    },
  },
};
