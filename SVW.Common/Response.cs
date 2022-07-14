using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SVW.Common.EnumTypes;

namespace SVW.Common
{
    public class Response<T>
    {
        public InternalStatus InternalStatus { get; set; }
        public string InternalException { get; set; }
        public T Data { get; set; }
        public Response(T returnObject)
        {
            Data = returnObject;
            InternalStatus = InternalStatus.Success;
            InternalException = null;
        }
        public Response(Exception exception)
        {
            Data = default(T);
            InternalStatus = InternalStatus.Failed;
            InternalException = exception.Message;
        }
        public Response(string exceptionMessage)
        {
            Data = default(T);
            InternalStatus = InternalStatus.Failed;
            InternalException = exceptionMessage;
        }
    }
}
