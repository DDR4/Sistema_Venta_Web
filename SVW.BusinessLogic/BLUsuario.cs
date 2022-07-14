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
    public class BLUsuario
    {
        private DAUsuario repository;

        public BLUsuario()
        {
            repository = new DAUsuario();
        }

        public Response<IEnumerable<Usuario>> GetUsuario(Usuario obj)
        {
            try
            {
                var result = repository.GetUsuario(obj);
                return new Response<IEnumerable<Usuario>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Usuario>>(ex);
            }
        }

        public Response<int> InsertUpdateUsuario(Usuario obj)
        {
            try
            {
                var result = repository.InsertUpdateUsuario(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteUsuario(Usuario obj)
        {
            try
            {
                var result = repository.DeleteUsuario(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

    }
}
