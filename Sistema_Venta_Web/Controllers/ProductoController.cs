using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using SVW.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Xml.Linq;

namespace Sistema_Venta_Web.Controllers
{
    public class ProductoController : Controller
    {
        // GET: Producto
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetProducto(Producto obj)
        {
            try
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

                obj.    Operacion = new Operacion
                {
                    Inicio = (inicio / fin),
                    Fin = fin
                };

                var bussingLogic = new SVW.BusinessLogic.BLProducto();
                var response = bussingLogic.GetProducto(obj);

                var Datos = response.Data;
                var totalRecords = Datos.Any() ? Datos.Select(x => x.Operacion.TotalRows).FirstOrDefault() : 0;
                var recFilter = totalRecords;

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

        public JsonResult GetCategoria()
        {
            var bussingLogic = new SVW.BusinessLogic.BLProducto();

            var response = bussingLogic.GetCategoria();

            return Json(response);
        }

        public JsonResult InsertUpdateProducto(Producto obj)
        {
            var bussingLogic = new SVW.BusinessLogic.BLProducto();

            obj.Auditoria = new Auditoria
            {
                UsuarioCreacion = User.Identity.Name,
                UsuarioModificacion = User.Identity.Name
            };

            obj.Imagen = new Imagen
            {
                Imagen_Nombre = obj.Imagen.Imagen_Nombre,
                Imagen_Tipo = obj.Imagen.Imagen_Tipo,
                Imagen_ImgBase64 = obj.Imagen.Imagen_ImgBase64.Replace("data:"+
                obj.Imagen.Imagen_Tipo +";base64,", "")
            };

            var response = bussingLogic.InsertUpdateProducto(obj);

            return Json(response);
        }

        public JsonResult DeleteProducto(Producto obj)
        {
            var bussingLogic = new SVW.BusinessLogic.BLProducto();
            obj.Auditoria = new Auditoria
            {
                UsuarioModificacion = User.Identity.Name
            };
            var response = bussingLogic.DeleteProducto(obj);

            return Json(response);

        }

        public JsonResult GetAllProductos(Producto obj)
        {
            try
            {
                Session["ReporteProducto"] = null;
                var bussingLogic = new SVW.BusinessLogic.BLProducto();
                var response = bussingLogic.GetAllProductos(obj);
                Session["ReporteProducto"] = response.Data.ToList();
                return Json(response);
            }
            catch (Exception ex)
            {
                var result = new SVW.Common.Response<List<Producto>>(ex);
                return Json(result);
            }

        }

        public void GenerarExcel()
        {
            var NombreExcel = "Producto - Sistemas de Ventas ";

            // Recuperamos la data  de las consulta DB
            var data = (List<Producto>)Session["ReporteProducto"];

            // Creación del libro excel xlsx.
            var wb = new XSSFWorkbook();

            // Creación del la hoja y se especifica un nombre
            var fileName = WorkbookUtil.CreateSafeSheetName("Productos");
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
                    "Categoria", "Descripcion", "Precio", "Precio Mayor", "Cantidad", "Estado", "Fecha"
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
                
                AddValue(sheet, row, cellnum++, item.Categoria.Categoria_Nombre.ToString(), styleBody);
                AddValue(sheet, row, cellnum++, item.Producto_Nombre, styleBody);
                AddValue(sheet, row, cellnum++, item.Producto_Precio.ToString("F2"), styleBody);
                AddValue(sheet, row, cellnum++, item.Producto_Precio_Mayor.ToString("F2"), styleBody);
                AddValue(sheet, row, cellnum++, item.Producto_Cantidad.ToString(), styleBody);
                AddValue(sheet, row, cellnum++, item.Producto_Estado == 1 ? "Activo" : "Inactivo".ToString(), styleBody);
                AddValue(sheet, row, cellnum++, item.Producto_Fecha.ToString().Substring(6, 2) + "/" + item.Producto_Fecha.ToString().Substring(4, 2) + "/" + item.Producto_Fecha.ToString().Substring(0, 4), styleBody);
            }

            var nameFile = NombreExcel + DateTime.Now.ToString("dd_MM_yyyy HH:mm:ss") + ".xlsx";
            Response.AddHeader("content-disposition", "attachment; filename=" + nameFile);
            Response.ContentType = "application/octet-stream";
            Stream outStream = Response.OutputStream;
            wb.Write(outStream);
            outStream.Close();
            Response.End();
        }

        public void AddValue(ISheet sheet, IRow row, int cellnum, string value, ICellStyle styleBody)
        {
            ICell cell;
            cell = row.CreateCell(cellnum);
            cell.SetCellValue(value);
            cell.CellStyle = styleBody;
            sheet.AutoSizeColumn(cellnum);
        }
    }
}