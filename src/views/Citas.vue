<template>
  <div class="w-full p-12 flex justify-center">
    <div v-if="!codigoIntroducido" class="text-center">
      <h1 class="text-xl mb-2 font-bold">Introduce el código de tu cita</h1>
      <input
        class="bg-gray-100 border p-2 w-full rounded mt-4 focus:outline-none"
        type="text"
        placeholder="Introduce el código"
        v-model="codigo"
      />
      <button
        @click="getDatosCita"
        class="text-white px-4 py-2 w-3/6 mt-6 rounded bg-blue-500 focus:outline-none hover:bg-blue-600"
      >Comprobar</button>
    </div>
    <div v-if="codigoIntroducido">
      <div class="border px-12 py-3 rounded text-center">
        <h1 class="xl:text-3xl lg:text-3xl sm:text-2xl font-bold">Código de reserva: {{codigo}}</h1>
        <div class="text-xl p-2 flex flex-col">
          <span class="py-3">Nombre: {{this.cita.nombre}}</span>
          <span class="py-3">Teléfono: {{this.cita.telefono}}</span>
          <span
            class="py-3"
          >Fecha: {{this.cita.fecha.getDate()}}/{{this.cita.fecha.getMonth()+1}}/{{this.cita.fecha.getFullYear()}} {{this.cita.fecha.getHours()}}:{{this.cita.fecha.getMinutes()}}0</span>
        </div>
        <button
          @click="eliminarCita"
          class="rounded py-2 text-white px-4 bg-red-500 hover:bg-red-600"
        >Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase.js";

export default {
  name: "citas",
  data() {
    return {
      codigoIntroducido: false,
      codigo: "",
      cita: {
        nombre: "",
        telefono: "",
        fecha: ""
      }
    };
  },
  methods: {
    getDatosCita() {
      var cita = db
        .collection("citas")
        .where("codigo", "==", this.codigo)
        .get()
        .then(idCita => {
          db.collection("citas")
            .doc(idCita.docs[0].id)
            .get()
            .then(doc => {
              this.cita.nombre = doc.data().nombre;
              this.cita.telefono = doc.data().telefono;
              this.cita.fecha = doc.data().fecha.toDate();
              this.codigoIntroducido = true;
            });
        });
    },

    eliminarCita() {
      var cita = db
        .collection("citas")
        .where("codigo", "==", this.codigo)
        .get()
        .then(idCita => {
          db.collection("citas")
            .doc(idCita.docs[0].id)
            .delete();
          //this.codigoIntroducido = false;
          //this.codigo = "";
          this.$router.replace("/");
        });
    }
  }
};
</script>

<style>
</style>