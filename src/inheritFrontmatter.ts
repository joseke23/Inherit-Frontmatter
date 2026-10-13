import { App, TFile, Notice } from 'obsidian';

export async function inheritFrontmatter(app: App, file: TFile) {
    const target = file.path;
    let backlinks = Object.entries(app.metadataCache.resolvedLinks).filter(([source, destination]) => target in destination).map(([source, destination]) => source);
    if (!backlinks) {
        return;
    }
    for (const backlink of backlinks) {
        const sourceFile = app.vault.getAbstractFileByPath(backlink);

    }
}