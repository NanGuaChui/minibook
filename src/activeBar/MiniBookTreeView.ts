import * as vscode from 'vscode';

export class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MyTreeItem | undefined | void> = new vscode.EventEmitter<
    MyTreeItem | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
    if (element) {
      if (Math.random() > 0.5) {
        return Promise.resolve(['213', '213213'].map(item => new MyTreeItem(item)));
      }
      return Promise.resolve([]);
    } else {
      return Promise.resolve([new MyTreeItem('Item 1'), new MyTreeItem('Item 2')]);
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

export class MyTreeItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.tooltip = `${this.label}`;
    this.description = `${this.label}`;
    this.contextValue = 'markdownContent';
  }
}
