// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Book from './bookUtil';
import MiniBookViewProvider from './MiniBookView';

let bookInstance: Book;
const getbookInstance = () => {
  if (!bookInstance) {
    bookInstance = new Book();
  }
  return bookInstance;
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "minibook" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // 创建状态栏项
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
  statusBarItem.text = 'Mini Book';
  statusBarItem.tooltip = 'Mini Book';
  statusBarItem.command = 'minibook.displayCode';
  statusBarItem.show();

  // 老板键
  let displayCode = vscode.commands.registerCommand('minibook.displayCode', () => {
    let lauage_arr_list = ['Mini Book'];
    var index = Math.floor(Math.random() * lauage_arr_list.length);
    statusBarItem.text = lauage_arr_list[index];
  });

  // 下一页
  let getNextPage = vscode.commands.registerCommand('minibook.getNextPage', () => {
    statusBarItem.text = getbookInstance().getNextPage();
  });

  // 上一页
  let getPreviousPage = vscode.commands.registerCommand('minibook.getPreviousPage', () => {
    statusBarItem.text = getbookInstance().getPreviousPage();
  });

  // 跳转某个页面
  let reload = vscode.commands.registerCommand('minibook.reload', () => {
    const book = getbookInstance();
    book.loadBook();
    statusBarItem.text = book.getTextByPage();
  });

  context.subscriptions.push(displayCode);
  context.subscriptions.push(getNextPage);
  context.subscriptions.push(getPreviousPage);
  context.subscriptions.push(reload);

  // 注册活动栏视图
  const provider = new MiniBookViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(MiniBookViewProvider.viewType, provider));
}

// This method is called when your extension is deactivated
export function deactivate() {}
