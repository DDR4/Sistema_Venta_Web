using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SVW.Common;
using SVW.Entities;
using SVW.DataAccess;

namespace SVW.BusinessLogic
{
    public class BLVentas
    {
        private DAVentas repository;

        public BLVentas()
        {
            repository = new DAVentas();
        }

        public Response<IEnumerable<Ventas>> GetVentas(Ventas obj)
        {
            try
            {
                var result = repository.GetVentas(obj);
                return new Response<IEnumerable<Ventas>>(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Response<int> InsertUpdateVentas(Ventas obj)
        {
            try
            {
                var result = repository.InsertUpdateVentas(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteVentas(Ventas obj)
        {
            try
            {
                var result = repository.DeleteVentas(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<IEnumerable<Ventas>> GetAllVentas(Ventas obj)
        {
            try
            {
                var result = repository.GetAllVentas(obj);
                return new Response<IEnumerable<Ventas>>(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
