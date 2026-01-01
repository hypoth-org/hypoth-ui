declare module "ajv-errors" {
  import type Ajv from "ajv";
  export default function ajvErrors(ajv: Ajv): Ajv;
}
