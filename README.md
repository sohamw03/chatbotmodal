# Pipeline

- Pull any changes from the git repository `git pull`.
- Navigate to the chatbot folder `yarn build`.

It will create an optimized build in build folder. The website will be updated automatically.

# Updating API key

- Insert your API key into `D:\chatbotmodal\.env`.
- Run `yarn build`.

# In case of system restart

- Navigate to `C:\nginx\` using powershell as admin.
- Run `start nginx`.
- Check if nginx is running `tasklist /fi "imagename eq nginx.exe"`.

Refer to [Nginx](https://nginx.org/en/docs/windows.html) docs for more details.
