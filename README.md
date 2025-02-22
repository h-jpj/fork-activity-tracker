# Fork Activity Tracker Extension

The Fork Activity Tracker is a Visual Studio Code extension designed to help developers track their contributions to forked repositories. This extension automatically commits and pushes changes made in a forked repository to a designated "forked-changes" repository, ensuring that these contributions are reflected in your GitHub profile. This is designed for private repos, non-default branches, forked repos that are not merged and deleted repos.

## Features

- Automatically monitors and commits changes to the specified `forked-changes` repository.
- Copies modified files to the `forked-changes` directory that you cloned.
- Allows users to input their own remote repository URL.
- Generates detailed commit messages based on the changes made.
- Only works with SSH as of right now.

## Prerequisites

- Visual Studio Code
- Node.js (version 12 or later)
- Git

## Setup Instructions

1. **Create the `forked-changes` Repository**:
   - Go to GitHub and create a new repository called `forked-changes`. Make sure it is empty.

2. **Clone the Repository**:
   - Clone the `forked-changes` repository to a location above your current working repository (the repository you will be making changes to). For example:
     ```bash
     cd /path/to/your/projects
     git clone git@github.com:yourusername/forked-changes.git
     ```

3. **Install the Extension**:
   - Clone this repository containing the Fork Activity Tracker extension.
   - Open the cloned extension in Visual Studio Code.
   - Press `F5` to start the extension in a new Extension Development Host instance.

4. **Set Up the Remote URL**:
   - The first time you run the extension, you will be prompted to enter the SSH URL of your `forked-changes` repository. Use the following format:
     ```
     git@github.com:yourusername/forked-changes.git
     ```

## Usage

- As you work on files in your forked repository, the extension will automatically detect saved changes.
- It will copy modified files to the `forked-changes` repository and commit these changes with a generated message.
- You can configure the automatic commit interval through the extension settings in VS Code.

/path/to/your/projects

│
├── forked-changes
│   ├── .git
│   ├── README.md         
│   └── ...               
│
├── your-original-repo    
    ├── .git
    ├── src               
    │   ├── file1.c
    │   └── file2.c
    ├── README.md         
    └── ...    

## Important Notes

- Make sure that your `forked-changes` repository is accessible (i.e., ensure you have the correct SSH setup).
- If you encounter any issues, check the debug console in Visual Studio Code for error messages.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the open-source community for providing tools and resources to help build this extension.
