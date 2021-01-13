# Table of Contents
- [Project Setup (Continued)](#Project-Setup-(Continued))
  - [Running the Front-End](##Running-the-Front-End)
  - [Getting Your IDE Set Up to Use ESLint](##Getting-Your-IDE-Set-Up-to-Use-ESLint)
    - [VS Code](###VS-Code)
    - [Atom](###Atom)
- [Folder Structure](#Folder-Structure)
- [Storybook](#Storybook)
- [Testing](#Testing)
- [Creating a New Component](#Creating-a-New-Component)

# Project Setup (Continued)
## Running the Front-End
- `cd` into the `app` directory
- Run the following command to install all of the necessary dependencies: 
      
      yarn
  - If you are new to `yarn`, it is very similar to `npm`
  - If you are new to both `yarn` and `npm`, this article explains what `npm` is: https://www.w3schools.com/whatis/whatis_npm.asp
  - Also, here's a link to `yarn` documentation: https://yarnpkg.com/lang/en/
- Run the following command to start the front-end: 

      yarn start
- Run the following command to start Storybook:

      yarn storybook
  - Here's a link to explaining what Storybook is: https://storybook.js.org/docs/basics/introduction/
- Everything should be running smoothly at this point, but in order to get the full functionality of the app, make sure to run the back-end code as well
  - Check out how to run that [here](../server/README.md)

## Set up environment variables
In order for AFFORDABLE to the URL, you must define the url by creating `.env` file in the `app` folder. Change the value to be appropriate for your environment/deployment.

`.env`:
```
REACT_APP_AF_BACKEND_URL=http://localhost:4000
```

## Getting Your IDE Set Up to Use ESLint
> Linting is the process of running a program that will analyse code for potential errors. *-User Oded from StackOverflow*

The front-end has been set up to use ESLint in order to analyze written code for syntax errors as well as styling errors.

In order to keep consistent styling within the code base, ESLint should be run before any commit made to make sure you are following proper code style.

To make this easier to use, certain IDEs allow the user to enable ESLint checking as the user types. It also allows users to automatically fix any easy-fix lint errors.

### VS Code
- Go to the Extentsions tab
- Search and download ESLint extension
- Add key binding to "ESLint: Fix all auto-fixable Problems"
  - Click the Settings icon
  - Click "Keyboard Shortcuts"
  - Search "ESLint"
  - Click "ESLint: Fix all auto-fixable Problems"
  - Add your key binding (Recommended is ALT + Shift + e)
- All set!

### Atom
- Go to "Preferences"
- Select the "Install" tab
- Search for "linter-eslint"
- Download BOTH "linter" and "linter-eslint"
- To auto-fix ESLint errors on save
  - Go to your "Settings" and select the "Packages" tab
  - Find the installed linter-eslint and go to its settings
  - Check the Fix errors on save options
- All set!

# Folder Structure
## `.storybook`
- Configuration files for Storybook
## `node_modules`
- All installed dependencies
- Should NOT be saved in version control (ie should NOT show up in GitLab)
## `public`
- Static files for website (such as `index.html`)
## `src`
- Front-end code
  ### `components`
  * NOTE: The following are guidelines moving forward. Unfortunately, Some components don't follow this structure quite yet :(
  * Home to “core” components
      * “core” means components used repeatedly throughout the website (such as TextInput)
  * Each component has its own folder
      * Each folder houses at least four files
          * `index.js`
              * Main code
          * `index.spec.js`
              * Testing code
          * `index.story.js`
              * Storybook code
          * `<component-name>.scss`
              * Sass file (lives under the `scss` folder in the component folder)
              * Should follow BEM model (http://getbem.com/naming/)
                * Look at [text-input.scss](src/components/TextInput/scss/text-input.scss) for an example
      * Components can contain other “helper” files
          * These “helper” files can be other components
          * If a helper component is created and needs styling, create another scss file within the `scss` folder

  ### `pages`
  * Home to “page” components
      * “page” means a complete web page a client would see
  * Any folders in this directory ending with the word “…Pages” (such as AuthPages) actually houses multiple Pages
  * Any folders that do not have the ending “…Pages” house code
      * These folders are similar in structure to folders found in `components`
      * Houses at least two files
          * `index.js`
              * Main code
          * `<page-name>.scss`
              * Sass file (lives under the `scss` folder in the component folder)
      * Pages can contain other “helper” files
          * These “helper” files can be other components
          * If a helper component is created and needs styling, create another scss file within the `scss` folder
## `stories`
- index.js file that imports all story files from `components` and renders them in Storybook
## `styles`
- should be removed in a bit but currently houses some css files (theoretically, every component/page should contain its own scss files)


# Storybook
If you still haven't taken a look at the Storybook documentation ([here](https://storybook.js.org)), basically, Storybook is a framework that allows developers to build andd maintain a component library. This should allow Affordable to create more reusable components and to develop faster while also lowering the amount of tech debt we accumulate moving forward.

Enter the following command to run Storybook:

      yarn storybook


# Testing
Jest is used as our testing framework.

Read through their documentation here: https://jestjs.io

# Creating a New Component
In order to create a new component, just copy and paste the `TemplateComponent` folder within `components` and rename everything labeled "TemplateComponent" to your desired component name.

IMPORTANT: Remember to import the newly-created story file to the `index.js` in the `stories` folder or else it won't show up in Storybook