using System.Web;
using System.Web.Mvc;

namespace Sistema_Venta_Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new Core.Filter.CustomAuthorizeAttribute());
        }
    }
}
