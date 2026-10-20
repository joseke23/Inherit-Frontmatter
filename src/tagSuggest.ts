import { App, TFile, Notice } from 'obsidian';
import {
    DEFAULT_SETTINGS,
    PluginSettings,
    SettingTab,
} from './settings';

export async function inheritFrontmatter(app: App, file: TFile, settings: PluginSettings) {
    const target = file.path;
    let targetFrontmatter: Record<string, any> | undefined;
    console.log("Initilised Frontmatter:", targetFrontmatter);
    targetFrontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
    if (targetFrontmatter === undefined) {
        targetFrontmatter = { ...settings.defaultFrontmatter };
    }
    if (targetFrontmatter === undefined || targetFrontmatter === null) {
        targetFrontmatter = {};
    }
    console.log("Target frontmatter after default assignment:", targetFrontmatter);
    let backlinks = Object.entries(app.metadataCache.resolvedLinks).filter(([source, destination]) => target in destination).map(([source, destination]) => source);
    console.log("Backlinks found:", backlinks);
    if (!backlinks) {
        return;
    }
    for (const backlink of backlinks) {
        const sourceFile = app.vault.getAbstractFileByPath(backlink);
        console.log("Source file:", sourceFile);
        if (sourceFile instanceof TFile) {
            const sourceFrontmatter = app.metadataCache.getFileCache(sourceFile)?.frontmatter;
            if (sourceFrontmatter) {
                for (const property of Object.keys(sourceFrontmatter)) {
                    console.log(`Checking property: ${property}`);
                    if (settings.propertiesInherited.includes(property) || settings.propertiesInherited.length == 0) {
                        console.log(`Inheriting property: ${property}`);
                        if (settings.resolutionStrategy === "or" && Object.hasOwn(targetFrontmatter, property) && targetFrontmatter[property] !== undefined) {
                            targetFrontmatter[property] = targetFrontmatter[property] + " " + sourceFrontmatter[property];
                            continue;
                        } else if (property in Object.keys(targetFrontmatter)) {
                            targetFrontmatter[property] = sourceFrontmatter[property];
                            continue;
                        }
                        targetFrontmatter[property] = sourceFrontmatter[property];
                    }
                }
            }
        }
    }
    console.log("Final target frontmatter:", targetFrontmatter);
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        Object.assign(frontmatter, targetFrontmatter);
    });
}