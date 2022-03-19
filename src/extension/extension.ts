import * as vscode from 'vscode';

export function flatten<T>(array: ReadonlyArray<T>[]): T[] {
    return Array.prototype.concat.apply([], array);
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('ray.connectToDashboard', async (arg: string | undefined) => {
        if (arg === undefined) {
            const selection = await vscode.window.showInputBox({
                title: 'Enter a dashboard URL',
                placeHolder: 'E.g. http://127.0.0.1:8787'
            });
    
            if (!selection) {
				return;
			}
            arg = selection;
        }

		const panel = vscode.window.createWebviewPanel(
			'vscode-ray-dashboard',
			'Ray',
			vscode.ViewColumn.Beside,
			{ retainContextWhenHidden: true, enableScripts: true }
		);

		const uri = await vscode.env.asExternalUri(vscode.Uri.parse(arg));
		panel.webview.html = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline'; frame-src ${uri} http: https:;" >
			<title>Ray</title>
		</head>
		<body>
			<script type="text/javascript">
				function resizeFrame() {
					var f = window.document.getElementById('vscode-ray-iframe');
					if (f) {
						f.style.height = window.innerHeight;
					}
				}
				window.onload = resizeFrame;
				window.addEventListener('resize', resizeFrame);
			</script>
			<iframe
				id="vscode-ray-iframe"
				src="${uri}"
				border="0px"
				frameborder="0px"
				width="100%"
				height="1000px"
				style="position: absolute; left: 0;"
				sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock"
				allowfullscreen
			/>
		</body>
		</html>`;
		panel.reveal();
	}));
}

// This method is called when your extension is deactivated
export function deactivate() { }
