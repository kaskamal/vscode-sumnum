import {window, commands, ExtensionContext, languages, Hover} from 'vscode';
import * as results_viewer from "./resultsViewer";
import {WordCounterController} from "./counter/wordCounterController";
import {WordCounter} from "./counter/wordCounter";
import { HoverDisplay } from './hover/hoverDisplay';

export function activate({subscriptions}: ExtensionContext) {

	// Print to console successfull activation of extension
	console.log('sumnum extension has been successfully added');

	const statusBarCommand = "statusBar.showSum";
	const hoverFilterCommand = "statusBar.showHover";
	const palatteCommands = ["sumTotal", "sumAvg", "sumMax", "sumMin", "sumCol", "sumSelection"];

	subscriptions.push(commands.registerCommand(statusBarCommand, () => {
		let n = wordCounter.getCount("sumTotal");
		window.showInformationMessage(`Total count: ${n}`);
	}));



	let wordCounter = new WordCounter(statusBarCommand);
	let wordCounterController = new WordCounterController(wordCounter);
	let hoverDisplay = new HoverDisplay(hoverFilterCommand, wordCounter);

	subscriptions.push(commands.registerCommand(hoverFilterCommand, () => {
		hoverDisplay.flipHover();
	}));
	

	subscriptions.push(wordCounter);
	subscriptions.push(wordCounterController);

	palatteCommands.forEach((element) => {
		let command = "extension.".concat(element);
		subscriptions.push(commands.registerCommand(command, () => {
			let n = wordCounter.getCount(element);
			window.showInformationMessage(`${element}: ${n}`);
		}));
	});

	// Open results viewer JSON when clicking sumResult from command palatte
	subscriptions.push(commands.registerCommand("extension.sumResult", () => {
		results_viewer.openResultsFile(wordCounterController);
	}));

}
