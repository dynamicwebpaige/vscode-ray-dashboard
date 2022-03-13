/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

// We've set up this sample using CSS modules, which lets you import class
// names into JavaScript: https://github.com/css-modules/css-modules
// You can configure or change this in the webpack.config.js file.
import * as style from './style.css';
import type { NotebookRendererApi } from 'vscode-notebook-renderer';
const { parse } = require('ansicolor')

interface IRenderInfo {
	container: HTMLElement;
	mimeType: string;
	data: any;
	notebookApi: NotebookRendererApi<unknown>;
}

// color codes from ansicolor
// const colorCodes      = [   'black',      'red',      'green',      'yellow',      'blue',      'magenta',      'cyan', 'lightGray', '', 'default']
//     , colorCodesLight = ['darkGray', 'lightRed', 'lightGreen', 'lightYellow', 'lightBlue', 'lightMagenta', 'lightCyan', 'white', '']

const nameMapping: { [key: string]: string } = {
	'black': '--vscode-terminal-ansiBlack',
	'red': '--vscode-terminal-ansiRed',
	'green': '--vscode-terminal-ansiGreen',
	'yellow': '--vscode-terminal-ansiYellow',
	'blue': '--vscode-terminal-ansiBlue',
	'magenta': '--vscode-terminal-ansiMagenta',
	'cyan': '--vscode-terminal-ansiCyan',
	'white': '--vscode-terminal-ansiWhite',
	'lightGray': '--vscode-terminal-ansiWhite',
	'lightBlack': '--vscode-terminal-ansiBrightBlack',
	'lightRed': '--vscode-terminal-ansiBrightRed',
	'lightGreen': '--vscode-terminal-ansiBrightGreen',
	'lightYellow': '--vscode-terminal-ansiBrightYellow',
	'lightBlue': '--vscode-terminal-ansiBrightBlue',
	'lightMagenta': '--vscode-terminal-ansiBrightMagenta',
	'lightCyan': '--vscode-terminal-ansiBrightCyan',
	'lightWhite': '--vscode-terminal-ansiBrightWhite'
};

function renderDaskShortcutTitle(divEl: HTMLElement, mimeType: string, data: any) {
  if (mimeType !== "text/html") {
    return;
  }

  const valueSpanEl = document.createElement('span');

  // Scrape the output for a matching Dask dashboard URL
  const matches = /<li><b>Dashboard: <\/b><a href='(.*)' target='_blank'>/gm.exec(data);
  if (matches && matches.length > 1) {
    const url = matches[1];
    const aEl = document.createElement('a');
    aEl.href = `command:vscode-dask.connectToDaskSession?\"${url}\"`;
    aEl.setAttribute('data-href', `command:vscode-dask.connectToDaskSession?\"${url}\"`);
    aEl.title = 'Open Dask Dashboard in VS Code';
    aEl.text = 'Open Dask Dashboard in VS Code';
    valueSpanEl.appendChild(aEl);
  }

  // Put the original HTML in here too
  const originalHtml = document.createElement('span');
  originalHtml.innerHTML = data;
  valueSpanEl.appendChild(originalHtml);
  divEl.appendChild(valueSpanEl);

  return data;
}

// This function is called to render your contents.
export function render({ container, mimeType, data }: IRenderInfo) {
	const divEl = document.createElement('div');
  renderDaskShortcutTitle(divEl, mimeType, data);
	container.appendChild(divEl);
}

if (module.hot) {
	module.hot.addDisposeHandler(() => {
		// In development, this will be called before the renderer is reloaded. You
		// can use this to clean up or stash any state.
	});
}