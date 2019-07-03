import {StatusBarItem, StatusBarAlignment, window} from "vscode";


export class HoverDisplay {
    private _buttonId: string;
    private _statusBar: StatusBarItem;

    constructor(buttonId: string) {
        this._buttonId = buttonId;
        this._statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        this._statusBar.command = buttonId;
        this._statusBar.text = `ENABLE HOVER`;
        this._statusBar.show();
    }

    public flipHover(): void {
        if (this._statusBar.text === `ENABLE HOVER`) {
            this._statusBar.text = `DISABLE HOVER`;
        } else {
            this._statusBar.text = `ENABLE HOVER`;
        }
    }
}