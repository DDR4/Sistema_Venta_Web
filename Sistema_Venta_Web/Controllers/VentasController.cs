using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using SVW.Common;
using SVW.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sistema_Venta_Web.Controllers
{
    public class VentasController : Controller
    {
        // GET: Ventas
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetVentas(Ventas obj)
        {
            try
            {
                var ctx = HttpContext.GetOwinContext();
                var tipoUsuario = ctx.Authentication.User.Claims.FirstOrDefault().Value;

                string draw = Request.Form.GetValues("draw")[0];
                int inicio = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault());
                int fin = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault());

                obj.Auditoria = new Auditoria
                {
                    TipoUsuario = tipoUsuario
                };
                obj.Operacion = new Operacion
                {
                    Inicio = (inicio / fin),
                    Fin = fin
                };

                var bussingLogic = new SVW.BusinessLogic.BLVentas();
                var response = bussingLogic.GetVentas(obj);

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
            catch (Exception ex)
            {
                return Json(SVW.Common.ConfigurationUtilities.ErrorCatchDataTable(ex));
            }

        }

        public JsonResult InsertUpdateVentas(List<Ventas> productosSeleccionados)
        {
            var bussingLogic = new SVW.BusinessLogic.BLVentas();

            int response = 0;

            foreach (var item in productosSeleccionados)
            {
                Ventas obj = new Ventas();
                obj.Producto = new Producto
                {
                    Producto_Id = item.Producto.Producto_Id
                };               
                obj.Venta_Cantidad = item.Venta_Cantidad;
                obj.Venta_Precio = item.Venta_Precio;
                obj.Venta_Descuento = item.Venta_Descuento;
                obj.Venta_Precio_Total = item.Venta_Precio_Total;
                obj.TipoVenta = new TipoVenta
                {
                    TipoVenta_Id = item.TipoVenta.TipoVenta_Id
                };
                obj.TipoPago = new TipoPago
                {
                    TipoPago_Id = item.TipoPago.TipoPago_Id
                };
                obj.Auditoria = new Auditoria
                {
                    UsuarioCreacion = User.Identity.Name
                };
                response = bussingLogic.InsertUpdateVentas(obj).Data;               
            }
            Response<int> result = new Response<int>(response);
            return Json(result);
        }

        public JsonResult DeleteVentas(Ventas obj)
        {
            var bussingLogic = new SVW.BusinessLogic.BLVentas();
            obj.Auditoria = new Auditoria
            {
                UsuarioModificacion = User.Identity.Name
            };
            var response = bussingLogic.DeleteVentas(obj);
            return Json(response);

        }

        public JsonResult GetAllVentas(Ventas obj)
        {
            try
            {
                Session["ReporteVenta"] = null;
                var bussingLogic = new SVW.BusinessLogic.BLVentas();
                var response = bussingLogic.GetAllVentas(obj);
                Session["ReporteVenta"] = response.Data.ToList();
                return Json(response);
            }
            catch (Exception ex)
            {
                var result = new SVW.Common.Response<List<SVW.Entities.Ventas>>(ex);
                return Json(result);
            }

        }

        public void GenerarExcel()
        {
            var NombreExcel = "Venta - Sistemas de Ventas ";

            // Recuperamos la data  de las consulta DB
            var data = (List<Ventas>)Session["ReporteVenta"];

            // Creación del libro excel xlsx.
            var wb = new XSSFWorkbook();

            // Creación del la hoja y se especifica un nombre
            var fileName = WorkbookUtil.CreateSafeSheetName("Ventas");
            ISheet sheet = wb.CreateSheet(fileName);

            // Contadores para filas y columnas.
            int rownum = 0;
            int cellnum = 0;

            // Creacion del estilo de la letra para las cabeceras.
            var fontCab = wb.CreateFont();
            fontCab.FontHeightInPoints = 10;
            fontCab.FontName = "Calibri";
            fontCab.Boldweight = (short)FontBoldWeight.Bold;
            fontCab.Color = HSSFColor.White.Index;

            // Creacion del color del estilo.
            var colorCab = new XSSFColor(new byte[] { 7, 105, 173 });

            // Se crea el estilo y se agrega el font al estilo
            var styleCab = (XSSFCellStyle)wb.CreateCellStyle();
            styleCab.SetFont(fontCab);
            styleCab.FillForegroundXSSFColor = colorCab;
            styleCab.FillPattern = FillPattern.SolidForeground;


            string[] Cabezeras = {
                    "Descripción","Tipo Venta","Tipo Pago","Cantidad","Precio Producto","Precio Venta",
                    "Descuento","Precio Total","Fecha"
             };

            // Se crea la primera fila para las cabceras.
            IRow row = sheet.CreateRow(rownum++);
            ICell cell;

            foreach (var item in Cabezeras)
            {
                // Se crea celdas y se agrega las cabeceras
                cell = row.CreateCell(cellnum);
                cell.SetCellValue(item);
                cell.CellStyle = styleCab;

                sheet.AutoSizeColumn(cellnum);
                cellnum++;
            }

            // Creacion del estilo de la letra para la data.
            var fontBody = wb.CreateFont();
            fontBody.FontHeightInPoints = 10;
            fontBody.FontName = "Arial";

            var styleBody = (XSSFCellStyle)wb.CreateCellStyle();
            styleBody.SetFont(fontBody);

            // Impresión de la data
            foreach (var item in data)
            {
                cellnum = 0;
                row = sheet.CreateRow(rownum++);

                AddValue(row, cellnum++, item.Producto.Producto_Nombre.ToString(), styleBody, sheet);
                AddValue(row, cellnum++, item.TipoVenta.TipoVenta_Id == 1 ? "Mayor" : 
                    item.TipoVenta.TipoVenta_Id == 2 ? "Menor" : "Granel", styleBody, sheet);
                AddValue(row, cellnum++, item.TipoPago.TipoPago_Id == 1 ? "Efectivo" : "Credito/Tarjeta", styleBody, sheet);
                AddValue(row, cellnum++, item.Venta_Cantidad.ToString("F"), styleBody, sheet);
                AddValue(row, cellnum++, item.Producto.Producto_Precio.ToString("F2"), styleBody, sheet);              
                AddValue(row, cellnum++, item.Venta_Precio.ToString("F2"), styleBody, sheet);
                AddValue(row, cellnum++, item.Venta_Descuento.ToString("F2"), styleBody, sheet);
                AddValue(row, cellnum++, item.Venta_Precio_Total.ToString("F2"), styleBody, sheet);
                AddValue(row, cellnum++, item.Fecha.ToString().Substring(6, 2) + "/" + item.Fecha.ToString().Substring(4, 2) 
                    + "/" + item.Fecha.ToString().Substring(0, 4), styleBody, sheet);

            }

            var nameFile = NombreExcel + DateTime.Now.ToString("dd_MM_yyyy HH:mm:ss") + ".xlsx";
            Response.AddHeader("content-disposition", "attachment; filename=" + nameFile);
            Response.ContentType = "application/octet-stream";
            Stream outStream = Response.OutputStream;
            wb.Write(outStream);
            outStream.Close();
            Response.End();
        }

        public void AddValue(IRow row, int cellnum, string value, ICellStyle styleBody, ISheet sheet)
        {
            ICell cell;
            cell = row.CreateCell(cellnum);
            cell.SetCellValue(value);
            cell.CellStyle = styleBody;
            sheet.AutoSizeColumn(cellnum);
        }

    }
}