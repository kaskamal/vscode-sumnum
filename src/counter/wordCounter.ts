import {StatusBarItem, StatusBarAlignment, window} from "vscode";


// regex string that extracts list of all numbers present in a string
const NUMERIC_NUMBERS = /[+-]?\d+(?:\.\d+)?/g;

export class WordCounter {
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