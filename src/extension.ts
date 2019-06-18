import {StatusBarItem, StatusBarAlignment, window, commands, ExtensionContext, Disposable} from 'vscode';

export function activate({subscriptions}: ExtensionContext) {

	// Print to console successfull activation of extension
	console.log('Congratulations, your extension "sumnum" is now active!');

	const commandId = "sample.showSelectionCount";

	let wordCounter = new WordCounter(commandId);
	let wordCounterController = new WordCounterController(wordCounter);
	subscriptions.push(wordCounter);
	subscriptions.push(wordCounterController);


	subscriptions.push(commands.registerCommand(commandId, () => {
		let n = wordCounter.updateWordCount();
		window.showInformationMessage(`Yeah, ${n} number(s) selected`);
	}));

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	window.showInformationMessage('Hello World!');
	// });

}


class WordCounter {
	private statusBar: StatusBarItem;


	constructor(commandId: string) {
		this.statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
		this.statusBar.command = commandId;
	}

	public updateWordCount() {

		// Get the current text editor
		let editor = window.activeTextEditor;
		// Hide status bar if not using text editor
		if (!editor) {
			this.statusBar.hide();
			return;
		}

		// Retrieve text
		let selection = editor.selection;
		let text = editor.document.getText(selection);

		let wordCount = this.extractWordCount(text);

		this.statusBar.text = `Sum: ${wordCount}`;
        this.statusBar.show();

	}

	public extractWordCount(text: string) {
		return 100;
	}

	public dispose() {
		this.statusBar.dispose();
	}
}



class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // update the counter for the current file
        this._wordCounter.updateWordCount();

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }
}