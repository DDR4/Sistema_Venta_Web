using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.DataAccess
{
    public static class Factory
    {
        private static string GetConnectionString()
        {
            try
            {
                var cnxKey = Common.ConfigurationUtilities.GetConnectionString();

                return cnxKey;
            }
            catch (Exception)
            {
                throw new Exception("Error al obtener la cadena de conexión.");
            }
        }

        public static Func<DbConnection> ConnectionFactory = () => new SqlConnection(GetConnectionString());
    }
}
