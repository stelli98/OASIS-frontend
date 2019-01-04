# OASIS-FrontEnd
Front-end side of OASIS, Blibli.com FUTURE 3.0 Phase 1 project. Developed using Jquery 

### Content
* [Related Repositories](#related-repositories)
* [Requirements](#requirements)
* [How to Run](#how-to-run)
* [TODO](#todo)

### Related Repositories
* Back End Repository
    - [https://github.com/jonathan016/OASIS-FE](https://github.com/jonathan016/OASIS-backend)

* Documentation Repository
    - [https://github.com/jonathan016/future-OASIS](https://github.com/jonathan016/future-OASIS) (To be migrated to this repository soon)



### Requirements
* [Nginx 1.14.0] (http://nginx.org/en/download.html)
* [NPM 6.4.1] (https://nodejs.org/en/download/) :
  - [Jquery 3.3.1] (https://code.jquery.com/) 
  - [Sass  4.11.0] (https://www.npmjs.com/package/node-sass)

### How to Run
- Install the requirements first
- Run command prompt (Windows)
- Clone the repository with the following command:
   ```
   git clone git@github.com:https://github.com/stelli98/OASIS-frontend.git 
  ```
- Put Oasis folder inside the nginx 1.14.0 folder or you can change the project path in nginx.conf file (nginx 1.14.0>conf>nginx.conf)
- Install all the depedencies that are listed in package.json using command : 
   ```
   npm install init 
   ```
- Run nginx
- Open your browswer and type "localhost" (Make sure you already started the tomcat and mongoDB, for details, you can check in backend repository--link above-- )
    
### TODO
* Make proper unit tests using mocha, karma, and chai 
* Make a proper SPA
* Refactor code to follow design patterns