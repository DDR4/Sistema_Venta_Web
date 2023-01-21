using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SVW.Common;
using SVW.DataAccess;
using SVW.Entities;

namespace SVW.BusinessLogic
{
    public class BLProducto
    {
        private DataAccess.DAProducto repository;

        public BLProducto()
        {
            repository = new DataAccess.DAProducto();
        }

        public Response<IEnumerable<Producto>> GetProducto(Producto obj)
        {
            try
            {
                var result = repository.GetProducto(obj);
                var rs = result.Select(x => 
                    new Producto
                    {
                        Producto_Id = x.Producto_Id,
                        Producto_Codigo = x.Producto_Codigo,
                        Producto_Nombre = x.Producto_Nombre,
                        Producto_Precio = x.Producto_Precio,
                        Producto_Precio_Mayor = x.Producto_Precio_Mayor,
                        Producto_Cantidad = x.Producto_Cantidad,
                        Producto_Cantidad_Gramo = x.Producto_Cantidad_Gramo,
                        Producto_Cantidad_Kilo = x.Producto_Cantidad_Kilo,
                        Producto_Tipo = x.Producto_Tipo,
                        Categoria = new Categoria
                        {
                            Categoria_Id = x.Categoria.Categoria_Id,
                            Categoria_Nombre = x.Categoria.Categoria_Nombre,
                        },
                        Imagen = new Imagen
                        {
                            Imagen_Nombre = x.Imagen.Imagen_Nombre,
                            Imagen_ImgBase64 = (string.IsNullOrEmpty(x.Imagen.Imagen_ImgBase64) ? "":
                            string.Concat("data:",x.Imagen.Imagen_Tipo,";base64,",x.Imagen.Imagen_ImgBase64))
                        },
                        Producto_Estado = x.Producto_Estado,
                        Auditoria = new Auditoria
                        {
                            TipoUsuario = x.Auditoria.TipoUsuario,
                        },
                        Operacion = new Operacion
                        {
                            TotalRows = x.Operacion.TotalRows
                        },
                        Producto_Fecha = x.Producto_Fecha
                    }).AsEnumerable();
                return new Response<IEnumerable<Producto>>(rs);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Response<IEnumerable<Categoria>> GetCategoria()
        {
            try
            {
                var result = repository.GetCategoria();
                return new Response<IEnumerable<Categoria>>(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Response<int> InsertUpdateProducto(Producto obj)
        {
            try
            {
                var result = repository.InsertUpdateProducto(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteProducto(Producto obj)
        {
            try
            {
                var result = repository.DeleteProducto(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<IEnumerable<Producto>> GetAllProductos(Producto obj)
        {
            try
            {
                var result = repository.GetAllProductos(obj);
                return new Response<IEnumerable<Producto>>(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }  
    }
}
