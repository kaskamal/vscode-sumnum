import {Uri, workspace, window, WorkspaceEdit, Position, Range, TextEditor, commands} from 'vscode';
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

    // Full range of file
    const fullRange = new Range(new Position(0, 0),
                                new Position(1000, 1000));
    
    // console.log(window.visibleTextEditors.)

    // const visibleTextEditors: TextEditor[] = window.visibleTextEditors;
    
    // const fileNameList: string[] = visibleTextEditors.map((textEditor) => {
    //     return textEditor.document.fileName
    // })

    // if (fileNameList.includes(file.fsPath)) {
    //     window.showTextDocument(file, {preview: true, preserveFocus: false})
    //     .then(() => {
    //         commands.executeCommand('workbench.action.closeActiveEditor');
    //     });
    // }

    


    // Extract data to view from word counter
    const wordCount = wordCounter.wordCount;
    const result_data = {
        "Sum Total": wordCount["sumTotal"],
        "Sum Max": wordCount["sumMax"],
        "Sum Min": wordCount["sumMin"],
        "Sum Avg": wordCount["sumAvg"],
        "Sum Columns": wordCount["sumCol"],
        "Sum Selection": wordCount["sumSelection"]
    }


    // console.log(edit.entries())
    edit.replace(file, fullRange, JSON.stringify(result_data, null, "\t"));
    return edit;
} 