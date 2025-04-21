# P4 Project

This project contains the source code and necessary files. The zipped version of this project (`P4.zip`) excludes certain files and folders to reduce size and avoid redundancy. Below are the details and setup instructions.

## Excluded Files/Folders
The following items are intentionally omitted from the zip file to keep it lightweight:
- **`node_modules/`**: 
- **`.pkl` files**: 

## Setup Instructions
To run this project, follow these steps after unzipping `P4.zip`:


### Steps
1. **Unzip the Project**
   - Extract `P4.zip` to a folder of your choice.

2. **Generate `.pkl` Files**
   - Open the model file in Jupyter Notebook (`movie_rec_sys.ipynb`).
   - Run all cells in the notebook to train the model and export the `.pkl` files.
   - The `.pkl` files will be saved in `models/` folder or current directory

3. **Install Node.js Dependencies**
   - Open a terminal and navigate to the project folder (e.g., `cd path\to\P4`).
   - Run the following command to install the required Node.js dependencies:
     ```bash
     npm install