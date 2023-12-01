/// <reference types="@commercetools-frontend/application-config/client" />

import ReactDOM from 'react-dom';
import EntryPoint from './pages/entry-point';

function renderDom() {
  ReactDOM.render(<EntryPoint />, document.getElementById('app'));
}

renderDom();

export { renderDom };
