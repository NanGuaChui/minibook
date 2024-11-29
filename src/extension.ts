// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, window } from "vscode";
import * as book from "./bookUtil";

let bookInstance: book.Book;
const getbookInstance = () => {
  if (!bookInstance) {
    bookInstance = new book.Book();
  }
  return bookInstance;
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "minibook" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // 老板键
  let displayCode = commands.registerCommand("minibook.displayCode", () => {
    let lauage_arr_list = ["Mini Book"];

    var index = Math.floor(Math.random() * lauage_arr_list.length);
    window.setStatusBarMessage(lauage_arr_list[index]);
  });

  // 下一页
  let getNextPage = commands.registerCommand("minibook.getNextPage", () => {
    window.setStatusBarMessage(getbookInstance().getNextPage());
  });

  // 上一页
  let getPreviousPage = commands.registerCommand(
    "minibook.getPreviousPage",
    () => {
      window.setStatusBarMessage(getbookInstance().getPreviousPage());
    }
  );

  // 跳转某个页面
  let getJumpingPage = commands.registerCommand("minibook.reload", () => {
    const book = getbookInstance();
    book.loadBook();
    window.setStatusBarMessage(book.getTextByPage());
  });

  context.subscriptions.push(displayCode);
  context.subscriptions.push(getNextPage);
  context.subscriptions.push(getPreviousPage);
  context.subscriptions.push(getJumpingPage);
}

// This method is called when your extension is deactivated
export function deactivate() {}
