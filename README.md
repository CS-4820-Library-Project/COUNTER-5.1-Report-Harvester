# COUNTER-5.1-Report-Tool

This project helps libraries to harvest and manage their Project COUNTER-compliant usage reports. Leveraging TypeScript, it processes JSON data to generate TSV reports adhering to the COUNTER 5.0 and COUNTER 5.1 standards. Developed within the Electron framework to craft a user-friendly GUI for seamless interaction. 

# Licence
It is released with all students' permission under the MIT License for open-source software.

# Features
* Manage library vendor credentials
* Fetch reports that adhere to COUNTER 5.0 and COUNTER 5.1 standards
* Retrieve customized reports by utilizing the parameters provided in the SUSHI API.
* Quickly fetch year-to-date or full previous year reports from all vendors with just one click.
* Choose and download specific reports from selected vendors with customizable attributes and date ranges.
* Search the SQLite database for reports
* Recover and Reconstruct the SQLite database in case of corruption.
* Settings feature enables users to set up passwords to encrypt the vendor data, change report-saving directories and change API request settings

# Developer Contact Info - original developers
* Isaac Garcia igarcia10328@upei.ca
* William MacKinnon wjmackinnon@upei.ca
* Japneet Kalkat jkalkat@upei.ca
* Albin Thomas athomas8036@upei.ca
* Kritikiran Angrish kangrish@upei.ca

# Future developer contact info
Melissa Belvadi, mbelvadi@upei.ca

# Download Project
https://github.com/CS-4820-Library-Project/COUNTER-5.1-Report-Harvester.git

# COUNTER Documentation
https://cop5.projectcounter.org/en/5.1/

# Setup instructions (windows)
* Open the command prompt and type: git clone 
https://github.com/CS-4820-Library-Project/COUNTER-5.1-Report-Harvester.git 

* Download and install the latest version of Node.js from the official website: Node.js
    * - https://nodejs.org/

* Open the command prompt and type cd
* Open the location where you cloned the project and drag the folder into the command prompt window. Your command prompt window should now show "C:\Users\NAME>cd 
  C:\Users\NAME\DOWNLOAD_LOCATION
* Hit Enter
* Install dependencies by typing the command: 
   * npm install
* Now type these commands:
   * npm start (To preview the production version)

# Developer Setup (using VSCode)
* Download and install Visual Studio Code from the official website: Visual Studio Code
* Download and install Git from the official website: Git
* Open VSCode and use the built-in terminal or the command prompt to clone the GitHub repository using the following command: git clone:
    * - https://github.com/CS-4820-Library-Project/COUNTER-5.1-Report-Harvester.git

* Once cloned, open the project folder in VSCode by dragging it into the VSCode window or using the File > Open Folder option.
* If Node.js is not already installed on the system, download and install it from the official website: Node.js
    * - https://nodejs.org/
* Recommended extensions:
    * Prettier
    * ESLint
    * Prisma
    * Simple React Snippets
    * SQLite Explorer
 
* Open a terminal within VSCode (or use the integrated terminal) and navigate to the project directory. 
* Then run the following command to install project dependencies:
   * npm install
* Now type these commands:
   * npx prisma generate (Create Prisma client)
   * npx prims migrate dev (To create a test database)
* After installing dependencies, preview the production application by running the following command: 
   * npm start

* To start the development environment and make changes in real-time, use the command: 
   * npm run dev (to build the project and start the development environment)
     
* For development mode:
   * Run the project in watch mode to automatically rebuild on file changes by typing: npm run dev
   * To package the application for distribution: npm run package
   * This will generate an executable file in the dist directory.
   * Modify any necessary settings in the configuration files provided.
   * If you encounter any issues, refer to the project's documentation

* This command will compile TypeScript code, start the Electron application, and open it for development. It uses electron vite, so all changes are reflected immediately in the application.

* You're all set! Start coding by modifying the project files in VSCode. Any changes you make will be automatically reflected in the running Electron application.
* That's it! You're now set up to develop and contribute to the project using Visual Studio Code.
  

 



