import {StatusBarItem, StatusBarAlignment, window, commands, ExtensionContext, Disposable, env, workspace} from 'vscode';
import * as results_viewer from "./resultsViewer";
import {WordCounterController} from "./counter/wordCounterController";
import {WordCounter} from "./counter/wordCounter";

export function activate({subscriptions}: ExtensionContext) {

	// Print to console successfull activation of extension
	console.log('Congratulations, your extension "sumnum" is now active!');

	const commandId = "sample.showSelectionCount";
	const palatteCommands = ["sumTotal", "sumAvg", "sumMax", "sumMin", "sumCol"];

	let wordCounter = new WordCounter(commandId);
	let wordCounterController = new WordCounterController(wordCounter);
	subscriptions.push(wordCounter);
	subscriptions.push(wordCounterController);

	palatteCommands.forEach((element) => {
		let command = "extension.".concat(element);
		subscriptions.push(commands.registerCommand(command, () => {
			let n = wordCounter.getCount(element);
			window.showInformationMessage(`Total count: ${n}`);
			results_viewer.openResultsFile();
		}));
	});
}
