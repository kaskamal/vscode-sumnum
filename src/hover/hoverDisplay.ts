import {StatusBarItem, StatusBarAlignment, window, languages, Hover, Position, Disposable, MarkdownString} from "vscode";
import { WordCounter, NUMERIC_NUMBERS, colType } from "../counter/wordCounter";



export class HoverDisplay {
    private _buttonId: string;
    private _wordCounter: WordCounter;
    private _statusBar: StatusBarItem;
    private _hoverDisposible: Disposable[];

    constructor(buttonId: string, wordCounter: WordCounter) {
        this._buttonId = buttonId;
        this._wordCounter = wordCounter;
        this._hoverDisposible = [];
        this._statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        this._statusBar.command = buttonId;
        this._statusBar.text = `ENABLE HOVER`;
        this._statusBar.show();        
        

         // subscribe to selection change and editor activation events
         window.onDidChangeTextEditorSelection(this.updateHover, this);           
         window.onDidChangeActiveTextEditor(this.updateHover, this);
         window.onDidChangeTextEditorVisibleRanges(this.updateHover, this);
    }

    private updateHover() {
        // Remove previous hovers to prevent merging with new hover
        this._hoverDisposible.forEach((elm) => {
            elm.dispose();
        })

        // Check whether hover display is enabled
        if (this._statusBar.text === `ENABLE HOVER`) {
            return;
        } else {
            this._wordCounter.updateWordCount();
            const colData: number | colType = this._wordCounter.getCount("sumCol");

            if (typeof colData === "object") {
                Object.keys(colData).forEach((col) => {
                    const colInformation = colData[col];
                    this._hoverDisposible.push(languages.registerHoverProvider('*', {
                        provideHover(document, position, token) {
                            if (position.isEqual(new Position(0,colInformation["startLoc"]))) {
                                let markdownString: MarkdownString = new MarkdownString();
                                markdownString.appendMarkdown(`### ${col} Summary`);
                                return new Hover(markdownString);
                            }
                        }
                    }));
                })
            }
            


            
        }
    }

    public flipHover(): void {
        if (this._statusBar.text === `ENABLE HOVER`) {
            this._statusBar.text = `DISABLE HOVER`;
            this.updateHover();
        } else {
            this._statusBar.text = `ENABLE HOVER`;
        }
    }
}