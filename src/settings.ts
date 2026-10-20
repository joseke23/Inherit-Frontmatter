import { App, PluginSettingTab, Setting } from 'obsidian';
import InheritFrontmatterPlugin from './main';

export interface PluginSettings {
	enabled: boolean;
	resolutionStrategy: "or" | "none";
	propertiesInherited: string[];
	defaultFrontmatter: Record<string, any>;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	enabled: true,
	resolutionStrategy: "or",
	propertiesInherited: [],
	defaultFrontmatter: {},
};

export class SettingTab extends PluginSettingTab {
	plugin: InheritFrontmatterPlugin;

	constructor(app: App, plugin: InheritFrontmatterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Enable Inherit Frontmatter')
			.setDesc('Toggle the Inherit Frontmatter plugin on or off.')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enabled)
					.onChange(async (value) => {
						this.plugin.settings.enabled = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Resolution Strategy')
			.setDesc(
				'Choose how to resolve conflicts when multiple frontmatter values are present.',
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption('and', 'AND')
					.addOption('or', 'OR')
					.addOption('none', 'NONE')
					.setValue(this.plugin.settings.resolutionStrategy)
					.onChange(async (value) => {
						this.plugin.settings.resolutionStrategy = value as
							| 'or'
							| 'none';
						await this.plugin.saveSettings();
					}),
			);
		new Setting(containerEl)
			.setName('Properties Inherited')
			.setDesc(
				'Enter the frontmatter properties to inherit, separated by commas.',
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.propertiesInherited.join(', '))
					.onChange(async (value) => {
						this.plugin.settings.propertiesInherited = value
							.split(',')
							.map((prop) => prop.trim());
						await this.plugin.saveSettings();
					}),
			);
		new Setting(containerEl)
			.setName('Default Frontmatter')
			.setDesc(
				'Enter the default frontmatter values to use when no backlinks are found, in JSON format.',
			)
			.addTextArea((textArea) =>
				textArea
					.setValue(
						JSON.stringify(this.plugin.settings.defaultFrontmatter, null, 2),
					)
					.onChange(async (value) => {
						try {
							this.plugin.settings.defaultFrontmatter = JSON.parse(value);
							await this.plugin.saveSettings();
						} catch (error) {
							console.error('Invalid JSON:', error);
						}
					}),
			);
	}
}
