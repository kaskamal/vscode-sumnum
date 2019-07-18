# SumNum for Visual Studio Code

Rapid numerical analysis of data files, highlighted texts, and more!

![Example](https://raw.githubusercontent.com/kaskamal/vscode-sumnum/master/images/example_sumnum_usage.gif)

*Example hover display usage by hovering over columns in the first row*

# Installation 

## Extension Marketplace

Click the extensions icon in the activity bar and search for *kaskamal.sumnum*. The following shell command may also be used to install the extension:

```bash
$ code --install-extension kaskamal.sumnum
```

# Usage 

## Command Palatte Commands

enter `Ctrl-Shift-P` and enter one of the following commands:

| Command          |                                               |
| :--------------- | :-------------------------------------------- | 
| `SUM: Total`     | Total sum of numbers  
| `SUM: Max`       | Maximum number  
| `SUM: Min`       | Minimum number  
| `SUM: Avg`       | Average number 
| `SUM: Result`    | Results JSON file 
| `SUM: Col`       | Column information
| `SUM: Selection` | Results JSON file for currently selected text 

*Data extracted from currently selected file*

## Status Bar Sum 

Status bar item of format `Sum: NUMBER`. Represents a continuously updated total sum of the currently selected file 

## Hover Display

Enable/Disable hover display using status bar item - `ENABLE HOVER | DISABLE HOVER`
