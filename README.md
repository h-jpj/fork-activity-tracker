# Fork Activity Tracker

The **Fork Activity Tracker** extension for Visual Studio Code helps you maintain visibility of your work on forked repositories. It automatically commits and pushes changes made in your local forked repository to a separate repository named "forked-changes." This allows you to showcase your activity on GitHub, improving your profile's visibility to potential employers.

## Features

- **Automatic Tracking**: Monitors changes in your forked repository and commits them automatically.
- **Commit Messages**: Generates informative commit messages based on the changes made to files.
- **SSH and HTTPS Support**: Uses SSH for pushing changes if an SSH key is available; otherwise, it falls back to HTTPS.
- **Configurable Push Interval**: Set how often (in minutes) the extension should push changes to the "forked-changes" repository.

## Setup Instructions

1. **Install the Extension**: Clone this repository and open it in Visual Studio Code. Use the command palette (`Ctrl + Shift + P` or `Cmd + Shift + P`) and select `Extensions: Install from VSIX...` to install the extension.

2. **Create Forked Changes Repository**: Create a new repository on GitHub named "forked-changes." Ensure you have the proper permissions set up.

3. **Configure the Extension**:
   - Open your workspace settings (`.vscode/settings.json`) and add the following configuration:

   ```json
   {
       "forkActivityTracker.pushInterval": 30 // Push changes every 30 minutes
   }

    Usage:
        Open your forked repository in Visual Studio Code.
        Make changes to your code as needed. The extension will automatically track and commit these changes.
        Every configured interval, the extension will push the changes to the "forked-changes" repository, showcasing your activity.

Development
Requirements

    Node.js
    Visual Studio Code
    TypeScript

Building the Extension

    Install Dependencies: Run the following command in the project directory:

npm install

Compile the TypeScript Code: Use the command:

    npm run compile

    Run the Extension: Press F5 in Visual Studio Code to launch a new Extension Development Host window with the extension loaded.

Contributions

Feel free to contribute to the project by creating issues, submitting pull requests, or suggesting improvements.
License

This project is licensed under the MIT License.