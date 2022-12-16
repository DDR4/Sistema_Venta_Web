using SVW.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace Sistema_Venta_Web.Controllers
{
    public class GastosController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetGasto(Gastos obj)
        {
            var ctx = HttpContext.GetOwinContext();
            var tipoUsuario = ctx.Authentication.User.Claims.FirstOrDefault().Value;
            obj.Auditoria = new Auditoria
            {
                TipoUsuario = tipoUsuario
            };

            string draw = Request.Form.GetValues("draw")[0];
            int inicio = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault());
            int fin = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault());

            obj.Operacion = new Operacion
            {
                Inicio = (inicio / fin),
                Fin = fin
            };

            var bussingLogic = new SVW.BusinessLogic.BLGastos();
            var response = bussingLogic.GetGastos(obj);

            var Datos = response.Data;
            int totalRecords = Datos.Any() ? Datos.FirstOrDefault().Operacion.TotalRows : 0;
            int recFilter = totalRecords;

            var result = (new
            {
                draw = Convert.ToInt32(draw),
                recordsTotal = totalRecords,
                recordsFiltered = recFilter,
                data = Datos
            });

            return Json(result);
        }

        public JsonResult InsertUpdateGasto(Gastos obj)
        {
            var bussingLogic = new SVW.BusinessLogic.BLGastos();

            obj.Auditoria = new Auditoria
            {
                UsuarioCreacion = User.Identity.Name,
                UsuarioModificacion = User.Identity.Name
            };

            var response = bussingLogic.InsertUpdateGastos(obj);

            return Json(response);
        }

        public JsonResult DeleteGasto(Gastos obj)
        {
            var bussingLogic = new SVW.BusinessLogic.BLGastos();

            obj.Auditoria = new Auditoria
            {
                UsuarioModificacion = User.Identity.Name
            };

            var response = bussingLogic.DeleteGastos(obj);

            return Json(response);
        }

    }
}