#Updated React.js and Spring Data REST tutorial (March 2024)

#Introduction
The original tutorial here [https://spring.io/guides/tutorials/react-and-spring-data-rest/](https://spring.io/guides/tutorials/react-and-spring-data-rest/) is outdated. Latest code update is from April 2020 and it simply does not work with the latest versions of Spring and other dependencies. I managed to run it and updated all the dependencies.

#Build
Build from command line: `mvn clean package`

#Run the server from command line
1. From command like this `java -jar spring-rest-react-jpa-0.0.1-SNAPSHOT.jar`
2. From eclipse open and run this class: `com.greglturnquist.payroll.ReactAndSpringDataRestApplication`
3. Webapp will be available by this link [http://localhost:8080](http://localhost:8080)


#Update all dependencies to the latest versions:
1. Check the latest version of `spring-boot-starter-parent` artifact and update it if needed in `pom.xml` inside `<parent>` tag.
2. Check in the google for latest stable version of node.js or here [https://nodejs.org/en/download](https://nodejs.org/en/download) (LTS version).
3. Update node.version and npm.version to the values from step 1 above.
4. Get latest stable version of frontend-maven-plugin here [https://github.com/eirslett/frontend-maven-plugin/tags](https://github.com/eirslett/frontend-maven-plugin/tags)
5. Update `frontend-maven-plugin.version` to the values from step 3 above.
6. Go to folder `target\node` and run `npm install npm-check-updates`
7. Copy file `package.json` from root of the project to `target\node` folder
8. Run `.\node_modules\.bin\ncu --format group` from folder `target\node`.
It will return list of modules to update like this

```
Minor   Backwards-compatible features
 @babel/core          ^7.10.5  →  ^7.22.20
 @babel/preset-env    ^7.10.4  →  ^7.22.20
 @babel/preset-react  ^7.10.4  →  ^7.22.15

Major   Potentially breaking API changes
 babel-loader   ^8.1.0  →   ^9.1.3
 webpack       ^4.43.0  →  ^5.88.2
 webpack-cli   ^3.3.12  →   ^5.1.4
 ```
 
9. Update versions in `package.json` in the root of the project (not inside `target\node`) manually.
