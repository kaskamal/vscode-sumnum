import * as vscode from 'vscode';
import * as path from 'path';
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
    edit.insert(file, new vscode.Position(0, 0), JSON.stringify(wordCounter.wordCount, null, "\t"));
    return edit;
} 