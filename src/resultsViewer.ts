import * as vscode from 'vscode';
import * as path from 'path';

export function openResultsFile(): void {     
    const newFile = vscode.Uri.parse("untitled:" + 'safsa.csv');
    vscode.workspace.openTextDocument(newFile).then(document => {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(newFile, new vscode.Position(0, 0), "Hello world!");
    return vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            vscode.window.showTextDocument(document);
        } else {
            vscode.window.showInformationMessage('Error!');
        }
    });
});
}

