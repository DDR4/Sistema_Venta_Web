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
                return new Response<IEnumerable<Producto>>(result);
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
