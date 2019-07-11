import {StatusBarItem, StatusBarAlignment, window, languages, Hover, Position, Disposable} from "vscode";
import { WordCounter } from "../counter/wordCounter";


export class HoverDisplay {
    private _buttonId: string;
    private _wordCounter: WordCounter;
    private _statusBar: StatusBarItem;
    private _hoverDisposible: Disposable | undefined;

    constructor(buttonId: string, wordCounter: WordCounter) {
        this._buttonId = buttonId;
        this._wordCounter = wordCounter;
        // this.createStatusBar(buttonId);
        this._hoverDisposible = undefined;
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
        // Remove previous hover to prevent merging with new hover
        if (this._hoverDisposible) {
            this._hoverDisposible.dispose();
        }

        if (this._statusBar.text === `ENABLE HOVER`) {
            return;
        } else {
            this._wordCounter.updateWordCount();
            const number = this._wordCounter.getCount("sumTotal")
            this._hoverDisposible = languages.registerHoverProvider('*', {
                provideHover(document, position, token) {
                    if (position.isEqual(new Position(0,0))) {
                        return new Hover(`${number}`);
                    }
                }
            });
        }
    }

    // private createStatusBar(buttonId: string): void {
    //     this._statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
    //     this._statusBar.command = buttonId;
    //     this._statusBar.text = `ENABLE HOVER`;
    //     this._statusBar.show();
    // }

    public flipHover(): void {
        if (this._statusBar.text === `ENABLE HOVER`) {
            this._statusBar.text = `DISABLE HOVER`;
            this.updateHover();
        } else {
            this._statusBar.text = `ENABLE HOVER`;
        }
    }
}