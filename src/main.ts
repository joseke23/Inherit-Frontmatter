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
import { inheritFrontmatter } from './inheritFrontmatter';

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



		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));


		this.registerEvent(
			this.app.vault.on("create", async (file) => {
				if (!(file instanceof TFile) || file.extension !== 'md') {
					return;
				}

				if (!this.settings.enabled) {
					return;
				}
				await inheritFrontmatter(this.app, file);
			})
		);
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

