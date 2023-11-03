import dotenv from "dotenv";
import express from "express";
import versionRoutes from "express-routes-versioning";
import { check } from "express-validator";
import { crearToken } from "./middleware_token/middlewareJWT.js";
import { limitGrt } from "./limit/config.js";

import restaurante from "./funcion/V2/Restaurante2.js";

dotenv.config();
const app = express();
const versionRoute = versionRoutes();

app.use(express.json());
const config = JSON.parse(process.env.MY_SERVER);

app.use((req, res, next) => {
  req.version = req.headers["accept-version"]|| "1.0.0"; //para que si no se pone la version, por defecto tome la 1.0.0
  next();
});

app.get("/login/:user",limitGrt(), crearToken);

app.use("/rol", versionRoute({
  "1.0.0": rol,
  "2.0.0": rol2
}));

app.use(
  "/pedido",
  [
    check("id_pedido")
      .notEmpty()
      .withMessage("El id_pedido es obligatorio")
      .custom((value) => /^\d+$/.test(value))
      .withMessage("El id_pedido debe ser numérico sin letras")
      .toInt(),

    check("cliente.nombre_Cliente")
      .notEmpty()
      .withMessage("El nombre del cliente es obligatorio")
      .isString()
      .withMessage("El nombre del cliente debe ser string"),

    check("cliente.direccion_Cliente")
      .notEmpty()
      .withMessage("La dirección del cliente es obligatoria")
      .isString()
      .withMessage("La dirección debe ser string"),

    check("cliente.telefono_Cliente")
      .notEmpty()
      .withMessage("El teléfono del cliente es obligatorio"),

    check("producto.id")
      .notEmpty()
      .withMessage("El ID del producto es obligatorio")
      .isNumeric()
      .withMessage("El ID del producto debe ser numérico"),

    check("producto.nombre_Producto")
      .notEmpty()
      .withMessage("El nombre del producto es obligatorio"),

    check("producto.precio_und")
      .notEmpty()
      .withMessage("El precio del producto es obligatorio")
      .isNumeric()
      .withMessage("El precio del producto debe ser numérico"),

    check("producto.cantidad_Producto")
      .notEmpty()
      .withMessage("La cantidad del producto es obligatoria")
      .isInt({ min: 1 })
      .withMessage(
        "La cantidad del producto debe ser un número entero mayor a 0"
      ),

    check("pago.monto")
      .notEmpty()
      .withMessage("El monto del pago es obligatorio")
      .isNumeric()
      .withMessage("El monto del pago debe ser numérico"),

    check("pago.metodo_Pago")
      .notEmpty()
      .withMessage("El método de pago es obligatorio")
      .custom((value) =>
        ["tarjeta debito", "tarjeta credito", "efectivo", "bono"].includes(
          value.toLowerCase()
        )
      )
      .withMessage(
        "método de pago no válido debee ser alguno de estos: tarjeta debito, tarjeta credito, efectivo, bono "
      ),

    check("pago.costo_domicilio")
      .notEmpty()
      .withMessage("El costo de domicilio es obligatorio")
      .isNumeric()
      .withMessage("El costo de domicilio debe ser numérico"),

    check("pago.pago_total")
      .notEmpty()
      .withMessage("El pago total es obligatorio")
      .isNumeric()
      .withMessage("El pago total debe ser numérico"),

    check("instrucciones_Especiales").optional(),
  ],

  versionRoute({
    "1.0.0": pedido,
    "2.0.0": pedido2,
  })
);

app.listen(config.port, config.hostname, () => {
  console.log(`Servidor iniciado en http://${config.hostname}:${config.port}`);
});

app.use("/user", versionRoute({
    "1.0.0": User
}));