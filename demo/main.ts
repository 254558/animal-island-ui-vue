import { createApp } from 'vue';
import App from './App.vue';
import cursorIcon from '../src/components/Cursor/cursor-icon.png';
import faviconIcon from './img/animal_icon.svg';

document.body.style.margin = '0';

const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Zen+Maru+Gothic:wght@400;500;700&display=swap';
document.head.appendChild(fontLink);

const globalStyle = document.createElement('style');
globalStyle.textContent = `
  *::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; font-family: Nunito, 'Zen Maru Gothic', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif !important; }
  body[data-demo-cursor='animal'] *,
  body[data-demo-cursor='animal'] *::before,
  body[data-demo-cursor='animal'] *::after {
    cursor: url('${cursorIcon}') 4 0, auto !important;
  }
`;
document.head.appendChild(globalStyle);
document.body.dataset.demoCursor = 'animal';

const favicon =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
    document.createElement('link');
favicon.rel = 'icon';
favicon.href = faviconIcon;
document.head.appendChild(favicon);

createApp(App).mount('#app');
