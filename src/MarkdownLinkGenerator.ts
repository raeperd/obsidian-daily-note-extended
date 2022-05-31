import {FileManager, TFile} from "obsidian";


export class MarkdownLinkGenerator {
	private readonly fileManager: FileManager

	constructor(fileManager: FileManager) {
		this.fileManager = fileManager
	}

	getAllMarkdownLinkByCtime(fileFrom: TFile, from: Date, to: Date = new Date()): string[] {
		return fileFrom.vault.getMarkdownFiles()
			.filter((file) => from.getTime() <= file.stat.ctime && file.stat.ctime <= to.getTime())
			.sort((left, right) => right.stat.ctime - left.stat.ctime)
			.map((file) => this.fileManager.generateMarkdownLink(file, fileFrom.path))
	}
}
