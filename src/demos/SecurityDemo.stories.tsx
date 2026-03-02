import type { Meta, StoryObj } from '@storybook/react';
import { sanitizeHTML } from '../pipeline';
import { EmmetRenderer } from '../components/EmmetRenderer/EmmetRenderer';

/**
 * Security Demo Stories
 *
 * Demonstrates how DOMPurify protects against XSS attacks within the Emmet-to-React pipeline.
 * Each story shows before/after comparisons of malicious HTML being sanitized.
 */
const meta = {
  title: 'Examples/Security Demo',
  component: EmmetRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Demonstrates DOMPurify\'s XSS protection within the Emmet-to-React pipeline. Each story shows before/after sanitization comparisons with color-coded panels to highlight dangerous vs. safe HTML.'
      }
    }
  }
} satisfies Meta<typeof EmmetRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Script Tag Removal
 *
 * Demonstrates that <script> tags are completely removed by DOMPurify,
 * preventing arbitrary JavaScript execution from user-supplied content.
 */
export const ScriptTagRemoval: Story = {
  args: {
    emmet: 'div{Safe content after sanitization}'
  },
  render: () => {
    const maliciousHtml = '<div>User input: <script>alert("XSS")</script></div>';
    const sanitized = sanitizeHTML(maliciousHtml);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* DANGEROUS - Left Panel (Red Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#dc2626', marginTop: 0 }}>DANGEROUS</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{maliciousHtml}</code>
          </pre>
          <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: 0 }}>
            Contains script tag -- XSS vulnerability
          </p>
        </div>

        {/* SAFE - Right Panel (Green Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#16a34a', marginTop: 0 }}>SAFE</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{sanitized}</code>
          </pre>
          <p style={{ color: '#16a34a', fontWeight: 600, marginBottom: 0 }}>
            Script tag removed by DOMPurify
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'XSS vector: `<script>` tags allow arbitrary JavaScript execution. DOMPurify completely removes these tags, making the content safe to render.'
      }
    }
  }
};

/**
 * Event Handler Stripping
 *
 * Demonstrates that inline event handler attributes (onerror, onclick, etc.)
 * are stripped by DOMPurify, preventing code injection through DOM events.
 */
export const EventHandlerStripping: Story = {
  args: {
    emmet: 'div{Safe content after sanitization}'
  },
  render: () => {
    const maliciousHtml = '<div><img src="x" onerror="alert(\'XSS\')" /><button onclick="stealData()">Click me</button></div>';
    const sanitized = sanitizeHTML(maliciousHtml);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* DANGEROUS - Left Panel (Red Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#dc2626', marginTop: 0 }}>DANGEROUS</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{maliciousHtml}</code>
          </pre>
          <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: 0 }}>
            Contains onerror and onclick handlers -- code injection risk
          </p>
        </div>

        {/* SAFE - Right Panel (Green Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#16a34a', marginTop: 0 }}>SAFE</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{sanitized}</code>
          </pre>
          <p style={{ color: '#16a34a', fontWeight: 600, marginBottom: 0 }}>
            Event handler attributes stripped by DOMPurify
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'XSS vector: Event handler attributes like `onerror`, `onclick`, `onload` allow code execution when events fire. DOMPurify strips all such attributes.'
      }
    }
  }
};

/**
 * Data URI Blocking
 *
 * Demonstrates that javascript: URIs and data: URIs with embedded scripts
 * are removed by DOMPurify, preventing code execution through hyperlinks and iframes.
 */
export const DataURIBlocking: Story = {
  args: {
    emmet: 'div{Safe content after sanitization}'
  },
  render: () => {
    const maliciousHtml = '<div><a href="javascript:alert(\'XSS\')">Click here</a><iframe src="data:text/html,<script>alert(1)</script>"></iframe></div>';
    const sanitized = sanitizeHTML(maliciousHtml);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* DANGEROUS - Left Panel (Red Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#dc2626', marginTop: 0 }}>DANGEROUS</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{maliciousHtml}</code>
          </pre>
          <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: 0 }}>
            Contains javascript: URI and data: iframe -- code execution risk
          </p>
        </div>

        {/* SAFE - Right Panel (Green Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#16a34a', marginTop: 0 }}>SAFE</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{sanitized}</code>
          </pre>
          <p style={{ color: '#16a34a', fontWeight: 600, marginBottom: 0 }}>
            Dangerous URIs and iframe removed by DOMPurify
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'XSS vector: `javascript:` URIs in links and `data:` URIs in iframes can execute arbitrary code. DOMPurify removes these dangerous elements and attributes.'
      }
    }
  }
};

/**
 * Safe Content Passthrough
 *
 * Demonstrates that legitimate, safe HTML passes through DOMPurify unchanged.
 * No content is lost when the input doesn't contain dangerous patterns.
 */
export const SafeContentPassthrough: Story = {
  args: {
    emmet: 'div{Safe content after sanitization}'
  },
  render: () => {
    const safeHtml = '<div class="card"><h2>Product Name</h2><p>A great product</p><button>Add to Cart</button></div>';
    const sanitized = sanitizeHTML(safeHtml);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Original - Left Panel (Neutral Blue Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#475569', marginTop: 0 }}>Original HTML</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{safeHtml}</code>
          </pre>
        </div>

        {/* After Sanitization - Right Panel (Neutral Blue Theme) */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ color: '#475569', marginTop: 0 }}>After Sanitization</h3>
          <pre style={{
            backgroundColor: '#fff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{sanitized}</code>
          </pre>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Safe HTML passes through DOMPurify unchanged. No content is lost when there are no dangerous patterns. This ensures legitimate use cases work without modification.'
      }
    }
  }
};
