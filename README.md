# Fork Activity Tracker

## Overview

**Fork Activity Tracker** is a Visual Studio Code extension designed to help developers keep track of their changes in forked repositories. It automatically commits changes to a separate repository named **`forked-changes`** at regular intervals, ensuring that these contributions are visible on your GitHub profile. This tool helps showcase your coding activity, especially when working on forks.
Please feel free to fork this a made your version as this probably isn't the best way to go about doing this.

## Features

- Monitors file changes in your local workspace.
- Automatically commits changes to a designated repository every 30 minutes (configurable).
- Generates meaningful commit messages based on file modifications.
- Uses SSH for pushing changes if an SSH key is available, otherwise falls back to HTTPS.
- Easy to set up and integrate into your existing workflow.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>

    Install Dependencies: Make sure you have Node.js installed, then run:

npm install

Compile the Extension: Compile the TypeScript code to JavaScript:

npm run compile

Open in VS Code: Open the project in Visual Studio Code:

    code .

    Run the Extension: Press F5 to start a new Extension Development Host instance of VS Code with your extension.

Configuration

    Create a forked-changes Repository: Before using the extension, create a new repository on GitHub named forked-changes in your account.

    Set Up SSH or HTTPS:
        If using SSH, ensure your GitHub SSH key is added to the SSH agent.
        If using HTTPS, set your GitHub username and Personal Access Token (PAT) appropriately.

    Adjust Push Interval (optional): You can configure the push interval by modifying the pushInterval setting in your settings.json file (default is set to 30 minutes):

    {
        "forkActivityTracker.pushInterval": 30
    }

Usage

    Open a folder containing a Git repository in Visual Studio Code.
    Make changes to your files as usual.
    The extension will monitor file saves and track changes.
    Commits will be automatically created and pushed to the forked-changes repository at the specified interval.

Contribution

Feel free to fork the repository and submit pull requests for any improvements or new features. If you encounter any issues, please open an issue in the GitHub repository.
License

This project is licensed under the GPL3 License. See the LICENSE file for details.
Acknowledgments

    Thanks to the Visual Studio Code team for providing an amazing platform for extensions.
    Special thanks to the Git community for their tools and libraries that made this extension possible.

Contact

For questions or feedback, please reach out to harveyjay@tuta.io.


### Key Sections of the README:
- **Overview**: A brief description of what the extension does.
- **Features**: Highlighting the key functionalities of the extension.
- **Installation**: Step-by-step guide on how to set up the extension.
- **Configuration**: Instructions for creating the `forked-changes` repository and setting up SSH or HTTPS.
- **Usage**: A brief explanation of how to use the extension.
- **Contribution**: Information on how others can contribute to the project.
- **License**: Licensing information.
- **Contact**: How users can get in touch for questions or feedback.

You can modify this template according to your needs or preferences. If you have any specific information you'd like to add or change, let me know!
