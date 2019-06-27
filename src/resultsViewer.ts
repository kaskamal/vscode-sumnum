import * as vscode from 'vscode';
import { WordCounterController } from './counter/wordCounterController';
import { WordCounter } from './counter/wordCounter';

export function openResultsFile(wordCounterController: WordCounterController): void {     
    const newFile = vscode.Uri.parse("untitled:" + 'sum_results_viewer.json');
    vscode.workspace.openTextDocument(newFile).then(document => {
        const edit = editWorkspace(wordCounterController, newFile);
        return vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                vscode.window.showTextDocument(document);
            } else {
                vscode.window.showInformationMessage('Error!');
            }
        });
    });   
}

function editWorkspace(wordCounterController: WordCounterController, file: vscode.Uri): vscode.WorkspaceEdit {
    const wordCounter: WordCounter = wordCounterController.wordCounter;

    const edit = new vscode.WorkspaceEdit();

    // Start and end position of file to replace
    const startFile = new vscode.Position(0, 0);
    // Temp solution, need to determine the end line and character of 
    // the file
    const endFile   = new vscode.Position(100, 100);

    edit.replace(file, new vscode.Range(startFile, endFile), JSON.stringify(wordCounter.wordCount, null, "\t"));
    return edit;
} 