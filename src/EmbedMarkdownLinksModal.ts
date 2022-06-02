import {App, Modal, Setting} from "obsidian";

export class EmbedMarkdownLinksModal extends Modal {
	date: Date
	onSubmit: (fromDate: Date) => void

	constructor(app: App, date: Date, onSubmit: (fromDate: Date) => void) {
		super(app);
		this.date = date
		this.onSubmit = onSubmit
	}

	onOpen() {
		this.contentEl.createEl("h1", {text: "Embed Markdown Links"})

		new Setting(this.contentEl).setName("Date").addText((text) => {
			this.date.setHours(0, 0, 0)
			text.setValue(`${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}`)
				.onChange((value) => {this.date = new Date(value)})
		})

		new Setting(this.contentEl).addButton((btn) =>
			btn.setButtonText("Embed").setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.date);
				})
		);

		this.contentEl.find("input").focus()
	}

	onClose() {
		this.contentEl.empty()
	}
}
