using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SketchIt
{

   internal class Point
   {
      [JsonProperty(PropertyName = "x")]
      public double X { get; set; } = 0.0;
      [JsonProperty(PropertyName = "y")]
      public double Y { get; set; } = 0.0;
      [JsonProperty(PropertyName = "z")]
      public double Z { get; set; } = 0.0;
   }
   internal class WallLine
   {
      [JsonProperty(PropertyName = "start")]
      public Point Start { get; set; }
      [JsonProperty(PropertyName = "end")]
      public Point End { get; set; }
   }



   internal class SketchItParams
   {
      [JsonProperty(PropertyName = "walls")]
      public IList<WallLine> Walls { get; set; }
      [JsonProperty(PropertyName = "floors")]
      public IList<IList<Point>> Floors { get; set; }
      static public SketchItParams Parse(string jsonPath)
      {
         try
         {
            if (!File.Exists(jsonPath))
               return new SketchItParams();

            string jsonContents = File.ReadAllText(jsonPath);
            return JsonConvert.DeserializeObject<SketchItParams>(jsonContents);
         }
         catch (Exception ex)
         {
            Console.WriteLine("Exception happens when parsing the json file: " + ex);
            return null;
         }
      }
   }
}
