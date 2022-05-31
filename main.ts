import {App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {MarkdownLinkGenerator} from "./src/MarkdownLinkGenerator";

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
			id: 'embed-markdown-files-edited-today',
			name: 'Embed Markdown Files Edited Today',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const midnight = new Date();
				midnight.setHours(0, 0, 0, 0)
				const links = this.markdownLinkGenerator.getAllMarkdownLinkByCtime(view.file, midnight)
					.join("\n")
				editor.replaceRange(links, editor.getCursor())
			}
		});

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
