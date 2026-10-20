import {
	Modal,
	TFile,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	PluginSettings,
	SettingTab,
} from './settings';
import { inheritFrontmatter } from './tagSuggest';

// Remember to rename these classes and interfaces!

export default class InheritFrontmatterPlugin extends Plugin {
	settings!: PluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status bar text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'toggle-inherit-frontmatter',
			name: 'Toggle Inherit Frontmatter',
			callback: () => {
				this.settings.enabled = !this.settings.enabled;
				this.saveSettings();
			},
		});


		this.addSettingTab(new SettingTab(this.app, this));


		this.addCommand({
			id: 'inherit-frontmatter',
			name: 'Inherit Frontmatter',
			callback: async () => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					await inheritFrontmatter(this.app, activeFile, this.settings);
				}
			},
		});
	}


	async saveSettings() {
		await this.saveData(this.settings);
	}
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}
}

