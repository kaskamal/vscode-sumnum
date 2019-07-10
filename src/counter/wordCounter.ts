import {StatusBarItem, StatusBarAlignment, window, Position, Range, TextDocument} from "vscode";


// regex string that extracts list of all numbers present in a string
const NUMERIC_NUMBERS = /[+-]?\d+(?:\.\d+)?/g;

export class WordCounter {
	private statusBar: StatusBarItem;
	private _fullRange: Range;
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
		this._fullRange = new Range(new Position(0,0), new Position(0,0));
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

		this.updateRange(editor.document);

		// Update word counts for all queries
		this.extractWordCount(text);
		this.updateColInfo(text);

		this.updateSelInfo(highlightedText);




		this.statusBar.text = `Sum: ${this._wordCount.sumTotal}`;
		this.statusBar.show();
	}


	private updateRange(document: TextDocument): void {
		// Create range that is intentially one line past the text and 
		// trim the range to produce the range containing the full contents 
		// of the file
		const invalidRange = new Range(0, 0, document.lineCount, 0);
		this._fullRange = document.validateRange(invalidRange);	

		// this._fullRange = new Range(validatedRange.start,
		// 							new Position(validatedRange.end.line + 1, validatedRange.end.character));
	}

	get fullRange() {
		return this._fullRange;
	}

	private updateSelInfo(text: string) {
		let temp_selection: {[key: string]: any} = {};

		if (text == "") {
			this._wordCount.sumSelection = 0;
		}

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


		temp_selection["sumTotal"] =  numListFlattenned.reduce((prev, curr) => {
			return prev + curr;
		}, 0);


		temp_selection["sumMax"] = Math.max(... numListFlattenned);
		temp_selection["sumMin"] = Math.min(... numListFlattenned);
		temp_selection["sumAvg"] = temp_selection["sumTotal"] / numListFlattenned.length;




		const numListCol = lines[0].match(NUMERIC_NUMBERS)
		let numberOfCol = 0;
		if (numListCol !== null) {
			numberOfCol = numListCol.length;
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


		temp_selection["sumCol"] = colData;

		this._wordCount.sumSelection = temp_selection;
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
		if (type === "sumSelection") {
			return typeof this._wordCount[type] === "number"
					? this._wordCount[type]
					: this._wordCount[type]["sumTotal"];
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