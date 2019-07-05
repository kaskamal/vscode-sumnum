import {StatusBarItem, StatusBarAlignment, window} from "vscode";


// regex string that extracts list of all numbers present in a string
const NUMERIC_NUMBERS = /[+-]?\d+(?:\.\d+)?/g;

export class WordCounter {
	private statusBar: StatusBarItem;
	private _wordCount: {[key: string]: any} = {
		sumTotal: 0,
		sumAvg:   0,
		sumMax:   0,
		sumMin:   0,
		sumCol:   0,
		sumSelection:   0
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

		let selection = editor.selection;
		let text = editor.document.getText();
		let highlightedText = editor.document.getText(selection);

		// Update word counts for all queries
		this.extractWordCount(text);
		this.updateColInfo(text);
		this.updateSelInfo(highlightedText);


		this.statusBar.text = `Sum: ${this._wordCount.sumTotal}`;
		this.statusBar.show();
	}


	private updateSelInfo(text: string) {
		const lines = text.trim().split("\n");

		const numList = lines[0].match(NUMERIC_NUMBERS)
		let numberOfCol = 0;
		if (numList !== null) {
			numberOfCol = numList.length;
		}
		
		let colData: {[key: string]: {[key: string]: number}} = {};

		for (let i = 0; i < numberOfCol; i++) {
			colData["Col" + i] = {
				sumTotal: 0,
				sumAvg: 0,
				sumMax: 0,
				sumMin: Infinity
			};
		}

		lines.forEach((line) => {
			const allNumsS = line.match(NUMERIC_NUMBERS);
			for (let i = 0; i < numberOfCol; i++) {
				if (allNumsS && allNumsS[i]) {
					colData["Col" + i].sumTotal += +(allNumsS[i]);
					colData["Col" + i].sumMax = Math.max(+(allNumsS[i]), colData["Col" + i].sumMax);
					colData["Col" + i].sumMin = Math.min(+(allNumsS[i]), colData["Col" + i].sumMin);
				}
			}

			for (let i = 0; i < numberOfCol; i++) {
				colData["Col" + i].sumAvg = colData["Col" + i].sumTotal / lines.length;
			}
		})


		this._wordCount.sumSelection = colData;
	}

	public extractWordCount(text: string) {
		const lines = text.trim().split("\n");

		const numList: number[][] = lines.map((line) => {
			const allNumsS = line.match(NUMERIC_NUMBERS);
			if (allNumsS && allNumsS.length > 0) {	
				// Parse all numbers to float
				return allNumsS.map((numS) => {
					return +(numS);
				});
			} else {
				return [];
			}
		});

		// flatten multidimensional array into 1d array 
		// consisting of all the numbers highlighted 
		let numListFlattenned: number[] = [];
		numListFlattenned = numListFlattenned.concat(... numList);


		this._wordCount.sumTotal =  numListFlattenned.reduce((prev, curr) => {
			return prev + curr;
		});
		this._wordCount.sumMax = Math.max(... numListFlattenned);
		this._wordCount.sumMin = Math.min(... numListFlattenned);
		this._wordCount.sumAvg = this._wordCount.sumTotal / numListFlattenned.length;

	}

	private updateColInfo(text: string) {
		const lines = text.trim().split("\n");

		const numList = lines[0].match(NUMERIC_NUMBERS)
		let numberOfCol = 0;
		if (numList !== null) {
			numberOfCol = numList.length;
		}
		
		let colData: {[key: string]: {[key: string]: number}} = {};

		for (let i = 0; i < numberOfCol; i++) {
			colData["Col" + i] = {
				sumTotal: 0,
				sumAvg: 0,
				sumMax: 0,
				sumMin: Infinity
			};
		}

		lines.forEach((line) => {
			const allNumsS = line.match(NUMERIC_NUMBERS);
			for (let i = 0; i < numberOfCol; i++) {
				if (allNumsS && allNumsS[i]) {
					colData["Col" + i].sumTotal += +(allNumsS[i]);
					colData["Col" + i].sumMax = Math.max(+(allNumsS[i]), colData["Col" + i].sumMax);
					colData["Col" + i].sumMin = Math.min(+(allNumsS[i]), colData["Col" + i].sumMin);
				}
			}

			for (let i = 0; i < numberOfCol; i++) {
				colData["Col" + i].sumAvg = colData["Col" + i].sumTotal / lines.length;
			}
		})


		this._wordCount.sumCol = colData;
	}

	public getCount(type: string): number {
		console.log(this._wordCount[type])
		if (type === "sumSelection") {
			return this._wordCount[type]["sumTotal"]
		} else {
			return this._wordCount[type];
		}
    }
    
    get wordCount() {
        return this._wordCount;
    }

	public dispose() {
		this.statusBar.dispose();
	}
}