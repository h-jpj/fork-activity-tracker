import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

let repoPath: string = "";

export function activate(context: vscode.ExtensionContext) {
    let workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder found!");
        return;
    }

    repoPath = workspaceFolders[0].uri.fsPath;

    // Check if it's a Git repo
    if (!fs.existsSync(path.join(repoPath, '.git'))) {
        vscode.window.showErrorMessage("This doesn't seem to be a Git repository.");
        return;
    }

    // Monitor file changes
    vscode.workspace.onDidSaveTextDocument((document) => {
        let filePath = document.uri.fsPath;
        trackGitChanges(repoPath, filePath); // Pass both repoPath and filePath
    });

    console.log('Fork Activity Tracker extension is now active!');

    // Set up automatic commits
    let pushInterval = vscode.workspace.getConfiguration().get<number>("forkActivityTracker.pushInterval") || 30;
    setInterval(() => {
        commitToForkedChanges("Automated commit", repoPath);
    }, pushInterval * 60 * 1000);
}

function trackGitChanges(repoPath: string, filePath: string) { // Accept filePath as a parameter
    exec(`git diff --name-only HEAD`, { cwd: repoPath }, (err, stdout) => {
        if (err) {
            console.error("Error getting Git changes:", err);
            return;
        }

        const changedFiles = stdout.split('\n').filter(file => file); // Get list of changed files

        if (changedFiles.length > 0) {
            let commitMessage = generateCommitMessage(changedFiles, repoPath);
            copyChangedFiles(changedFiles, repoPath);
            commitToForkedChanges(commitMessage, repoPath);
        }
    });
}

function copyChangedFiles(changedFiles: string[], repoPath: string) {
    const forkedRepoPath = path.join(repoPath, '../forked-changes'); // Assume it's one level up

    changedFiles.forEach(file => {
        const sourcePath = path.join(repoPath, file);
        const destPath = path.join(forkedRepoPath, file);

        // Ensure the destination directory exists
        const destDir = path.dirname(destPath);
        fs.mkdirSync(destDir, { recursive: true });

        // Copy the file
        fs.copyFileSync(sourcePath, destPath);
    });
}

function commitToForkedChanges(message: string, repoPath: string) {
    let forkedRepoPath = path.join(repoPath, '../forked-changes'); // Assume it's one level up

    if (!fs.existsSync(forkedRepoPath)) {
        vscode.window.showErrorMessage("forked-changes repo not found! Create it first.");
        return;
    }

    // Push using SSH
    pushChanges(forkedRepoPath, message);
}

function pushChanges(forkedRepoPath: string, message: string) {
    let remoteURL = 'git@github.com:h-jpj/forked-changes.git'; // SSH only

    const command = `cd "${forkedRepoPath}" && git remote set-url origin ${remoteURL} && git add . && git commit -m "${message}" && git push origin main`;
    console.log("Executing command:", command); // Log the command for debugging

    exec(command, { env: process.env }, (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage("Error committing changes to forked-changes repo. Check console logs for details.");
            console.error("Git Command Failed:", stderr);
            console.log("Standard Output:", stdout);
            console.error("Error Details:", err); // Log the error details
            return;
        }
        vscode.window.showInformationMessage("Changes pushed to forked-changes repo!");
    });
}

// Generate commit messages
function generateCommitMessage(changedFiles: string[], repoPath: string): string {
    const changesSummary: string[] = [];

    changedFiles.forEach(file => {
        const filePath = path.join(repoPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8'); // Read file content to analyze changes
        const changes = fileContent.split('\n'); // Modify this logic based on your needs

        changesSummary.push(`Updated ${file}:`);
        changesSummary.push(`- Changes made in ${file}`); // Adjust based on the actual changes
    });

    return changesSummary.join('\n');
}
