# Project Overview

This is a project to demonstrate how to use bcrypt for securing passwords. 


## How to run   

After downloading the project, run following command:  
**npm install**

This will download all the dependencies for this app.

You also need to install mongodb locally.

In order to start the server, run following command:  
**node index.js**

Now you can open a browser and enter this url:  
**localhost:3000/register**

##  How to verify

After you enter username and password in the register page, you can verify the user created in mongodb.

Open mongodb shell:  
**mongodb**

Run following commands in mongodb:  
**use authdemo**  
**collections.users.find()**  


