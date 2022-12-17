var Gasto = (function ($, win, doc) {

    var $btnNuevaGasto = $('#btnNuevaGasto');
    var $cboTipoBusqueda = $('#cboTipoBusqueda');

    var $tipoEstado = $('#tipoEstado');
    var $tipoFecha = $('#tipoFecha');

    var $txtFecha = $('#txtFecha');
    var $cboEstado = $('#cboEstado');

    var $btnBuscar = $('#btnBuscar');

    var $tblListadoGastos = $('#tblListadoGastos');

    // Modal Gasto
    var $modalGasto = $('#modalGasto');
    var $titleModalGasto = $('#titleModalGasto');
    var $formModal = $('#formModal');

    var $txtModalFecha = $('#txtModalFecha');
    var $txtModalDescripcionProducto = $('#txtModalDescripcionProducto');
    var $txtModalDescripcion = $('#txtModalDescripcion');
    var $txtModalTotal = $('#txtModalTotal');
    var $txtModalPrecioProducto = $('#txtModalPrecioProducto');
    var $txtModalCantidad = $('#txtModalCantidad');
    var $txtModalPrecioTotal = $('#txtModalPrecioTotal');
    var $cboModalEstado = $('#cboModalEstado');

    var $btnProducto = $('#btnProducto');
    var $btnGuardar = $('#btnGuardar');

    //Modal Producto 
    var $modalProducto = $('#modalProducto');

    var $tipoCategoriaModal = $('#tipoCategoriaModal');
    var $tipoDescripcionModal = $('#tipoDescripcionModal');

    var $tblListadoProductos = $('#tblListadoProductos');
    var $btnSaveProducto = $('#btnSaveProducto');

    var $cboTipoBusquedaModal = $('#cboTipoBusquedaModal');
    var $txtDescripcionModal = $('#txtDescripcionModal');
    var $cboCategoriaModal = $('#cboCategoriaModal');
    var $btnBuscarModal = $('#btnBuscarModal');

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {

        Gasto_Id: null,
        Producto: {
            Producto_Id: 0,
            Producto_Nombre: null,
            Producto_Precio: 0.0,
        }
    };

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $cboTipoBusquedaModal.change($cboTipoBusquedaModal_change);
        $btnBuscar.click($btnBuscar_click);
        $btnGuardar.click($btnGuardar_click);
        $btnProducto.click($btnProducto_click);
        $btnSaveProducto.click($btnSaveProducto_click);
        $btnBuscarModal.click($btnBuscarModal_click);
        $btnNuevaGasto.click($btnNuevaGasto_click);
        GetGasto();
        GetCategoria();
        app.Event.Datepicker($txtFecha);
        app.Event.ForceDecimalOnly($txtModalTotal);
        app.Event.Number($txtModalCantidad);
        app.Event.Blur($txtModalTotal, "N");
        $txtModalTotal.blur($txtModalPrecioTotal_keypress);
        $txtModalCantidad.blur($txtModalPrecioTotal_keypress);
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoEstado.hide();
        $tipoFecha.hide();

        $cboEstado.val(0);
        $txtFecha.val(null);

        if (codSelec === "1") {
            $tipoEstado.show();
        } else if (codSelec === "2") {
            $tipoFecha.show();
        }

    }

    function $btnNuevaGasto_click() {
        $formModal[0].reset();
        app.Event.SetDateDatepicket($txtModalFecha);
        Global.Gasto_Id = null;
        $modalGasto.modal();
        $cboModalEstado.val(1).trigger('change');
        $titleModalGasto.html("Agregar Gasto");
        app.Event.Disabled($cboModalEstado);
    }

    function $btnBuscar_click() {
        if (ValidaBusqueda()) {
            GetGasto();
        }
    }

    function $btnGuardar_click() {

        var Total = app.UnformatNumber($txtModalTotal.val());
        var PrecioTotal = app.UnformatNumber($txtModalPrecioTotal.val());

        if (PrecioTotal > 0) {
            if (PrecioTotal <= Total) {
                InsertUpdateGasto();
            }
            else
            {
                app.Message.Info("Aviso", "El precio total no puede ser mayor al total.", null, null);
            }     
           
        } else if (total === 0 || total === "") {
            app.Message.Info("Aviso", "Ingrese un precio total.", null, null);
        }
        
    }

    function ValidaBusqueda() {
        var flag = true;
        var br = "<br>";
        var msg = "";

        var vcboTipoBusqueda = parseInt($cboTipoBusqueda.val());

        var Estado = $cboEstado.val().trim();
        var Fecha = app.ConvertDatetimeToInt($txtFecha.val(), '/');

        switch (vcboTipoBusqueda) {
            case 1:
                msg += app.ValidarCampo(Estado, "• El Estado.");
                break;
            case 2:
                msg += app.ValidarCampo(Fecha, "• La Fecha.");
                break;
            default:
                msg = "";
                break;
        }

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del Gasto: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function InsertUpdateGasto() {

        var obj = {
            "Gasto_Id": Global.Gasto_Id,
            "Producto.Producto_Id": Global.Producto.Producto_Id,            
            "Gasto_Nombre": $txtModalDescripcion.val(),
            "Gasto_Cantidad": $txtModalCantidad.val(),
            "Gasto_Total": app.UnformatNumber($txtModalTotal.val()),
            "Gasto_Fecha": app.ConvertDatetimeToInt($txtModalFecha.val(), '/'),
            "Gasto_Estado": $cboModalEstado.val(),
        };
        var method = "POST";
        var url = "Gastos/InsertUpdateGasto";
        var data = obj;
        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            GetGasto();
            $modalGasto.modal('hide');
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

    }

    function GetGasto() {
        var parms = {
            Gasto_Estado: $cboEstado.val(),
            Gasto_Fecha: app.ConvertDatetimeToInt($txtFecha.val(), '/')
        };

        var url = "Gastos/GetGasto";

        var columns = [
            { data: "Producto.Producto_Codigo" },
            { data: "Producto.Producto_Nombre" },
            { data: "Gasto_Nombre" },
            { data: "Gasto_Cantidad" },
            { data: "Gasto_Total" },   
            { data: "Gasto_Fecha" },
            { data: "Gasto_Estado" },
            { data: "Auditoria.TipoUsuario" }

        ];

        var columnDefs = [
            {
                "targets": [3,4],
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },                  
            {
                "targets": [5],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertIntToDatetimeDT(data) + '';
                }
            },       
            {
                "targets": [6],
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

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
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Gasto.EliminarGasto(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoGastos, url, parms, columns, columnDefs, filters, null, null);
    }

    function EliminarGasto(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoGastos, row);

            var obj = {
                "Gasto_Id": data.Gasto_Id
            };

            var method = "POST";
            var url = "Gastos/DeleteGasto";
            var data1 = obj;
            var fnDoneCallback = function (data) {
                GetGasto();
            };
            app.CallAjax(method, url, data1, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el Gasto?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    } 

    function GetCategoria() {

        var method = "POST";
        var url = "Producto/GetCategoria";
        var fnDoneCallback = function (data) {
            $.each(data.Data, function (key, value) {
                $cboCategoriaModal.append("<option value=" + value.Categoria_Id + ">" + value.Categoria_Nombre + "</option>");
            });
        };
        app.CallAjax(method, url, null, fnDoneCallback);
    }

    function $btnProducto_click() {
        $modalProducto.modal();
        $cboTipoBusquedaModal.val(0).change();
        LoadProductos();
    }

    function $cboTipoBusquedaModal_change() {

        var codSelec = $(this).val();
        $tipoCategoriaModal.hide();
        $tipoDescripcionModal.hide();

        $cboCategoriaModal.val(0);
        $txtDescripcionModal.val("");

        if (codSelec === "1") {
            $tipoCategoriaModal.show();
        }
        else if (codSelec === "2") {
            $tipoDescripcionModal.show();
        }
    }

    function LoadProductos() {

        var url = "Producto/GetProducto";
        var parms = {
            Categoria: { Categoria_Id: $cboCategoriaModal.val() },
            Producto_Nombre: $txtDescripcionModal.val().trim()
        };
        var columns = [
            { data: "Categoria.Categoria_Nombre" },
            { data: "Producto_Nombre" },
            { data: "Producto_Cantidad" },
            { data: "Producto_Precio" },
            { data: "Producto_Precio_Mayor" }
        ];
        var columnDefs = [
            {
                "targets": [3, 4],
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            }
        ];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };
        app.FillDataTableAjaxPaging($tblListadoProductos, url, parms, columns, columnDefs, filters, null, null);
    }

    function $btnSaveProducto_click() {

        var DatosSeleccionados = $tblListadoProductos.DataTable().rows({ selected: true }).data().toArray();
        var Producto = DatosSeleccionados[0];

        Global.Producto = {
            Producto_Id: Producto.Producto_Id,
            Producto_Nombre: Producto.Producto_Nombre,
            Producto_Precio: Producto.Producto_Precio
        };

        $txtModalDescripcionProducto.val(Global.Producto.Producto_Nombre);
        $txtModalPrecioProducto.val(app.FormatNumber(Global.Producto.Producto_Precio));
        $modalProducto.modal('hide');
    }                

    function $btnBuscarModal_click() {
        LoadProductos();
    }

    function $txtModalPrecioTotal_keypress() {
        var PrecioProducto = parseFloat(app.UnformatNumber($txtModalPrecioProducto.val()));
        var Total = parseFloat(app.UnformatNumber($txtModalTotal.val()));
        var Cantidad = parseInt($txtModalCantidad.val());

        if (Total > 0) {
            if (Total >= PrecioProducto) {
                var PrecioTotal = app.FormatNumber(Cantidad * PrecioProducto);
                $txtModalPrecioTotal.val(PrecioTotal);
            } else {
                app.Message.Info("ERROR", "El precio del gasto no puede ser menor al total", null, null);
                $txtModalTotal.val("");
            }
        }
    }

    return {
        EliminarGasto: EliminarGasto
    };


})(window.jQuery, window, document);