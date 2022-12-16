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
    public class BLGastos
    {
        private DAGastos repository;

        public BLGastos()
        {
            repository = new DAGastos();
        }

        public Response<IEnumerable<Gastos>> GetGastos(Gastos obj)
        {
            try
            {
                var result = repository.GetGastos(obj);
                return new Response<IEnumerable<Gastos>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Gastos>>(ex);
            }
        }

        public Response<int> InsertUpdateGastos(Gastos obj)
        {
            try
            {
                var result = repository.InsertUpdateGastos(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteGastos(Gastos obj)
        {
            try
            {
                var result = repository.DeleteGastos(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

    }
}
