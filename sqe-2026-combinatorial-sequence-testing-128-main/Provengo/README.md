# Testing PrestaShop using Provengo
This directory contains the Provengo project for testing the checkout module of PrestaShop.

## Visual Studio Code Plugin
We recommend using the official [Provengo Studio](https://marketplace.visualstudio.com/items?itemName=Provengo.provengo) extension for Visual Studio Code to work with Provengo projects. It provides better navigation within a project, GUI for selecting profiles and invoking provengo commands, and access to help, reference materials, and other useful resources.

To use the extension, open the `Provengo/provengo_project` folder in Visual Studio Code after installing the extension.

![](https://content.provengo.tech/files/ide-preview.png)

## Tool Documentation
See [Provengo README](helloprovengo/README.md) for a short description of the tool and how to use it.

For a full documentation go to [https://docs.provengo.tech](https://docs.provengo.tech).

This page includes 
[tutorials](https://provengo.github.io/Tutorials/Tutorials/0.9.5/index.html) and an [online Course](https://provengo.github.io/Course/Online%20Course/0.9.5/#tutorials/welcome.adoc). The full api documentation is at the menu on the left. Specifically, you'll might find interest in the following sections:
- [BP-Base](https://docs.provengo.tech/ProvengoCli/0.9.5/dsls/bp-base.html) - the base library for behavioral programming in JavaScript.
- [Libraries](https://docs.provengo.tech/ProvengoCli/0.9.5/libraries/index.html) - documentation of all the libraries that come with Provengo (e.g., Combi, Constraints, Control, Selenium, etc.).

## Project Structure
The Provengo project is in the [provengo_project](provengo_project) directory.

- `data` directory: contains the test data files. These files are loaded before all other files.
- `spec/js` directory: contains the specification files, including the [behavior.js](provengo_project/spec/js/behavior.js) and [actions.js](provengo_project/spec/js/actions.js) files.
- `spec/disabled` directory: contains disabled specification files that are not currently used.
- `meta-spec` directory: contains meta-specification files, including the ensemble code file that you will use for specifying the coverage criteria.
- `products` directory: contains the generated products, including the test suites and samples.

## Running the tests
Click the "Run" button in the Provengo Studio extension, or run the following command in the terminal.
```shell 
provengo run --show-sessions
```

To see all possible options, run:
```shell
provengo run -h
```

## Generating a graph of the model
To generate a PDF graph of the model, run the following command in the terminal.
```shell
provengo analyze -f PDF
```
You may use the `--max-depth` option to limit the depth of the generated graph (if it's too large). To see all possible options, run:
```shell
provengo analyze -h
```
