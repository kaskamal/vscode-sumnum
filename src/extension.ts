import {StatusBarItem, StatusBarAlignment, window, commands, ExtensionContext, Disposable} from 'vscode';


// regex string that extracts list of all numbers present in a string
const NUMERIC_NUMBERS = "/[+-]?\d+(?:\.\d+)?/g";


export function activate({subscriptions}: ExtensionContext) {

	// Print to console successfull activation of extension
	console.log('Congratulations, your extension "sumnum" is now active!');

	const commandId = "sample.showSelectionCount";

	let wordCounter = new WordCounter(commandId);
	let wordCounterController = new WordCounterController(wordCounter);
	subscriptions.push(wordCounter);
	subscriptions.push(wordCounterController);


	subscriptions.push(commands.registerCommand(commandId, () => {
		let n = wordCounter.wordCount;
		window.showInformationMessage(`Total count: ${n}`);
	}));

	
	subscriptions.push(commands.registerCommand("extension.sumTotal", () => {
		let n = wordCounter.wordCount;
		window.showInformationMessage(`Total count: ${n}`);
	}));
	
	
}


class WordCounter {
	private statusBar: StatusBarItem;
	private _wordCount: number = 0;

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

		this.extractWordCount(text);

		this.statusBar.text = `Sum: ${this._wordCount}`;
        this.statusBar.show();

	}

	public extractWordCount(text: string) {
		const lines = text.trim().split("\n");


		const numList = lines.map((line) => {
			const allNumsS = line.match(NUMERIC_NUMBERS);
			console.log(line);

			if (allNumsS && allNumsS.length > 0) {	
				// Parse all numbers to float
				const allNumsN = allNumsS.map((numS) => {
					return +(numS);
				});
				
				// Return the sum of all numbers in a line
				return allNumsN.reduce((prev, curr) => {
					return prev + curr;
				});
			} else {
				return 0;
			}
		});


		return numList.reduce((prev, curr) => {
			return prev + curr;
		});
	}

	get wordCount(): number {
		return this._wordCount;
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