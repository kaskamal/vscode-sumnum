import {StatusBarItem, StatusBarAlignment, window, commands, ExtensionContext, Disposable, env, workspace} from 'vscode';
import * as results_viewer from "./results_viewer";


// regex string that extracts list of all numbers present in a string
const NUMERIC_NUMBERS = /[+-]?\d+(?:\.\d+)?/g;


export function activate({subscriptions}: ExtensionContext) {

	// Print to console successfull activation of extension
	console.log('Congratulations, your extension "sumnum" is now active!');

	const commandId = "sample.showSelectionCount";
	const palatteCommands = ["sumTotal", "sumAvg", "sumMax", "sumMin", "sumCol"];

	let wordCounter = new WordCounter(commandId);
	let wordCounterController = new WordCounterController(wordCounter);
	subscriptions.push(wordCounter);
	subscriptions.push(wordCounterController);

	palatteCommands.forEach((element) => {
		let command = "extension.".concat(element);
		subscriptions.push(commands.registerCommand(command, () => {
			let n = wordCounter.getCount(element);
			window.showInformationMessage(`Total count: ${n}`);
			results_viewer.openResultsFile();
		}));
	});
	
	
	
	
}


class WordCounter {
	private statusBar: StatusBarItem;
	private _wordCount: {[key: string]: number} = {
		sumTotal: 0,
		sumAvg:   0,
		sumMax:   0,
		sumMin:   0,
		sumCol:   0
	};

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

		this.updateColInfo(lines);


		const numList = lines.map((line) => {
			const allNumsS = line.match(NUMERIC_NUMBERS);
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



		this._wordCount.sumTotal =  numList.reduce((prev, curr) => {
			return prev + curr;
		});
		this._wordCount.sumMax = Math.max(... numList);
		this._wordCount.sumMin = Math.min(... numList);
		this._wordCount.sumAvg = this._wordCount.sumTotal / numList.length;
	}

	public updateColInfo(lines: string[]) {
		let colNumList: number[] = [];
		lines.forEach((line) => {
			const allNumsS = line.match(NUMERIC_NUMBERS);
			if (allNumsS) {
				colNumList.push(+(allNumsS[0]));
			}
		})

		this._wordCount.sumCol = colNumList.reduce((prev, curr) => {
			return prev + curr;
		})
	}

	public getCount(type: string): number {
		return this._wordCount[type];
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
		// this._wordCounter.updateWordCount();

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