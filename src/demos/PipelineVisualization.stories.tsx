import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmmetRenderer } from '../components/EmmetRenderer/EmmetRenderer';
import { expandEmmet, sanitizeHTML } from '../pipeline';
import type { EmmetString } from '../types';

const meta = {
  title: 'Examples/Pipeline Visualization',
  component: EmmetRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Visualizes the complete Emmet-to-React transformation pipeline, showing each stage: Emmet input → Expanded HTML → Sanitized HTML → React elements. This demonstrates the three-stage process that ensures both functionality and security.',
      },
    },
  },
} satisfies Meta<typeof EmmetRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Shows all transformation stages for a dashboard card.
 * Demonstrates the complete pipeline from Emmet abbreviation to React elements.
 */
export const TransformationSteps: Story = {
  args: {
    emmet: 'div.card>h1{Dashboard}+p{Welcome}+button.primary[data-action="refresh"]{Refresh}',
  },
  render: (args) => {
    try {
      // Stage 1: Emmet input (already have in args.emmet)
      if (!args.emmet) {
        throw new Error('Emmet input is required');
      }

      // Stage 2: Expand Emmet to HTML
      const html = expandEmmet(args.emmet as EmmetString);

      // Stage 3: Sanitize HTML (XSS protection)
      const safeHtml = sanitizeHTML(html);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Stage 1 */}
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              1. Emmet Input
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{args.emmet}</code>
            </pre>
          </div>

          {/* Arrow indicator */}
          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          {/* Stage 2 */}
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              2. Expanded HTML
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{html}</code>
            </pre>
          </div>

          {/* Arrow indicator */}
          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          {/* Stage 3 */}
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              3. Sanitized HTML
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{safeHtml}</code>
            </pre>
          </div>

          {/* Arrow indicator */}
          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          {/* Stage 4 */}
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              4. React Elements
            </h3>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}>
              <EmmetRenderer {...args} />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div style={{ color: '#dc2626', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem' }}>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete pipeline visualization showing each transformation stage. The Emmet abbreviation expands to HTML, gets sanitized for security (removing dangerous content), and finally hydrates into interactive React elements.',
      },
    },
  },
};

/**
 * Shows pipeline transformation for a minimal example.
 * Demonstrates the simplest case to understand the core process.
 */
export const SimpleTransformation: Story = {
  args: {
    emmet: 'h1{Hello World}',
  },
  render: (args) => {
    try {
      if (!args.emmet) {
        throw new Error('Emmet input is required');
      }
      const html = expandEmmet(args.emmet as EmmetString);
      const safeHtml = sanitizeHTML(html);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              1. Emmet Input
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{args.emmet}</code>
            </pre>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              2. Expanded HTML
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{html}</code>
            </pre>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              3. Sanitized HTML
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{safeHtml}</code>
            </pre>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              4. React Elements
            </h3>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}>
              <EmmetRenderer {...args} />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div style={{ color: '#dc2626', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem' }}>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal example showing the pipeline with the simplest possible input. Even a basic heading goes through all three transformation stages to ensure consistent processing.',
      },
    },
  },
};

/**
 * Shows pipeline handling of complex nested structures.
 * Demonstrates that deeply nested Emmet abbreviations work correctly through all stages.
 */
export const ComplexNesting: Story = {
  args: {
    emmet: 'div.card>header>h1{Title}+p.subtitle{Subtitle}+main>p{Content paragraph 1}+p{Content paragraph 2}+footer>button.primary[data-action="save"]{Save}+button.secondary[data-action="cancel"]{Cancel}',
  },
  render: (args) => {
    try {
      if (!args.emmet) {
        throw new Error('Emmet input is required');
      }
      const html = expandEmmet(args.emmet as EmmetString);
      const safeHtml = sanitizeHTML(html);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              1. Emmet Input
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{args.emmet}</code>
            </pre>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              2. Expanded HTML
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{html}</code>
            </pre>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              3. Sanitized HTML
            </h3>
            <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', overflow: 'auto' }}>
              <code>{safeHtml}</code>
            </pre>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#94a3b8' }}>
            ↓
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
              4. React Elements
            </h3>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}>
              <EmmetRenderer {...args} />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div style={{ color: '#dc2626', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem' }}>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex nested structure demonstrating how the pipeline handles deep hierarchies. The semantic HTML structure (header, main, footer) with multiple nested elements shows the robustness of each transformation stage.',
      },
    },
  },
};
