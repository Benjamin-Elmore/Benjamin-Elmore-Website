// A code window: title bar with the source file and language, numbered lines,
// and light syntax highlighting done at render time (no runtime library), so
// the pre-rendered HTML already carries the colors.

const CPP_KEYWORDS = new Set([
  'alignas', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'class', 'const', 'constexpr',
  'continue', 'default', 'delete', 'do', 'double', 'else', 'enum', 'explicit', 'extern', 'false',
  'float', 'for', 'friend', 'if', 'inline', 'int', 'long', 'namespace', 'new', 'noexcept',
  'nullptr', 'operator', 'override', 'private', 'protected', 'public', 'return', 'short',
  'signed', 'size_t', 'static', 'static_cast', 'struct', 'switch', 'template', 'this', 'throw',
  'true', 'try', 'typedef', 'typename', 'uint8_t', 'uint16_t', 'uint32_t', 'unsigned', 'using',
  'virtual', 'void', 'volatile', 'while',
]);

const CPP_TOKEN = /(\/\/.*$)|("(?:\\.|[^"\\])*")|(#\s*\w+)|(\b0x[0-9A-Fa-f]+\b|\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/gm;

function highlightCpp(line) {
  const parts = [];
  let m;
  CPP_TOKEN.lastIndex = 0;
  while ((m = CPP_TOKEN.exec(line)) !== null) {
    const [text, comment, str, directive, num, word] = m;
    let cls = null;
    if (comment) cls = 'tok-comment';
    else if (str) cls = 'tok-string';
    else if (directive) cls = 'tok-keyword';
    else if (num) cls = 'tok-number';
    else if (word) {
      if (CPP_KEYWORDS.has(word)) cls = 'tok-keyword';
      else if (/^[A-Z]/.test(word)) cls = 'tok-type';
      else if (!word.startsWith('_') && line.slice(m.index + word.length).startsWith('(')) cls = 'tok-func';
    }
    parts.push(cls ? <span key={m.index} className={cls}>{text}</span> : text);
    if (text === '') break;
  }
  return parts;
}

export default function CodeWindow({ title, language, children, label }) {
  const lines = children.replace(/\n$/, '').split('\n');
  const isCpp = language === 'C++';
  return (
    <div className="code-window">
      <div className="code-window__bar">
        <span className="code-window__title">{title}</span>
        <span className="code-window__count" aria-hidden="true">{lines.length} LN</span>
        <span className="code-window__lang">{language}</span>
      </div>
      <pre className="code-window__body" tabIndex="0" role="region" aria-label={label || `${language} code: ${title}`}><code>{lines.map((line, i) => (
        <span className="code-line" key={i}><span className="code-line__no" aria-hidden="true">{i + 1}</span>{isCpp ? highlightCpp(line) : line}{'\n'}</span>
      ))}</code></pre>
    </div>
  );
}
