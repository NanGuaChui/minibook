import { ExtensionContext, workspace, window } from "vscode";
import * as fs from "fs";

interface BookContent {
  filePath: string;
  chapterList: any[];
}

export class Book {
  currChapterNumber: number = 1;
  currPageNumber: number = 1;
  pageSize: number | undefined = 50;
  chatper: string = "";
  page = 0;
  start = 0;
  end = this.pageSize;
  filePath: string | undefined = "";
  bookContent: BookContent = { filePath: "", chapterList: [] };

  constructor() {
    this.currPageNumber = <number>(
      workspace.getConfiguration().get("minibook.currPageNumber")
    );
    this.currChapterNumber = <number>(
      workspace.getConfiguration().get("minibook.currChapterNumber")
    );
    this.filePath = workspace.getConfiguration().get("minibook.filePath");
    this.pageSize = workspace.getConfiguration().get("minibook.pageSize");

    this.initBookContent();
  }

  loadBook() {
    this.currPageNumber = <number>(
      workspace.getConfiguration().get("minibook.currPageNumber")
    );
    this.currChapterNumber = <number>(
      workspace.getConfiguration().get("minibook.currChapterNumber")
    );
    this.filePath = workspace.getConfiguration().get("minibook.filePath");
    this.pageSize = workspace.getConfiguration().get("minibook.pageSize");

    this.initBookContent();
  }

  initBookContent() {
    if (this.filePath === "" || typeof this.filePath === "undefined") {
      window.showWarningMessage(
        "请填写TXT格式的小说文件路径 & Please fill in the path of the TXT format novel file"
      );
    }

    if (this.filePath === this.bookContent.filePath) {
      return;
    }

    const text: string = fs.readFileSync(this.filePath!, "utf-8");

    // 使用正则表达式匹配章节内容
    const contentRegex =
      /(?:.*\s)?第.+章\s*(\S+)([\s\S]*?)(?=(?:.*\s)?第.+章\s*\S+|$)/g;
    let match;
    const chapterList = [];

    while ((match = contentRegex.exec(text)) !== null) {
      const title = match[1].trim();
      const content = match[0].trim();
      chapterList.push({
        title,
        content,
        pageSize: Math.ceil(content.length / this.pageSize!),
      });
    }

    this.bookContent = { filePath: this.filePath!, chapterList };
  }

  initChatper() {
    const chapter = this.bookContent.chapterList[this.currChapterNumber - 1];

    this.chatper = chapter.content
      .toString()
      .replace(/\n/g, " ")
      .replace(/\r/g, " ")
      .replace(/\t/g, " ")
      .replace(/　　/g, " ")
      .replace(/ /g, " ")
      .trim();
  }

  getFileName() {
    const file_name: string | undefined = this.filePath!.split("/").pop();
    console.log(file_name);
  }

  updatePage() {
    workspace
      .getConfiguration()
      .update("minibook.currChapterNumber", this.currChapterNumber, true);
    workspace
      .getConfiguration()
      .update("minibook.currPageNumber", this.currPageNumber, true);
  }

  getStartEnd() {
    return {
      start: this.currPageNumber * this.pageSize! - this.pageSize!,
      end: this.currPageNumber * this.pageSize!,
    };
  }

  getTextByPage(): string {
    if (this.chatper === "") {
      this.initChatper();
    }

    this.page =
      this.bookContent.chapterList[this.currChapterNumber - 1].pageSize;

    const page_info = `${this.currPageNumber}/${this.page}`;
    this.updatePage();
    const { start, end } = this.getStartEnd();
    const currentString = this.chatper.substring(start, end);

    return `(${this.currChapterNumber})${currentString} ${page_info}`;
  }

  getPreviousPage(): string {
    if (this.currChapterNumber <= 1 && this.currPageNumber <= 1) {
      return this.getTextByPage();
    }

    if (this.currPageNumber <= 1) {
      this.currChapterNumber -= 1;
      this.currPageNumber =
        this.bookContent.chapterList[this.currChapterNumber - 1].pageSize;
      this.initChatper();
    } else {
      this.currPageNumber -= 1;
    }

    return this.getTextByPage();
  }

  getNextPage(): string {
    const chapter = this.bookContent.chapterList[this.currChapterNumber - 1];
    if (this.currPageNumber >= chapter.pageSize) {
      this.currChapterNumber += 1;
      this.currPageNumber = 1;
      this.initChatper();
    } else {
      this.currPageNumber += 1;
    }

    return this.getTextByPage();
  }
}
