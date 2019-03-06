# SketchIt Sample

![Platforms](https://img.shields.io/badge/Plugins-Windows-lightgray.svg)
![.NET](https://img.shields.io/badge/.NET%20Framework-4.7-blue.svg)
[![Revit](https://img.shields.io/badge/Revit-2019-lightblue.svg)](http://developer.autodesk.com/)

## Description

SketchIt is an application that creates walls and floors in a rvt file. It takes a JSON file that specifies the walls and floors to be created, and outputs a new rvt file.

# Setup

## Prerequisites

1. **Visual Studio** 2017
2. **Revit** 2019 required to compile changes into the plugin
3. **7z zip** requires to create the bundle ZIP, [download here](https://www.7-zip.org/)

## References

This Revit plugin requires **RevitAPI** and **DesignAutomationBridge** references. The `Reference Path` option should point to the folder.

![](./reference_path.png)


## Building SketchIt.sln

Clone this repository and open `SketchIt.sln` in Visual Studio.

Right-click on References, then Add Reference and Browse for RevitAPI.dll (by default under _C:\Program Files\Autodesk\Revit 201x_ folder). Then right-click on this RevitAPI reference, go to Properties, then set Copy Local to False.

Then right-click on the project, go to Manage NuGet Packages..., under Browser you can search for DesignAutomation.Revit and install _Autodesk.Forge.DesignAutomation.Revit_ (choose the appropriate Revit version you need). Then search and install _Newtonsoft.Json_ (which is used to parse input data in JSON format).

Please check Include prerelease while searching for packages. Design Automation for Revit is in beta (as of Jan/2019). 

In the SketchIt C# project, repair the references to `DesignAutomationBridge`, `Newtonsoft JSON framework` and `RevitAPI`.  You can do this by removing and re-adding the references, or by opening the `SketchIt.csproj` for edit and manually updating the reference paths.

Build `SketchIt.sln` in `Release` or `Debug` configuration.

## Creating and Publishing the Appbundle

Create an `appbundle` zip package from the build outputs and publish the `appbundle` to Design Automation.

The `JSON` in your appbundle POST should look like this:
```json
{
  "id": "SketchItApp",
  "engine": "Autodesk.Revit+2019",
  "description": "SketchIt appbundle based on Revit 2019"
}
```
Notes:
* `engine` = `Autodesk.Revit+2019` - A list of engine versions can be found [here](https://forge.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step4-publish-appbundle/#engine-version-aliases).

After you upload the `appbundle` zip package, you should create an alias for this appbundle. The `JSON` in the POST should look like this:
```json
{
  "version": 1,
  "id": "test"
}
```

> **The instructions for these steps and more about `appbundle` are [here](https://forge.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step4-publish-appbundle/)**.

## Creating the Activity

Define an `activity` to run against the `appbundle`.

The `JSON` that accompanies the `activity` POST will look like this:

```json
{
   "id": "SketchItActivity",
   "commandLine": [ "$(engine.path)\\\\revitcoreconsole.exe /al $(appbundles[SketchItApp].path)" ],
   "parameters": {
      "sketchItInput": {
         "zip": false,
         "ondemand": false,
         "verb": "get",
         "description": "SketchIt input parameters",
         "required": true,
         "localName": "SketchItInput.json"
      },
      "result": {
         "zip": false,
         "ondemand": false,
         "verb": "put",
         "description": "Results",
         "required": true,
         "localName": "sketchIt.rvt"
      }
   },
   "engine": "Autodesk.Revit+2019",
   "appbundles": [ "YourNickname.SketchItApp+test" ],
   "description": "Creates walls and floors from an input JSON file."
}
```
Notes:
*  `engine` = `Autodesk.Revit+2019` - A list of engine versions can be found [here](https://forge.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step4-publish-appbundle/#engine-version-aliases).
*  `YourNickname` - The owner of appbundle `SketchItApp`. More information can be found [here](https://forge.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step3-create-nickname/).

Then you should create an alias for this activity. The `JSON` in the POST should look like this:
```json
{
  "version": 1,
  "id": "test"
}
```

> **The instructions for these steps and more about `activity` are [here](https://forge.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step5-publish-activity/)**.

## POST a WorkItem

Now POST a `workitem` against the `activity` to run a job on your `appbundle`.

The `JSON` that accompanies the `workitem` POST will look like this:

```json
{
  "activityId": "YourNickname.SketchItActivity+test",
  "arguments": {
    "sketchItInput": {
      "url": "data:application/json,{ 'walls': [ {'start': { 'x': -100, 'y': 100, 'z': 0.0}, 'end': { 'x': 100, 'y': 100, 'z': 0.0}}, {'start': { 'x': -100, 'y': 100, 'z': 0.0}, 'end': { 'x': 100, 'y': 100, 'z': 0.0}}, {'start': { 'x': 100, 'y': 100, 'z': 0.0}, 'end': { 'x': 100, 'y': -100, 'z': 0.0}}, {'start': { 'x': 100, 'y': -100, 'z': 0.0}, 'end': { 'x': -100, 'y': -100, 'z': 0.0}}, {'start': { 'x': -100, 'y': -100, 'z': 0.0}, 'end': { 'x': -100, 'y': 100, 'z': 0.0}}, {'start': { 'x': -500, 'y': -300, 'z': 0.0}, 'end': { 'x': -300, 'y': -300, 'z': 0.0}}, {'start': { 'x': -300, 'y': -300, 'z': 0.0}, 'end': { 'x': -300, 'y': -500, 'z': 0.0}}, {'start': { 'x': -300, 'y': -500, 'z': 0.0}, 'end': { 'x': -500, 'y': -500, 'z': 0.0}}, {'start': { 'x': -500, 'y': -500, 'z': 0.0}, 'end': { 'x': -500, 'y': -300, 'z': 0.0}}],'floors' : [ [{'x': -100, 'y': 100, 'z':0.0}, {'x': 100, 'y': 100, 'z': 0.0}, {'x': 100, 'y': -100, 'z': 0.0}, {'x': -100, 'y': -100, 'z': 0.0}], [{'x': -500, 'y': -300, 'z':0.0}, {'x': -300, 'y': -300, 'z': 0.0}, {'x': -300, 'y': -500, 'z': 0.0}, {'x': -500, 'y': -500, 'z': 0.0}] ]}"
    },
    "result": {
      "verb": "put",
      "url": "https://myWebsite/signed/url/to/sketchIt.rvt"
    }
  }
}
```
Notes:
* `YourNickname` - The owner of activity `SketchItActivity`. More information can be found [here](https://forge.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step3-create-nickname/).

> **The instructions for this step and more about `workitem` are [here](https://forge.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step6-post-workitem/)**.

`SketchItActivity` expects an input file `SketchItInput.json`. The contents of the embedded JSON are stored in a file named `SketchItInput.json`, as specified by the `parameters` of `sketchItInput` in the activity `SketchItActivity`. The SketchIt application reads this file from current working folder, parses the JSON and creates walls and floors from the extracted specifications in a new created Revit file `sketchIt.rvt`, which will be uploaded to `url` you provide in the workitem.

The function `SketchItFunc` in [SketchIt.cs](SketchItApp/SketchIt.cs) performs these operations.

# Further Reading

- [My First Revit Plugin](https://knowledge.autodesk.com/support/revit-products/learn-explore/caas/simplecontent/content/my-first-revit-plug-overview.html)
- [Revit Developer Center](https://www.autodesk.com/developer-network/platform-technologies/revit)

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.
