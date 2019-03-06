# design.automation-nodejs-sketchIt

[![Node.js](https://img.shields.io/badge/Node.js-8.0-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-4.0-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/Web-Windows%20%7C%20MacOS%20%7C%20Linux-lightgray.svg)
[![Design-Automation](https://img.shields.io/badge/Design%20Automation-v3-green.svg)](http://developer.autodesk.com/)


![Windows](https://img.shields.io/badge/Plugins-Windows-lightgrey.svg)
![.NET](https://img.shields.io/badge/.NET%20Framework-4.7-blue.svg)
[![Revit-2019](https://img.shields.io/badge/Revit-2019-lightgrey.svg)](http://autodesk.com/revit)


![Advanced](https://img.shields.io/badge/Level-Advanced-red.svg)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)

# Description

This NodeJS app demonstrates an end to end use case for external developers using Design Automation for Revit. In addition to using Design Automation for Revit REST APIs, this app also leverages other Autodesk Forge services like Data Management API (OSS), Viewer API and Model Derivative services.

The sketcher is built using Redux with React and makes use of Flux architecture extensively.

# Thumbnail
![thumbnail](/public/res/thumbnail.png)


# Main Parts of The Work
1. Create a Revit Plugin to be used within AppBundle of Design Automation for Revit. Please check [PlugIn](./revit/README.md) 
2. Create your App, upload the AppBundle, define your Activity and test the workitem with the Postman collection under [Postman Collection](./revit/PostmanCollection/) 

3. Create the Web App to call the workitem.

# Web App Setup

## Prerequisites

For using this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use **http://localhost:3000/api/forge/callback/oauth** as Callback URL, although is not used on 2-legged flow. Finally take note of the **Client ID** and **Client Secret**.

1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). 
2. **Visual Code**: Visual Code (Windows or MacOS).
3. **ngrok**: Routing tool, [download here](https://ngrok.com/)
4. **Revit 2019**: required to compile changes into the plugin
5. **JavaScript ES6** syntax for server-side.
6. **JavaScript** basic knowledge with **jQuery**
7. **React & Redux & Flux** framework architecture 

## Running locally

Install [NodeJS](https://nodejs.org), version 8 or newer.

Clone this project or download it (this `nodejs` branch only). It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone -b nodejs https://github.com/jaimerosales/design.automation-nodejs-sketchIt.git

To run it, install the required packages, set the enviroment variables with your Client ID, Secret, Bucket Key and Nickname value and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    export FORGE_BUCKET_KEY=<<YOUR UNIQUE BUCKET KEY>>
    export FORGE_NICKNAME=<<YOUR DESIGN AUTOMATION NICKNAME>>
    npm start

Windows (use **Node.js command line** from Start menu)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    set FORGE_BUCKET_KEY=<<YOUR UNIQUE BUCKET KEY>>
    set FORGE_NICKNAME=<<YOUR DESIGN AUTOMATION NICKNAME>>
    npm start

Open the browser: [http://localhost:3000](http://localhost:3000).

### Start the app
Open the browser: [http://localhost:3000](http://localhost:3000), 

Steps to use the app

## Further Reading

Documentation:

- [Design Automation API](https://forge.autodesk.com/en/docs/design-automation/v3/developers_guide/overview/)
- [Data Management API](httqqqps://developer.autodesk.com/en/docs/data/v2/overview/)

Desktop APIs:

- [Revit](https://knowledge.autodesk.com/support/revit-products/learn-explore/caas/simplecontent/content/my-first-revit-plug-overview.html)

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by


Jaime Rosales D. [![Twitter Follow](https://img.shields.io/twitter/follow/afrojme.svg?style=social&label=Follow)](https://twitter.com/AfroJme) 

[Forge Partner Development](http://forge.autodesk.com)