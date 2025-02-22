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
            commitToForkedChanges(commitMessage, repoPath);
        }
    });
}

function commitToForkedChanges(message: string, repoPath: string) {
    let forkedRepoPath = path.join(repoPath, '../forked-changes'); // Assume it's one level up

    if (!fs.existsSync(forkedRepoPath)) {
        vscode.window.showErrorMessage("forked-changes repo not found! Create it first.");
        return;
    }

    // Check if SSH key is available
    exec('ssh-add -l', (err, stdout) => {
        if (err) {
            // If ssh-add command fails, fall back to HTTPS
            console.log("SSH keys not available, using HTTPS for pushing.");
            pushChanges(forkedRepoPath, message, false); // false indicates use HTTPS
        } else {
            console.log("SSH keys found, using SSH for pushing.");
            pushChanges(forkedRepoPath, message, true); // true indicates use SSH
        }
    });
}

function pushChanges(forkedRepoPath: string, message: string, useSSH: boolean) {
    let remoteURL = useSSH
        ? 'git@github.com:username/forked-changes.git' // Replace with your username and repo
        : 'https://<your_username>:<your_token>@github.com/username/forked-changes.git'; // Replace with your credentials

    exec(
        `cd "${forkedRepoPath}" && git remote set-url origin ${remoteURL} && git add . && git commit -m "${message}" && git push origin main`,
        (err, stdout, stderr) => {
            if (err) {
                // Check for common errors
                if (stderr.includes('fatal: could not read Username')) {
                    vscode.window.showErrorMessage("Authentication failed. Please check your SSH keys or Personal Access Token.");
                } else {
                    vscode.window.showErrorMessage("Error committing changes to forked-changes repo.");
                }
                console.error(stderr);
                return;
            }
            vscode.window.showInformationMessage("Changes pushed to forked-changes repo!");
        }
    );
}

// Generate commit messages
function generateCommitMessage(diff: string, filePath: string): string {
    let fileName = path.basename(filePath);
    let changes = diff.match(/^\+.*$/gm); // Get added lines
    let summary = changes ? changes.slice(0, 3).join("\n") : "Minor edits";

    return `Updated ${fileName}:\n${summary}`;
}
