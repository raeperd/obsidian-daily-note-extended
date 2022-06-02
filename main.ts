import {App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {MarkdownLinkGenerator} from "./src/MarkdownLinkGenerator";
import {EmbedMarkdownLinksModal} from "./src/EmbedMarkdownLinksModal";

interface DailyNoteExtendedSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DailyNoteExtendedSettings = {
	mySetting: 'default'
}

export default class DailyNoteExtendedPlugin extends Plugin {
	settings: DailyNoteExtendedSettings;
	private markdownLinkGenerator: MarkdownLinkGenerator

	async onload() {
		await this.loadSettings();
		this.markdownLinkGenerator = new MarkdownLinkGenerator(this.app.fileManager)

		this.addCommand({
			id: 'embed-markdown-links-edited-today',
			name: 'Embed Markdown Links Edited Today',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const midnight = new Date();
				midnight.setHours(0, 0, 0, 0)
				const links = this.markdownLinkGenerator.getAllMarkdownLinkByCtime(view.file, midnight)
					.join("\n")
				editor.replaceRange(links, editor.getCursor())
			}
		});

		this.addCommand({
			id: 'embed-markdown-links-by-edited-date',
			name: 'Embed Markdown Links By Edited Date',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const handleSubmit = (date: Date) => {
					const nextDate = new Date(date)
					nextDate.setDate(date.getDate() + 1)
					const links = this.markdownLinkGenerator.getAllMarkdownLinkByCtime(view.file, date, nextDate)
						.join("\n")
					editor.replaceRange(links, editor.getCursor())
				}

				new EmbedMarkdownLinksModal(this.app, new Date(), handleSubmit).open()
			}
		})

		this.addSettingTab(new DailyNoteExtendedSettingsTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class DailyNoteExtendedSettingsTab extends PluginSettingTab {
	plugin: DailyNoteExtendedPlugin;

	constructor(app: App, plugin: DailyNoteExtendedPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
