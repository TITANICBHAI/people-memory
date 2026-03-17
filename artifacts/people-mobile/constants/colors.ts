const C = {
  bg: '#1A1A1A',
  panel: '#242424',
  panelHigh: '#2D2D30',
  header: '#252526',
  border: '#3E3E42',
  borderLight: '#4A4A4F',
  accent: '#007ACC',
  accentDim: '#005F99',
  accentGlow: '#1E9EFF',
  text: '#D4D4D4',
  textBright: '#FFFFFF',
  textMuted: '#888888',
  textDim: '#555555',
  green: '#4EC94E',
  yellow: '#E5C07B',
  red: '#F44747',
  tag: {
    friend: { bg: '#1A3A4A', text: '#56B6C2' },
    work: { bg: '#3A2A1A', text: '#E5C07B' },
    family: { bg: '#1A3A1A', text: '#4EC94E' },
    online: { bg: '#2A1A3A', text: '#C678DD' },
    custom: { bg: '#2A2A2A', text: '#888888' },
  },
  avatarPalette: [
    { bg: '#1A3A5C', text: '#5BB8F5' },
    { bg: '#2A1A4A', text: '#B07FEA' },
    { bg: '#1A3A28', text: '#52C97A' },
    { bg: '#3A1A1A', text: '#F07070' },
    { bg: '#2A2A1A', text: '#D4A74A' },
    { bg: '#1A3A38', text: '#4DC9C0' },
    { bg: '#3A1A30', text: '#E87BB5' },
    { bg: '#1E2A3A', text: '#6B9FD4' },
    { bg: '#1A2A1A', text: '#80C86A' },
    { bg: '#2E1A10', text: '#E8945A' },
    { bg: '#1A1A3A', text: '#8888E8' },
    { bg: '#2A3A1A', text: '#A8D46A' },
  ],
};

export function avatarColorForName(name: string): { bg: string; text: string } {
  if (!name) return C.avatarPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % C.avatarPalette.length;
  return C.avatarPalette[idx];
}

export default C;
