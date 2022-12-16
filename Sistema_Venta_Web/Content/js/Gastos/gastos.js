var Gasto = (function ($, win, doc) {

    var $btnNuevaGasto = $('#btnNuevaGasto');
    var $cboTipoBusqueda = $('#cboTipoBusqueda');

    var $tipoEstado = $('#tipoEstado');
    var $tipoFecha = $('#tipoFecha');

    var $txtFecha = $('#txtFecha');
    var $cboEstado = $('#cboEstado');

    var $btnBuscar = $('#btnBuscar');

    var $tblListadoGastos = $('#tblListadoGastos');

    // Modal
    var $modalGasto = $('#modalGasto');
    var $titleModalGasto = $('#titleModalGasto');
    var $formModal = $('#formModal');

    var $txtModalDescripcion = $('#txtModalDescripcion');
    var $txtModalTotal = $('#txtModalTotal');
    var $txtModalFecha = $('#txtModalFecha');
    var $cboModalEstado = $('#cboModalEstado');

    var $btnGuardar = $('#btnGuardar');

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Gasto_Id: null
    };

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {

        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
        $btnGuardar.click($btnGuardar_click);
        $btnNuevaGasto.click($btnNuevaGasto_click);
        GetGasto();
        app.Event.Datepicker($txtFecha);
        app.Event.Datepicker($txtModalFecha);

        app.Event.ForceDecimalOnly($txtModalTotal);
        app.Event.Blur($txtModalTotal, "N");
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
        if (Validar()) {
            InsertUpdateGasto();
        }
    }

    function Validar() {
        var flag = true;
        var br = "<br>";
        var msg = "";
        msg += app.ValidarCampo($txtModalDescripcion.val(), "• La Descripción.");
        msg += app.ValidarCampo($txtModalTotal.val(), "• El Total.");
        msg += app.ValidarCampo($cboModalEstado.val(), "• El Estado.");

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del Gasto: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
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
            "Gasto_Nombre": $txtModalDescripcion.val(),
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
            { data: "Gasto_Nombre" },
            { data: "Gasto_Total" },   
            { data: "Gasto_Fecha" },
            { data: "Gasto_Estado" },
            { data: "Auditoria.TipoUsuario" }

        ];

        var columnDefs = [
            {
                "targets": [1],
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },                  
            {
                "targets": [2],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertIntToDatetimeDT(data) + '';
                }
            },       
            {
                "targets": [3],
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

                }
            },
            {
                "targets": [4],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Gasto.EditarGasto(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
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

    function EditarGasto(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoGastos, row);
        $titleModalGasto.html("Editar Gasto");
        $modalGasto.modal();
        Global.Gasto_Id = data.Gasto_Id;      
        $txtModalDescripcion.val(data.Gasto_Nombre);
        $txtModalTotal.val(app.FormatNumber(data.Gasto_Total));
        $txtModalFecha.val(app.ConvertIntToDatetimeDT(data.Gasto_Fecha));
        app.Event.Enable($cboModalEstado);       
        $cboModalEstado.val(data.Gasto_Estado).trigger('change');

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

    return {
        EliminarGasto: EliminarGasto,
        EditarGasto: EditarGasto
    };


})(window.jQuery, window, document);