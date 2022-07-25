var Producto = (function ($, win, doc) {

    var $btnNuevaProducto = $('#btnNuevaProducto');
    var $cboTipoBusqueda = $('#cboTipoBusqueda');

    var $tipoCategoria = $('#tipoCategoria');
    var $tipoDescripcion = $('#tipoDescripcion');
    var $tipoEstado = $('#tipoEstado');

    var $cboCategoria = $('#cboCategoria');
    var $txtDescripcion = $('#txtDescripcion');
    var $cboEstado = $('#cboEstado');    

    var $btnBuscar = $('#btnBuscar');

    var $tblListadoProductos = $('#tblListadoProductos');

    // Modal
    var $modalProducto = $('#modalProducto');
    var $titleModalProducto = $('#titleModalProducto');
    var $formModal = $('#formModal');

    var $cboModalCategoria = $('#cboModalCategoria');
    var $txtModalDescripcion = $('#txtModalDescripcion');
    var $txtModalPrecio = $('#txtModalPrecio');
    var $txtModalPrecioMayor = $('#txtModalPrecioMayor');
    var $txtModalCantidad = $('#txtModalCantidad');
    var $txtModalKilos = $('#txtModalKilos');
    var $cboModalEstado = $('#cboModalEstado');

    var $btnSaveProducto = $('#btnSaveProducto');

    var $btnGenerarExcel = $('#btnGenerarExcel');
    var $txtFechaDesde = $('#txtFechaDesde');
    var $txtFechaHasta = $('#txtFechaHasta');

    var $divKilos = $('#divKilos');

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Producto_Id: null
    };

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {

        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
        $btnSaveProducto.click($btnSaveProducto_click);
        $btnNuevaProducto.click($btnNuevaProducto_click);
        GetProducto();
        GetCategoria();

        app.Event.Number($txtModalCantidad);
        app.Event.ForceDecimalOnly($txtModalPrecio);
        app.Event.ForceDecimalOnly($txtModalPrecioMayor);
        app.Event.Number($txtModalKilos);

        app.Event.Blur($txtModalPrecio, "N");
        app.Event.Blur($txtModalPrecioMayor, "N");
       
        $btnGenerarExcel.click($btnGenerarExcel_click);
        $txtFechaDesde.change(ValidarGenerarExcel);
        $txtFechaHasta.change(ValidarGenerarExcel);
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        $txtFechaHasta.datepicker({
            endDate: "today",
            todayHighlight: true
        }).datepicker('setDate', today);
        $txtFechaDesde.datepicker({
            endDate: "today",
            todayHighlight: true
        }).datepicker('setDate', today);

        $('input[type=radio][name=rbsaco]').change(function () {
            if (this.value == 1) {
                $divKilos.show();
            }
            else if (this.value == 2) {
                $divKilos.hide();
            }
        });
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoCategoria.hide();
        $tipoDescripcion.hide();
        $tipoEstado.hide();

        $cboCategoria.val(0);
        $txtDescripcion.val("");
        $cboEstado.val(0);

        if (codSelec === "1") {
            $tipoCategoria.show();
        }
        else if (codSelec === "2") {
            $tipoDescripcion.show();
        }
        else if (codSelec === "3") {
            $tipoEstado.show();
        }

    }

    function $btnNuevaProducto_click() {
        $formModal[0].reset();
        Global.Producto_Id = null;
        $modalProducto.modal();
        $cboModalEstado.val(1).trigger('change');
        $titleModalProducto.html("Agregar Producto");
        app.Event.Disabled($cboModalEstado);

    }

    function $btnBuscar_click() {
        if (ValidaBusqueda()) {
            GetProducto();
        }
    }

    function $btnSaveProducto_click() {
        if (Validar()) {
            InsertUpdateProducto();
        }
    }

    function Validar() {
        var flag = true;
        var br = "<br>";
        var msg = "";
        var rbsaco = $('input[name=rbsaco]:checked').val();

        msg += app.ValidarCampo($cboModalCategoria.val(), "• El tipo de producto.");
        msg += app.ValidarCampo($txtModalDescripcion.val(), "• La descripción.");
        msg += app.ValidarCampo($txtModalPrecio.val(), "• El precio.");
        msg += app.ValidarCampo($txtModalPrecioMayor.val(), "• El precio mayor.");
        msg += app.ValidarCampo($txtModalCantidad.val(), "• La cantidad.");
        msg += app.ValidarCampo(rbsaco, "• La opción saco.");
        if (rbsaco == 1) {
            msg += app.ValidarCampo($txtModalKilos.val(), "• Los kilos.");
        }
        msg += app.ValidarCampo($cboModalEstado.val(), "• El estado.");                 

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del producto: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function ValidaBusqueda() {
        var flag = true;
        var br = "<br>";
        var msg = "";

        var vcboTipoBusqueda = parseInt($cboTipoBusqueda.val());

        var Categoria = $cboCategoria.val().trim();
        var Descripcion = $txtDescripcion.val().trim();
        var Estado = $cboEstado.val().trim();

        switch (vcboTipoBusqueda) {
            case 1:
                msg += app.ValidarCampo(Categoria, "• La Categoria.");
                break;
            case 2:
                msg += app.ValidarCampo(Descripcion, "• La Descripción.");
                break;
            case 3:
                msg += app.ValidarCampo(Estado, "• El Estado.");
                break;

            default:
                msg = "";
                break;
        }

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del producto: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function InsertUpdateProducto() {

        var obj = {
            "Producto_Id": Global.Producto_Id,
            "Categoria": { "Categoria_Id": $cboModalCategoria.val() },
            "Producto_Nombre": $txtModalDescripcion.val(),
            "Producto_Precio": app.UnformatNumber($txtModalPrecio.val()),
            "Producto_Precio_Mayor": app.UnformatNumber($txtModalPrecioMayor.val()),
            "Producto_Cantidad": $txtModalCantidad.val(),
            "Producto_Tipo": $('input[name=rbsaco]:checked').val(),
            "Producto_Cantidad_Kilo": $txtModalKilos.val(),
            "Producto_Estado": $cboModalEstado.val(),
        };
        var method = "POST";
        var url = "Producto/InsertUpdateProducto";
        var data = obj;
        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            GetProducto();
            $modalProducto.modal('hide');
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

    }

    function GetProducto() {
        var parms = {
            Categoria: { Categoria_Id : $cboCategoria.val() },
            Producto_Nombre: $txtDescripcion.val(),
            Producto_Estado: $cboEstado.val()
        };

        var url = "Producto/GetProducto";
                                                             
        var columns = [                           
            { data: "Categoria.Categoria_Nombre" },
            { data: "Producto_Nombre" },
            { data: "Producto_Precio" },
            { data: "Producto_Precio_Mayor" },
            { data: "Producto_Cantidad" },
            { data: "Producto_Estado" },
            { data: "Producto_Fecha" },
            { data: "Auditoria.TipoUsuario" }

        ];

        var columnDefs = [  
            {
                "targets": [2,3],
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },
            {
                "targets": [5],
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

                }
            },
            {
                "targets": [6],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertIntToDatetimeDT(data) + '';
                }
            },
            {
                "targets": [7],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Producto.EditarProducto(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Producto.EliminarProducto(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            "</center> ";
                    } else {
                        return "";
                    }
                }
            }
          
        ];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };                     
        app.FillDataTableAjaxPaging($tblListadoProductos, url, parms, columns, columnDefs, filters, null, null);
    }

    function GetCategoria() {

        var method = "POST";
        var url = "Producto/GetCategoria";
        var fnDoneCallback = function (data) {
            $.each(data.Data, function (key, value) {
                $cboCategoria.append("<option value=" + value.Categoria_Id + ">" + value.Categoria_Nombre + "</option>");
                $cboModalCategoria.append("<option value=" + value.Categoria_Id + ">" + value.Categoria_Nombre + "</option>");
            });
        };
        app.CallAjax(method, url, null, fnDoneCallback);
    }

    function EditarProducto(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoProductos, row);
        $titleModalProducto.html("Editar Producto");
        $modalProducto.modal();
        Global.Producto_Id = data.Producto_Id;
        $txtModalDescripcion.val(data.Producto_Nombre);
        $txtModalPrecio.val(app.FormatNumber(data.Producto_Precio));
        $txtModalPrecioMayor.val(app.FormatNumber(data.Producto_Precio_Mayor));
        $txtModalCantidad.val(data.Producto_Cantidad);
        $txtModalKilos.val(data.Producto_Cantidad_Kilo);
        app.Event.Enable($cboModalEstado);
        $cboModalCategoria.val(data.Categoria.Categoria_Id).trigger('change');                                                                                
        $("input[name=rbsaco][value=" + data.Producto_Tipo+"]").prop('checked', true);
        $cboModalEstado.val(data.Producto_Estado).trigger('change');

        if (data.Producto_Tipo = 1) {
            $divKilos.show();
        }
    }

    function EliminarProducto(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoProductos, row);

            var obj = {
                "Producto_Id": data.Producto_Id
            };

            var method = "POST";
            var url = "Producto/DeleteProducto";
            var data1 = obj;
            var fnDoneCallback = function (data) {
                GetProducto();
            };
            app.CallAjax(method, url, data1, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el producto?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function $btnGenerarExcel_click() {
        var FechaDesde = app.ConvertDatetimeToInt($txtFechaDesde.val(), '/');
        var FechaHasta = app.ConvertDatetimeToInt($txtFechaHasta.val(), '/');

        if (FechaDesde !== "" && FechaHasta !== "") {
            GenerarExcel();
        } else if (FechaDesde === "") {
            app.Message.Info("Aviso", "Falta ingresar la Fecha Desde", "Aceptar", null);
        } 
       
    }
    
    function GenerarExcel() {

        var data = {
            Marca_Prod: $txtDescripcion.val(),
            Estado_Prod: $cboEstado.val(),
            FechaDesde: app.ConvertDatetimeToInt($txtFechaDesde.val(), '/'),
            FechaHasta: app.ConvertDatetimeToInt($txtFechaHasta.val(), '/')
        };

        var fnDoneCallback = function (data) {
            if (data.InternalStatus === 1 && data.Data.length > 0) {
                app.RedirectTo("Producto/GenerarExcel");
            } else {
                app.Message.Info("Aviso", "No hay productos con esas fechas", "Aceptar");
            }
        };
        app.CallAjax("POST", "Producto/GetAllProductos", data, fnDoneCallback);
    }

    function ValidarGenerarExcel() {
        var FechaDesde = app.ConvertDatetimeToInt($txtFechaDesde.val(), '/');
        var FechaHasta = app.ConvertDatetimeToInt($txtFechaHasta.val(), '/');     
        
        if (FechaDesde > FechaHasta) {
            $txtFechaDesde.val("");
        }
    }



    return {
        EliminarProducto: EliminarProducto,
        EditarProducto: EditarProducto
    };


})(window.jQuery, window, document);