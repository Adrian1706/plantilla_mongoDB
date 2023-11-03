import { con } from "../db/atlas.js";

export async function ventasJulio() {
  try {
    const db = await con();
    const ventas = db.collection("venta");
    const result = await ventas
      .find({
        Fecha: {
          $gte: new Date("2023-07-01"),
          $lt: new Date("2023-08-01"),
        },
      })
      .toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener las ventas de julio:", error);
    throw error;
  }
}

export async function empleadosConCargosYMunicipios() {
  try {
    const db = await con();
    const result = await db
      .collection("empleado")
      .aggregate([
        {
          $lookup: {
            from: "cargos",
            localField: "IdCargoFK",
            foreignField: "Id",
            as: "cargo",
          },
        },
        {
          $lookup: {
            from: "municipio",
            localField: "IdMunicipioFK",
            foreignField: "Id",
            as: "municipio",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener los empleados con cargos y municipios:",
      error
    );
    throw error;
  }
}

export async function ventasConClientesYFormasDePago() {
  try {
    const db = await con();
    const result = await db
      .collection("venta")
      .aggregate([
        {
          $lookup: {
            from: "cliente",
            localField: "IdClienteFK",
            foreignField: "Id",
            as: "cliente",
          },
        },
        {
          $lookup: {
            from: "forma_pago",
            localField: "IdFormaPagoFK",
            foreignField: "Id",
            as: "forma_pago",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener las ventas con información de clientes y formas de pago:",
      error
    );
    throw error;
  }
}

export async function ordenesConDetallesEmpleadosYClientes() {
  try {
    const db = await con();
    const result = await db
      .collection("orden")
      .aggregate([
        {
          $lookup: {
            from: "empleado",
            localField: "IdEmpleadoFK",
            foreignField: "Id",
            as: "empleado",
          },
        },
        {
          $lookup: {
            from: "cliente",
            localField: "IdClienteFK",
            foreignField: "Id",
            as: "cliente",
          },
        },
        {
          $lookup: {
            from: "detalle_orden",
            localField: "Id",
            foreignField: "IdOrdenFK",
            as: "detalles",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener los detalles de las órdenes con los nombres de los empleados y clientes asociados:",
      error
    );
    throw error;
  }
}

export async function productosConTallaYColor() {
  try {
    const db = await con();
    const result = await db
      .collection("inventario")
      .aggregate([
        {
          $lookup: {
            from: "talla",
            localField: "IdTallaFK",
            foreignField: "Id",
            as: "talla",
          },
        },
        {
          $lookup: {
            from: "prenda",
            localField: "IdPrendaFK",
            foreignField: "Id",
            as: "prenda",
          },
        },
        {
          $lookup: {
            from: "color",
            localField: "IdColorFK",
            foreignField: "Id",
            as: "color",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener los productos disponibles en el inventario junto con su talla y color:",
      error
    );
    throw error;
  }
}

export async function proveedoresConInsumos() {
  try {
    const db = await con();
    const result = await db
      .collection("proveedor")
      .aggregate([
        {
          $lookup: {
            from: "insumo_proveedor",
            localField: "Id",
            foreignField: "IdProveedorFK",
            as: "insumos",
          },
        },
        {
          $lookup: {
            from: "insumo",
            localField: "insumos.IdInsumoFK",
            foreignField: "Id",
            as: "insumos_suministrados",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener la lista de proveedores junto con la lista de insumos que suministran:",
      error
    );
    throw error;
  }
}

export async function cantidadVentasPorEmpleado() {
  try {
    const db = await con();
    const result = await db
      .collection("venta")
      .aggregate([
        {
          $group: {
            _id: "$IdEmpleadoFK",
            totalVentas: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "empleado",
            localField: "_id",
            foreignField: "Id",
            as: "empleado",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener la cantidad de ventas realizadas por cada empleado:",
      error
    );
    throw error;
  }
}

export async function ordenesEnProcesoConDetalles() {
  try {
    const db = await con();
    const result = await db
      .collection("orden")
      .aggregate([
        {
          $match: { IdEstadoFK: 2 },
        },
        {
          $lookup: {
            from: "empleado",
            localField: "IdEmpleadoFK",
            foreignField: "Id",
            as: "empleado",
          },
        },
        {
          $lookup: {
            from: "cliente",
            localField: "IdClienteFK",
            foreignField: "Id",
            as: "cliente",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener la lista de órdenes en proceso junto con los nombres de los clientes y empleados asociados:",
      error
    );
    throw error;
  }
}

export async function empresaYRepresentanteConMunicipio() {
  try {
    const db = await con();
    const result = await db
      .collection("empresa")
      .aggregate([
        {
          $lookup: {
            from: "municipio",
            localField: "IdMunicipioFK",
            foreignField: "Id",
            as: "municipio",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener el nombre de la empresa y su respectivo representante legal junto con el nombre del municipio al que pertenece:",
      error
    );
    throw error;
  }
}

export async function listaPrendasConStock() {
  try {
    const db = await con(); // Asegúrate de que tu función de conexión se exporte correctamente desde el archivo de conexión
    const result = await db
      .collection("inventario")
      .aggregate([
        {
          $lookup: {
            from: "prenda",
            localField: "IdPrendaFK",
            foreignField: "Id",
            as: "prenda",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener la lista de prendas y su respectivo stock disponible:",
      error
    );
    throw error;
  }
}

export async function clientesConComprasEnFecha(fecha) {
  try {
    const db = await con();
    const result = await db
      .collection("venta")
      .aggregate([
        {
          $match: { Fecha: fecha },
        },
        {
          $lookup: {
            from: "cliente",
            localField: "IdClienteFK",
            foreignField: "Id",
            as: "cliente",
          },
        },
        {
          $unwind: "$cliente",
        },
        {
          $lookup: {
            from: "detalle_venta",
            localField: "Id",
            foreignField: "IdVentaFK",
            as: "detalles_venta",
          },
        },
        {
          $group: {
            _id: "$cliente.nombre",
            totalArticulos: { $sum: "$detalles_venta.cantidad" },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener el nombre de los clientes que realizaron compras en una fecha específica junto con la cantidad de artículos comprados:",
      error
    );
    throw error;
  }
}

export async function empleadosConDuracionDeEmpleo() {
  try {
    const db = await con();
    const result = await db
      .collection("empleado")
      .aggregate([
        {
          $project: {
            nombre: 1,
            fecha_ingreso: 1,
            duracion_empleo_anios: {
              $divide: [
                { $subtract: [new Date(), "$fecha_ingreso"] },
                1000 * 60 * 60 * 24 * 365,
              ],
            },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener la duración de empleo de los empleados:",
      error
    );
    throw error;
  }
}

export async function valorTotalVentasPorPrenda() {
  try {
    const db = await con();
    const result = await db
      .collection("prenda")
      .aggregate([
        {
          $lookup: {
            from: "detalle_venta",
            localField: "Id",
            foreignField: "IdProductoFK",
            as: "ventas",
          },
        },
        {
          $unwind: "$ventas",
        },
        {
          $group: {
            _id: "$Nombre",
            valorTotalVentasUSD: { $sum: "$ventas.valor_unit" },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener el valor total de ventas por prenda:",
      error
    );
    throw error;
  }
}

export async function obtenerInfoInsumosPorPrenda() {
  try {
    const db = await con();
    const result = await db
      .collection("prenda")
      .aggregate([
        {
          $lookup: {
            from: "detalle_orden",
            localField: "Id",
            foreignField: "IdPrendaFK",
            as: "detalles",
          },
        },
        {
          $unwind: "$detalles",
        },
        {
          $group: {
            _id: "$Nombre",
            cantidadMinimaInsumos: { $min: "$detalles.cantidad_producir" },
            cantidadMaximaInsumos: { $max: "$detalles.cantidad_producir" },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener la información de insumos por prenda:",
      error
    );
    throw error;
  }
}

export async function obtenerInfoEmpleados() {
  try {
    const db = await con();
    const result = await db
      .collection("empleado")
      .aggregate([
        {
          $lookup: {
            from: "cargo",
            localField: "IdCargoFK",
            foreignField: "Id",
            as: "cargo_info",
          },
        },
        {
          $lookup: {
            from: "municipio",
            localField: "IdMunicipioFK",
            foreignField: "Id",
            as: "municipio_info",
          },
        },
        {
          $project: {
            _id: 0,
            nombre: 1,
            cargo: { $arrayElemAt: ["$cargo_info.descripcion", 0] },
            municipio: { $arrayElemAt: ["$municipio_info.nombre", 0] },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener la información de los empleados:", error);
    throw error;
  }
}

export async function obtenerVentasPorFecha(fechaInicio, fechaFin) {
  try {
    const db = await con();
    const result = await db
      .collection("venta")
      .aggregate([
        {
          $match: {
            Fecha: {
              $gte: new Date(fechaInicio),
              $lte: new Date(fechaFin),
            },
          },
        },
        {
          $lookup: {
            from: "cliente",
            localField: "IdClienteFK",
            foreignField: "Id",
            as: "cliente_info",
          },
        },
        {
          $lookup: {
            from: "forma_pago",
            localField: "IdFormaPagoFK",
            foreignField: "Id",
            as: "forma_pago_info",
          },
        },
        {
          $project: {
            _id: 0,
            ventaId: "$Id",
            cliente: { $arrayElemAt: ["$cliente_info.nombre", 0] },
            formaPago: { $arrayElemAt: ["$forma_pago_info.descripcion", 0] },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener la lista de ventas por fecha:", error);
    throw error;
  }
}

export async function obtenerPrendasConEstado() {
  try {
    const db = await con();
    const result = await db
      .collection("prenda")
      .aggregate([
        {
          $lookup: {
            from: "estado",
            localField: "IdEstadoFK",
            foreignField: "Id",
            as: "estado_info",
          },
        },
        {
          $project: {
            _id: 0,
            nombre: 1,
            valorUnitUsd: 1,
            estado: { $arrayElemAt: ["$estado_info.descripcion", 0] },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener la lista de prendas con estado:", error);
    throw error;
  }
}

export async function obtenerClientesConCompras() {
  try {
    const db = await con();
    const result = await db
      .collection("cliente")
      .aggregate([
        {
          $lookup: {
            from: "venta",
            localField: "Id",
            foreignField: "IdClienteFK",
            as: "compras",
          },
        },
        {
          $project: {
            _id: 0,
            nombre: 1,
            cantidad_compras: { $size: "$compras" },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener la lista de clientes con compras:", error);
    throw error;
  }
}

export async function obtenerOrdenesConEstado() {
  try {
    const db = await con();
    const result = await db
      .collection("orden")
      .aggregate([
        {
          $lookup: {
            from: "tipo_estado",
            localField: "IdEstadoFK",
            foreignField: "Id",
            as: "estado",
          },
        },
        {
          $project: {
            _id: 0,
            Id: 1,
            fecha: 1,
            estado_actual: { $arrayElemAt: ["$estado.Descripcion", 0] },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener la lista de órdenes con estados:", error);
    throw error;
  }
}

export async function obtenerCargosConSueldoSuperior() {
  try {
    const db = await con();
    const result = await db
      .collection("cargos")
      .aggregate([
        {
          $match: { sueldo_base: { $gt: 2000000 } },
        },
        {
          $project: {
            _id: 0,
            nombre: "$descripcion",
            sueldo_base: 1,
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.error(
      "Error al obtener los cargos con sueldo base superior:",
      error
    );
    throw error;
  }
}

export async function obtenerClientesConMunicipiosYPaises() {
  try {
    const db = await con(); 
    const result = await db.collection('cliente').aggregate([
      {
        $lookup: {
          from: 'municipio',
          localField: 'IdMunicipioFK',
          foreignField: 'Id',
          as: 'municipio'
        }
      },
      {
        $unwind: "$municipio"
      },
      {
        $lookup: {
          from: 'departamento',
          localField: 'municipio.IdDepartamentoFK',
          foreignField: 'Id',
          as: 'departamento'
        }
      },
      {
        $unwind: "$departamento"
      },
      {
        $lookup: {
          from: 'pais',
          localField: 'departamento.IdPaisFK',
          foreignField: 'Id',
          as: 'pais'
        }
      },
      {
        $unwind: "$pais"
      },
      {
        $project: {
          _id: 0,
          nombre_cliente: "$nombre",
          municipio: "$municipio.nombre",
          pais: "$pais.nombre"
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de clientes con municipios y países:', error);
    throw error;
  }
}

export async function obtenerTiposDeProteccionConPrendasAsociadas() {
  try {
    const db = await con(); 
    const result = await db.collection('tipo_proteccion').aggregate([
      {
        $lookup: {
          from: 'prenda',
          localField: 'Id',
          foreignField: 'IdTipoProteccionFK',
          as: 'prendas'
        }
      },
      {
        $project: {
          _id: 0,
          nombre_tipo_proteccion: "$nombre",
          descripcion_tipo_proteccion: "$descripcion",
          numero_prendas_asociadas: { $size: "$prendas" }
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de tipos de protección con prendas asociadas:', error);
    throw error;
  }
}

export async function obtenerEmpleadosConCargosYFechasDeIngresoOrdenadas() {
  try {
    const db = await con(); 
    const result = await db.collection('empleado').aggregate([
      {
        $lookup: {
          from: 'cargo',
          localField: 'IdCargoFK',
          foreignField: 'Id',
          as: 'cargo'
        }
      },
      {
        $sort: { fecha_ingreso: -1 }
      },
      {
        $project: {
          _id: 0,
          nombre_empleado: "$nombre",
          cargo_empleado: { $arrayElemAt: ["$cargo.nombre", 0] },
          fecha_ingreso: 1
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de empleados con cargos y fechas de ingreso ordenadas:', error);
    throw error;
  }
}

export async function obtenerCargosConCantidadDeEmpleados() {
  try {
    const db = await con(); 
    const result = await db.collection('cargo').aggregate([
      {
        $lookup: {
          from: 'empleado',
          localField: 'Id',
          foreignField: 'IdCargoFK',
          as: 'empleados'
        }
      },
      {
        $project: {
          _id: 0,
          nombre_cargo: 1,
          descripcion_cargo: 1,
          cantidad_empleados: { $size: "$empleados" }
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de cargos con la cantidad de empleados:', error);
    throw error;
  }
}

export async function obtenerEstadosConCantidadDePrendas() {
  try {
    const db = await con(); 
    const result = await db.collection('estado').aggregate([
      {
        $lookup: {
          from: 'prenda',
          localField: 'Id',
          foreignField: 'IdEstadoFK',
          as: 'prendas'
        }
      },
      {
        $project: {
          _id: 0,
          nombre_estado: 1,
          descripcion_estado: 1,
          cantidad_prendas: { $size: "$prendas" }
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de estados con la cantidad de prendas asociadas:', error);
    throw error;
  }
}

export async function obtenerTiposPersonaConCantidadClientes() {
  try {
    const db = await con(); 
    const result = await db.collection('tipoPersona').aggregate([
      {
        $lookup: {
          from: 'cliente',
          localField: 'Id',
          foreignField: 'IdTipoPersonaFK',
          as: 'clientes'
        }
      },
      {
        $project: {
          _id: 0,
          nombre_tipo_persona: 1,
          descripcion_tipo_persona: 1,
          cantidad_clientes: { $size: "$clientes" }
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de tipos de persona con la cantidad de clientes asociados:', error);
    throw error;
  }
}

export async function obtenerTiposProteccionConCantidadPrendas() {
  try {
    const db = await con(); 
    const result = await db.collection('tipoProteccion').aggregate([
      {
        $lookup: {
          from: 'prenda',
          localField: 'Id',
          foreignField: 'IdTipoProteccionFK',
          as: 'prendas'
        }
      },
      {
        $project: {
          _id: 0,
          nombre_tipo_proteccion: 1,
          descripcion_tipo_proteccion: 1,
          cantidad_prendas: { $size: "$prendas" }
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de tipos de protección con la cantidad de prendas asociadas:', error);
    throw error;
  }
}

export async function obtenerEstadosConCantidadOrdenes() {
  try {
    const db = await con(); 
    const result = await db.collection('estados').aggregate([
      {
        $lookup: {
          from: 'ordenes',
          localField: 'Id',
          foreignField: 'IdEstadoFK',
          as: 'ordenes'
        }
      },
      {
        $project: {
          _id: 0,
          nombre_estado: 1,
          descripcion_estado: 1,
          cantidad_ordenes: { $size: "$ordenes" }
        }
      }
    ]).toArray();
    return result;
  } catch (error) {
    console.error('Error al obtener la lista de estados con la cantidad de órdenes asociadas:', error);
    throw error;
  }
}

export async function obtenerTiposDePagoYVentas() {
  try {
    const db = await con();
    const ventas = db.collection("ventas");
    const tiposDePago = db.collection("tipos_de_pago");

    const aggregation = [
      {
        $lookup: {
          from: "tipos_de_pago",
          localField: "tipo_pago_id",
          foreignField: "_id",
          as: "tipo_pago_info"
        }
      },
      {
        $unwind: "$tipo_pago_info"
      },
      {
        $group: {
          _id: "$tipo_pago_info.nombre",
          descripcion: { $first: "$tipo_pago_info.descripcion" },
          cantidad_ventas: { $sum: 1 }
        }
      }
    ];

    const result = await ventas.aggregate(aggregation).toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener los tipos de pago y ventas:", error);
    throw error;
  }
}

export async function obtenerTiposDeInsumosYPrendas() {
  try {
    const db = await con();
    const insumos = db.collection("insumos");
    const prendas = db.collection("prendas");

    const aggregation = [
      {
        $lookup: {
          from: "prendas",
          localField: "_id",
          foreignField: "insumo_id",
          as: "prendas_utilizan"
        }
      },
      {
        $project: {
          nombre: 1,
          descripcion: 1,
          cantidad_prendas: { $size: "$prendas_utilizan" }
        }
      }
    ];

    const result = await insumos.aggregate(aggregation).toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener los tipos de insumos y prendas:", error);
    throw error;
  }
}

export async function obtenerTotalGastadoPorCliente() {
  try {
    const db = await con();
    const clientes = db.collection("clientes");
    const ventas = db.collection("ventas");

    const aggregation = [
      {
        $lookup: {
          from: "ventas",
          localField: "_id",
          foreignField: "cliente_id",
          as: "ventas_cliente"
        }
      },
      {
        $unwind: "$ventas_cliente"
      },
      {
        $group: {
          _id: "$_id",
          nombre: { $first: "$nombre" },
          total_gastado: { $sum: "$ventas_cliente.monto" }
        }
      }
    ];

    const result = await clientes.aggregate(aggregation).toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener la cantidad total gastada por cliente:", error);
    throw error;
  }
}

export async function obtenerValorTotalVentasPorPrenda() {
  try {
    const db = await con();
    const prendas = db.collection("prendas");
    const ventas = db.collection("ventas");

    const aggregation = [
      {
        $lookup: {
          from: "ventas",
          localField: "_id",
          foreignField: "prenda_id",
          as: "ventas_prenda"
        }
      },
      {
        $unwind: "$ventas_prenda"
      },
      {
        $group: {
          _id: "$_id",
          nombre: { $first: "$nombre" },
          descripcion: { $first: "$descripcion" },
          total_ventas_pesos: { $sum: { $multiply: ["$ventas_prenda.monto", YOUR_EXCHANGE_RATE_HERE] } }
        }
      }
    ];

    const result = await prendas.aggregate(aggregation).toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener el valor total de ventas por prenda:", error);
    throw error;
  }
}

export async function obtenerCantidadPrendasPorEstado() {
  try {
    const db = await con();
    const estados = db.collection("estados");
    const prendas = db.collection("prendas");

    const aggregation = [
      {
        $lookup: {
          from: "prendas",
          localField: "_id",
          foreignField: "estado_id",
          as: "prendas_estado"
        }
      },
      {
        $project: {
          nombre: 1,
          descripcion: 1,
          cantidad_prendas: { $size: "$prendas_estado" }
        }
      },
      {
        $sort: {
          cantidad_prendas: 1
        }
      }
    ];

    const result = await estados.aggregate(aggregation).toArray();
    return result;
  } catch (error) {
    console.error("Error al obtener la cantidad de prendas por estado:", error);
    throw error;
  }
}
