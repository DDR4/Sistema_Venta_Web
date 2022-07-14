using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;


namespace SVW.Common
{
   public class ConfigurationUtilities
    {
        public static string GetConnectionString()
        {
            var value = ConfigurationManager.ConnectionStrings[Constants.ConfigurationKeys.ConnectionString];

            if (value != null)
            {
                return value.ConnectionString;
            }
            return default(string);
        }
        public static string GetAppSettings(string key)
        {
            var value = ConfigurationManager.AppSettings[key];

            if (value != null)
            {
                return value.ToString();
            }
            return default(string);
        }


        public static Object ErrorCatchDataTable(Exception ex)
        {
            var response = (new
            {
                draw = 0,
                recordsTotal = 0,
                recordsFiltered = 0,
                data = new object[0],
                error = ex.Message
            });
            return response;
        }
    }
}
