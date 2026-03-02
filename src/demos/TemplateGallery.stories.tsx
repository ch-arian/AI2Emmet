import type { Meta, StoryObj } from '@storybook/react';
import { EmmetRenderer } from '../components/EmmetRenderer/EmmetRenderer';

/**
 * Template Gallery Stories
 *
 * A collection of ready-to-use Emmet patterns for common UI layouts.
 * Each story provides a copy-paste Emmet string for quick prototyping.
 */
const meta = {
  title: 'Examples/Template Gallery',
  component: EmmetRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A browsable gallery of ready-to-use Emmet patterns for common UI layouts. Each template shows the rendered output with a collapsible section containing the copy-paste Emmet string. Organized by pattern type: Cards, Lists, and Layouts.'
      }
    }
  }
} satisfies Meta<typeof EmmetRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Product Card Template
 *
 * A standard product card with name, description, price, and call-to-action button.
 * Perfect for e-commerce listings, product catalogs, or promotional sections.
 */
export const ProductCard: Story = {
  args: {
    emmet: 'div.card>h3{Product Name}+p{A high-quality product for everyday use.}+span{$29.99}+button.primary[data-action="add-to-cart"]{Add to Cart}'
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <EmmetRenderer {...args} />
      </div>
      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
          Copy Emmet String
        </summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          overflow: 'auto'
        }}>
          <code>{args.emmet}</code>
        </pre>
      </details>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Product card pattern with hierarchical structure: heading, description text, price span, and primary action button. Uses `.card` class for styling and `data-action` attribute for action handling.'
      }
    }
  }
};

/**
 * Profile Card Template
 *
 * A user profile card displaying name, role, and social media links.
 * Ideal for team pages, author bylines, or contact sections.
 */
export const ProfileCard: Story = {
  args: {
    emmet: 'div.card>h2{Alice Johnson}+p{Senior Developer}+div>span{GitHub: @alice}+span{Twitter: @alicej}'
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <EmmetRenderer {...args} />
      </div>
      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
          Copy Emmet String
        </summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          overflow: 'auto'
        }}>
          <code>{args.emmet}</code>
        </pre>
      </details>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Profile card pattern with name heading, role description, and grouped social media links. The nested `div>span+span` creates a container for horizontal link display.'
      }
    }
  }
};

/**
 * Stats Card Template
 *
 * A statistics card showing a metric with value and change indicator.
 * Perfect for dashboards, analytics panels, or KPI displays.
 */
export const StatsCard: Story = {
  args: {
    emmet: 'div.card>h3{Revenue}+p{$12,345}+span{+15% from last month}'
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <EmmetRenderer {...args} />
      </div>
      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
          Copy Emmet String
        </summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          overflow: 'auto'
        }}>
          <code>{args.emmet}</code>
        </pre>
      </details>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Stats card pattern with metric label, large value display, and trend indicator. Simple three-element structure optimized for quick scanning of key numbers.'
      }
    }
  }
};

/**
 * Task List Template
 *
 * A simple task list with header and multiple list items.
 * Ideal for to-do lists, checklists, or step-by-step instructions.
 */
export const TaskList: Story = {
  args: {
    emmet: 'div>h2{My Tasks}+ul>li{Complete project proposal}+li{Review pull requests}+li{Update documentation}+li{Deploy to production}'
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <EmmetRenderer {...args} />
      </div>
      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
          Copy Emmet String
        </summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          overflow: 'auto'
        }}>
          <code>{args.emmet}</code>
        </pre>
      </details>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Task list pattern with heading and unordered list. The `ul>li+li+li+li` syntax efficiently creates multiple list items. Easily extend by adding more `+li{text}` elements.'
      }
    }
  }
};

/**
 * Notification List Template
 *
 * A notification feed with header and individual notification cards.
 * Perfect for activity streams, updates feeds, or alert panels.
 */
export const NotificationList: Story = {
  args: {
    emmet: 'div>h2{Notifications}+div.card>p{New comment on your post}+div.card>p{Alice mentioned you in a review}+div.card>p{Build succeeded: main branch}'
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <EmmetRenderer {...args} />
      </div>
      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
          Copy Emmet String
        </summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          overflow: 'auto'
        }}>
          <code>{args.emmet}</code>
        </pre>
      </details>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Notification list pattern with heading and multiple card-wrapped notifications. Each notification is a separate `.card>p` structure for independent styling and interaction.'
      }
    }
  }
};

/**
 * Hero Section Template
 *
 * A landing page hero section with headline, description, and dual action buttons.
 * Ideal for marketing pages, product launches, or feature highlights.
 */
export const HeroSection: Story = {
  args: {
    emmet: 'div>h1{Build UIs with Emmet}+p{Transform compact abbreviations into React components with type safety and security.}+div>button.primary[data-action="get-started"]{Get Started}+button.secondary[data-action="learn-more"]{Learn More}'
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <EmmetRenderer {...args} />
      </div>
      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
          Copy Emmet String
        </summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          overflow: 'auto'
        }}>
          <code>{args.emmet}</code>
        </pre>
      </details>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Hero section pattern with large heading, descriptive paragraph, and button group. The nested `div>button+button` creates a container for side-by-side call-to-action buttons with different styles.'
      }
    }
  }
};

/**
 * Page Layout Template
 *
 * A complete page structure with header, navigation, main content, and footer.
 * Perfect for full-page mockups, documentation layouts, or application shells.
 */
export const PageLayout: Story = {
  args: {
    emmet: 'div>header>h1{My App}+nav>a[href="#home"]{Home}+a[href="#about"]{About}+main>h2{Welcome}+p{This is the main content area.}+footer>p{Copyright 2026}'
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <EmmetRenderer {...args} />
      </div>
      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>
          Copy Emmet String
        </summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          overflow: 'auto'
        }}>
          <code>{args.emmet}</code>
        </pre>
      </details>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete page layout pattern using semantic HTML5 elements (`header`, `nav`, `main`, `footer`). Demonstrates complex sibling relationships and deep nesting in a single Emmet abbreviation.'
      }
    }
  }
};
