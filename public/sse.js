// Shared by the browser transport and the upstream Responses API client.
export async function* readSse(body) {
  if (!body) throw new Error('Missing event stream');
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let event = 'message';
  let data = [];
  try {
    while (true) {
      const {value, done} = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, {stream: true});
      let match;
      while ((match = /\r\n|\r|\n/.exec(buffer))) {
        // A CRLF pair can itself span two network chunks.
        if (!done && match[0] === '\r' && match.index === buffer.length - 1) break;
        const line = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        if (!line) {
          if (data.length) yield {event, data: data.join('\n')};
          event = 'message';
          data = [];
        } else if (!line.startsWith(':')) {
          const colon = line.indexOf(':');
          const field = colon < 0 ? line : line.slice(0, colon);
          const value = colon < 0 ? '' : line.slice(colon + 1).replace(/^ /, '');
          if (field === 'event') event = value;
          if (field === 'data') data.push(value);
        }
      }
      if (done) return; // Incomplete events are not dispatched.
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
