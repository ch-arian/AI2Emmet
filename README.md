# emmet-ui

Render React UI from LLM-generated Emmet abbreviations.

## Installation

```bash
npm install emmet-ui
# Peer dependencies
npm install react react-dom
```

## Quick Start

```tsx
import { useState } from 'react'
import { EmmetRenderer } from 'emmet-ui'

function App() {
  const [emmet, setEmmet] = useState('card.p-6>h1{Welcome}+p{Get started}+btn[data-action=start]{Begin}')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleAction = async (action: string, payload?: unknown) => {
    console.log('Action:', action, 'Payload:', payload)

    // Example: Call your LLM API here
    setIsLoading(true)
    try {
      const newEmmet = await callYourLLM(action)
      setEmmet(newEmmet)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <EmmetRenderer
      emmet={emmet}
      onAction={handleAction}
      isLoading={isLoading}
      onError={setError}
    />
  )
}
```

## Features

- Emmet abbreviations expand to React components
- Built-in security via DOMPurify sanitization
- Action system with data-action attributes
- Default component set (btn, card, h1, p, span, div)
- Custom component registry support
- TypeScript types included

## API Reference

### EmmetRenderer

Main component for rendering Emmet abbreviations.

```tsx
import { EmmetRenderer } from 'emmet-ui'

<EmmetRenderer
  emmet="card>h1{Hello}+btn[data-action=click]{Click}"
  onAction={(action, payload, event) => { /* handle action */ }}
  registry={customRegistry}  // optional
  className="my-wrapper"     // optional
  isLoading={false}          // optional
  onError={(error) => { }}   // optional
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| emmet | string \| undefined | Yes | Emmet abbreviation to render |
| onAction | (action: string, payload?: unknown, event?: MouseEvent) => void | No | Action callback when data-action clicked |
| registry | ComponentRegistry | No | Custom component registry |
| className | string | No | CSS class for wrapper div |
| isLoading | boolean | No | Show loading skeleton |
| onError | (error: Error) => void | No | Error callback |

### useEmmetRenderer

Hook for headless usage.

```tsx
import { useEmmetRenderer } from 'emmet-ui'

function CustomRenderer({ emmet }: { emmet: string }) {
  const { element, error, retry } = useEmmetRenderer({
    emmet,
    onAction: (action) => console.log(action)
  })

  if (error) return <button onClick={retry}>Retry</button>
  return <>{element}</>
}
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| emmet | string | Emmet abbreviation |
| onAction | ActionHandler | Action callback |
| registry | ComponentRegistry | Custom registry |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| element | ReactElement \| null | Rendered element |
| error | Error \| null | Parse/render error |
| retry | () => void | Retry function |

### ComponentRegistry

Create custom component mappings.

```tsx
import { ComponentRegistry, createDefaultRegistry } from 'emmet-ui'

// Extend default registry
const registry = createDefaultRegistry()
registry.register('alert', MyAlertComponent)

// Or create from scratch
const custom = new ComponentRegistry()
custom.register('card', MyCard)
custom.register('btn', MyButton)
```

### Default Components

| Tag | Component | Description |
|-----|-----------|-------------|
| btn | Button | Button with variants (.primary, .secondary, .danger) |
| card | Card | Container with padding and shadow |
| h1 | Heading | Heading text |
| p | Paragraph | Body text |
| span | Span | Inline text |
| div | Container | Generic container |

## LLM Integration

### System Prompts

Use the provided system prompts to constrain LLM output to valid Emmet:

- `prompts/claude.md` - Optimized for Claude (structured sections)
- `prompts/gpt4.md` - Optimized for GPT-4 (concise rules)

### OpenAI Example

```tsx
import OpenAI from 'openai'
import { EmmetRenderer } from 'emmet-ui'

// Load system prompt (or inline it)
const SYSTEM_PROMPT = `... see prompts/gpt4.md ...`

async function generateUI(userMessage: string): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ]
  })

  return response.choices[0].message.content || ''
}

function App() {
  const [emmet, setEmmet] = useState('')

  const handleAction = async (action: string) => {
    const newEmmet = await generateUI(`User clicked: ${action}`)
    setEmmet(newEmmet)
  }

  return <EmmetRenderer emmet={emmet} onAction={handleAction} />
}
```

### Conversation Loop Pattern

For multi-turn conversations, maintain message history:

```tsx
const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])

const handleAction = async (action: string, payload?: unknown) => {
  const userMessage = payload
    ? `Action: ${action}, Data: ${JSON.stringify(payload)}`
    : `Action: ${action}`

  const newMessages = [...messages, { role: 'user', content: userMessage }]

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newMessages]
  })

  const assistantMessage = response.choices[0].message.content
  setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
  setEmmet(assistantMessage)
}
```

## Emmet Syntax Reference

### Basic Structure

```
tag.class1.class2{Text Content}
parent>child
sibling+sibling
element*count
element[attribute=value]
```

### Examples

| Emmet | Result |
|-------|--------|
| `btn{Click}` | Button with text |
| `btn.primary{Submit}` | Primary styled button |
| `btn[data-action=save]{Save}` | Button with action |
| `card>h1{Title}+p{Body}` | Card with heading and paragraph |
| `div.flex.gap-4>btn*3` | Flex container with 3 buttons |

## Error Handling

EmmetRenderer provides built-in error handling:

```tsx
<EmmetRenderer
  emmet={emmet}
  onAction={handleAction}
  onError={(error) => {
    console.error('Render error:', error)
    // Log to your error tracking service
  }}
/>
```

Errors display a user-friendly message with retry button in development.

## License

MIT
