using System;
using System.Collections.Generic;
using System.IO;

using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.DB;
using DesignAutomationFramework;

namespace SketchIt
{
   [Autodesk.Revit.Attributes.Regeneration(Autodesk.Revit.Attributes.RegenerationOption.Manual)]
   [Autodesk.Revit.Attributes.Transaction(Autodesk.Revit.Attributes.TransactionMode.Manual)]
   class SketchItApp : IExternalDBApplication
   {
      public ExternalDBApplicationResult OnStartup(Autodesk.Revit.ApplicationServices.ControlledApplication app)
      {
         DesignAutomationBridge.DesignAutomationReadyEvent += HandleDesignAutomationReadyEvent;
         return ExternalDBApplicationResult.Succeeded;
      }

      public ExternalDBApplicationResult OnShutdown(Autodesk.Revit.ApplicationServices.ControlledApplication app)
      {
         return ExternalDBApplicationResult.Succeeded;
      }

      public void HandleDesignAutomationReadyEvent(object sender, DesignAutomationReadyEventArgs e)
      {
         // Run the application logic.
         SketchItFunc(e.DesignAutomationData);

         e.Succeeded = true;
      }

      private static void SketchItFunc(DesignAutomationData data)
      {
         if (data == null)
            throw new InvalidDataException(nameof(data));

         Application rvtApp = data.RevitApp;
         if (rvtApp == null)
            throw new InvalidDataException(nameof(rvtApp));

         Document newDoc = rvtApp.NewProjectDocument(UnitSystem.Imperial);
         if (newDoc == null)
            throw new InvalidOperationException("Could not create new document.");
         string filePath = "sketchIt.rvt";

         string filepathJson = "SketchItInput.json";
         SketchItParams jsonDeserialized = SketchItParams.Parse(filepathJson);

         CreateWalls(jsonDeserialized, newDoc);

         CreateFloors(jsonDeserialized, newDoc);

         newDoc.SaveAs(filePath);
      }

      private static void CreateWalls(SketchItParams jsonDeserialized, Document newDoc)
      {
         FilteredElementCollector levelCollector = new FilteredElementCollector(newDoc);
         levelCollector.OfClass(typeof(Level));
         ElementId someLevelId = levelCollector.FirstElementId();
         if (someLevelId == null || someLevelId.IntegerValue < 0) throw new InvalidDataException("ElementID is invalid.");

         List<Curve> curves = new List<Curve>();
         foreach (WallLine lines in jsonDeserialized.Walls)
         {
            XYZ start = new XYZ(lines.Start.X, lines.Start.Y, lines.Start.Z);
            XYZ end = new XYZ(lines.End.X, lines.End.Y, lines.End.Z);
            curves.Add(Line.CreateBound(start, end));
         }

         using (Transaction wallTrans = new Transaction(newDoc, "Create some walls"))
         {
            wallTrans.Start();

            foreach (Curve oneCurve in curves)
            {
               Wall.Create(newDoc, oneCurve, someLevelId, false);
            }

            wallTrans.Commit();
         }
      }

      private static void CreateFloors(SketchItParams jsonDeserialized, Document newDoc)
      {
         foreach (List<Point> floorPoints in jsonDeserialized.Floors)
         {
            CurveArray floor = new CurveArray();
            int lastPointOnFloor = floorPoints.Count - 1;

            for (int pointNum = 0; pointNum <= lastPointOnFloor; pointNum++)
            {
               XYZ startPoint = new XYZ(floorPoints[pointNum].X, floorPoints[pointNum].Y, floorPoints[pointNum].Z);
               XYZ endPoint;

               if (pointNum == lastPointOnFloor)
               {
                  endPoint = new XYZ(floorPoints[0].X, floorPoints[0].Y, floorPoints[0].Z);
               }
               else
               {
                  endPoint = new XYZ(floorPoints[pointNum + 1].X, floorPoints[pointNum + 1].Y, floorPoints[pointNum + 1].Z);
               }

               Curve partOfFloor = Line.CreateBound(startPoint, endPoint);
               floor.Append(partOfFloor);
            }

            using (Transaction floorTrans = new Transaction(newDoc, "Create a floor"))
            {
               floorTrans.Start();
               newDoc.Create.NewFloor(floor, false);
               floorTrans.Commit();
            }
         }
      }
   }
}
