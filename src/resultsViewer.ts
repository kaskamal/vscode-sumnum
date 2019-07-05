import {Uri, workspace, window, WorkspaceEdit, Position, Range} from 'vscode';
import { WordCounterController } from './counter/wordCounterController';
import { WordCounter } from './counter/wordCounter';

export function openResultsFile(wordCounterController: WordCounterController): void {     
    const newFile = Uri.parse("untitled:" + 'sum_results_viewer.json');
    workspace.openTextDocument(newFile).then(document => {
        const edit = editWorkspace(wordCounterController, newFile);
        return workspace.applyEdit(edit).then(success => {
            if (success) {
                window.showTextDocument(document);
            } else {
                window.showInformationMessage('Error!');
            }
        });
    });   
}

function editWorkspace(wordCounterController: WordCounterController, file: Uri): WorkspaceEdit {
    const wordCounter: WordCounter = wordCounterController.wordCounter;

    const edit = new WorkspaceEdit();

    // Start and end position of file to replace
    const startFile = new Position(0, 0);
    // Temp solution, need to determine the end line and character of 
    // the file
    const endFile   = new Position(100, 100);

    // Extract data to view from word counter
    const result_data = {
        "Sum Total": wordCounter.getCount("sumTotal"),
        "Sum Max": wordCounter.getCount("sumMax"),
        "Sum Min": wordCounter.getCount("sumMin"),
        "Sum Avg": wordCounter.getCount("sumAvg"),
        "Sum Columns": wordCounter.getCount("sumCol")
    }


    edit.replace(file, new Range(startFile, endFile), JSON.stringify(result_data, null, "\t"));
    return edit;
} 