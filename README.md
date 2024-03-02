# Flask MongoDB TypeScript Docker Template

This template is tailored for upcoming hackathons and is available for projects where my direct involvement is not anticipated. To maintain confidentiality, please keep the template information between us. While NodeJS is often suggested as a default, Python, with its widely-known syntax and faster development cycle, offers a compelling alternative.

## Pre-Requisites

- [Node JS](https://nodejs.org/en/download/current)
- [Python](https://www.python.org/)
- [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)

## Backend Setup

1. Navigate into the "backend" folder:

    ```bash
    cd backend
    ```

2. Create and activate the virtual environment:

    ```bash
    python3 -m venv venv
    source venv/bin/activate # On Unix/Mac
    venv\Scripts\activate # On Windows, should see (venv) in front of terminal
    ```
   
    **Possible WINDOWS error:** Cannot load script due to Execution Policy.
    
    - **Solution:** Open PowerShell and execute the following:
        
        ```powershell
        Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
        ```

3. Download pip packages:

    ```bash
    pip install -r requirements.txt
    ```

4. Start HACKING!!

    ```bash
    docker-compose up --build
    ```
   
    **Possible WINDOWS error:** Docker daemon is not running.
    
    - **Solution:** Open Docker Desktop.

## Docker Notes

Docker is a platform that uses containerization to package applications and their dependencies for seamless deployment across various environments. It ensures consistency, portability, and efficiency by isolating applications in lightweight, standalone **containers**. Docker facilitates easy scaling, aligns with DevOps practices, and boasts a robust community and ecosystem. It has become a key tool in modern software development, streamlining the development-to-deployment process.

## Backend Notes

1. Ensure that you are operating within the virtual environment (venv) in the terminal.

2. Every time you install a new Python package, and before each commit involving a new package, run the following command:

    ```bash
    pip freeze > requirements.txt
    ```

    - **Quick Explanation:** The virtual environment (venv) is separate from your local computer. By activating it, you ensure that only the necessary packages for your project are installed. Running the above command captures the current state of installed packages and updates the `requirements.txt` file, making it easier to manage dependencies. This practice helps maintain a clean and project-specific environment.

3. Avoid using AUTOSAVE. Every time you save, the Flask app will be rerun. If autosave is on, it may save in the middle of your code writing, causing syntax errors. This forces you to run `docker-compose up` again, becoming very tedious.

## Suggested Backend Tools

- **Postman:**
    - Allows testing of each backend endpoint easily, simulating how it would work in production.

## Frontend Setup

1. Install npm packages:

    ```bash
        npm install
        npm install -D tailwindcss
        npx tailwindcss init
    ```

2. START HACKING!
    - Split Terminals
    ```bash
        npm run start
    ```
    ```bash
        npx tailwindcss -i ./src/tailwind.css -o ./src/dist/output.css --watch
    ```
Possible Error: ENOENT: no such file or directory, lstat 'C:\Users\Athavan Thambimuthu\AppData\Roaming\npm'
Solution: npm install npm -g

