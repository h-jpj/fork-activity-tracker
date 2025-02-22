import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

let repoPath: string = "";
let remoteURL: string | undefined;

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

    // Prompt for the remote repository URL if not already set
    if (!remoteURL) {
        vscode.window.showInputBox({ prompt: "Enter your forked-changes repository SSH URL (e.g., git@github.com:yourusername/forked-changes.git)" }).then(value => {
            if (value) {
                remoteURL = value; // Store the remote URL
                vscode.window.showInformationMessage(`Remote URL set to: ${remoteURL}`);
            }
        });
    }

    // Monitor file changes
    vscode.workspace.onDidSaveTextDocument((document) => {
        let filePath = document.uri.fsPath;
        trackGitChanges(repoPath, filePath);
    });

    console.log('Fork Activity Tracker extension is now active!');

    // Set up automatic commits
    let pushInterval = vscode.workspace.getConfiguration().get<number>("forkActivityTracker.pushInterval") || 30;
    setInterval(() => {
        commitToForkedChanges("Automated commit", repoPath);
    }, pushInterval * 60 * 1000);
}

function trackGitChanges(repoPath: string, filePath: string) {
    exec(`git diff --unified=0 ${filePath}`, { cwd: repoPath }, (err, stdout) => {
        if (err) {
            console.error("Error getting Git changes:", err);
            return;
        }
        if (stdout) {
            let commitMessage = generateCommitMessage(stdout, filePath);
            copyFileToForkedChanges(filePath); // Copy changed file to the forked repo
            commitToForkedChanges(commitMessage, repoPath);
        }
    });
}

function copyFileToForkedChanges(filePath: string) {
    let forkedRepoPath = path.join(repoPath, '../forked-changes'); // Assume it's one level up

    if (!fs.existsSync(forkedRepoPath)) {
        vscode.window.showErrorMessage("forked-changes repo not found! Create it first.");
        return;
    }

    const destPath = path.join(forkedRepoPath, path.basename(filePath));
    fs.copyFile(filePath, destPath, (err) => {
        if (err) {
            vscode.window.showErrorMessage(`Error copying file to forked-changes: ${err.message}`);
            console.error("File Copy Error:", err);
        } else {
            console.log(`Copied ${filePath} to ${destPath}`);
        }
    });
}

function commitToForkedChanges(message: string, repoPath: string) {
    let forkedRepoPath = path.join(repoPath, '../forked-changes'); // Assume it's one level up

    if (!fs.existsSync(forkedRepoPath)) {
        vscode.window.showErrorMessage("forked-changes repo not found! Create it first.");
        return;
    }

    // Push using SSH
    if (remoteURL) {
        pushChanges(forkedRepoPath, message);
    } else {
        vscode.window.showErrorMessage("Remote URL not set. Please set it in the extension.");
    }
}

function pushChanges(forkedRepoPath: string, message: string) {
    const checkCommand = `cd "${forkedRepoPath}" && git status --porcelain`;

    exec(checkCommand, { env: process.env }, (err, stdout) => {
        if (err) {
            console.error("Error checking Git status:", err);
            return;
        }

        if (stdout) { // If there are changes
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
        } else {
            console.log("No changes to commit.");
            vscode.window.showInformationMessage("No changes to commit in the forked-changes repo.");
        }
    });
}

// Generate commit messages
function generateCommitMessage(diff: string, filePath: string): string {
    let fileName = path.basename(filePath);
    let changes = diff.match(/^\+.*$/gm); // Get added lines
    let summary = changes ? changes.slice(0, 3).join("\n") : "Minor edits";

    return `Updated ${fileName}:\n${summary}`;
}
