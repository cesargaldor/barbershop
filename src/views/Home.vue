<template>
  <div class="home">
    <!-- modal de nueva cita-->
    <div
      v-if="openModal"
      class="p-4 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-50"
    >
      <div class="relative mx-auto w-auto max-w-2xl">
        <div class="p-6 bg-white w-full rounded-shadow-2xl flex flex-col">
          <div class="text-center text-2xl font-bold mb-3">Necesitamos algunos datos</div>
          <div class="items-center justify-center">
            <input
              required
              class="border border-gray-200 p-3 mb-2 w-full rounded focus:outline-none"
              type="text"
              placeholder="Introduce tu nombre"
              v-model="nuevaCita.nombre"
            />
            <input
              required
              class="border border-gray-200 p-3 mt-2 w-full rounded focus:outline-none"
              type="text"
              placeholder="Introduce tu telefono"
              v-model="nuevaCita.telefono"
            />
          </div>
          <div class="py-3 flex justify-around w-full">
            <button
              @click="openModal = false"
              class="rounded bg-red-500 text-white px-6 mt-1 py-2 focus:outline-none"
            >Cancelar</button>
            <button
              @click="addCita"
              class="rounded bg-blue-500 text-white px-8 mt-1 py-2 focus:outline-none"
            >Crear</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="openModal" class="min-h-screen absolute inset-0 z-40 opacity-75 bg-black"></div>
    <!-- fin del modal de nueva cita-->

    <!-- modal de codigo-->
    <div
      v-if="mostrarCodigoGenerado"
      class="p-4 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-50"
    >
      <div class="relative mx-auto w-auto max-w-2xl">
        <div class="p-6 bg-white w-full rounded-shadow-2xl flex flex-col">
          <div class="px-6 py-4 text-center text-3xl font-bold">Guarde este código</div>
          <h1 class="text-center mb-2 text-xl">{{codigoGenerado}}</h1>
          <div class="py-4 flex justify-center w-full">
            <button
              @click="mostrarCodigoGenerado = false"
              class="rounded bg-red-500 text-white px-6 py-2 focus:outline-none"
            >Cerrar</button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="mostrarCodigoGenerado"
      class="min-h-screen absolute inset-0 z-40 opacity-75 bg-black"
    ></div>
    <!-- fin del modal de codigo-->

    <!-- Se muestra el datepicker-->
    <div class="flex flex-col items-center justify-center">
      <p class="p-4 sm:text-lg sm:pt-4 xl:text-xl xl:pt-8">Selecciona una fecha:</p>
      <date-picker :value="date" v-model="date" :not-before="new Date()" class="sm:mb-4 xl:mb-8" />
    </div>
    <!-- Si es domingo, muestra un horario de cerrado -->

    <div v-if="date.getDay() == 6" class="flex justify-center">
      <h1 class="pt-12 text-2xl text-red-500">Es domingo. La peluquería está cerrada.</h1>
    </div>

    <!-- Aqui se muestran todas las horas -->
    <div
      v-else
      class="sm:pb-24 max-w-full py-12 px-12 pt-4 lg:pb-12 xl:pb-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
    >
      <!-- Esto muestra un div por cada una de las horas de un dia, que tiene una clase bindeada segun este pillada ya la hora o no-->
      <div
        @click="showModal(fecha)"
        v-for="fecha in calendar"
        :class="{ 'booked': fecha.isBooked, 'free': !fecha.isBooked}"
        class="pt-8 pb-8 text-center font-semibold rounded cursor-pointer focus:outline-none"
      >{{fecha.hour}}:{{ (fecha.minutes+'0').slice(-2)}}</div>
    </div>
  </div>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";
//importamos firebase
import { db } from "../../firebase.js";
import schedule from "../config/schedule";

export default {
  name: "Home",
  components: {},
  data() {
    let date = new Date();
    date.setHours(12, 0, 0);
    return {
      date: date,
      nuevaCita: {
        nombre: "",
        telefono: "",
        fecha: {},
        codigo: ""
      },
      schedule: schedule.hours,
      openModal: false,
      codigoGenerado: null,
      mostrarCodigoGenerado: false,
      citas: []
    };
  },
  components: {
    DatePicker
  },
  methods: {
    // Este metodo, abre el modal con la hora de un dia concreto como parametro.
    showModal(fecha) {
      var codigoCita = Math.random()
        .toString(36)
        .slice(2);
      //Si la hora esta ya pillada, no deja abrir el modal.
      if (fecha.isBooked) return;
      // Si no es así, crea una cita vacia, con un codigo de cita y la fecha dada como parametro.
      this.nuevaCita = {
        nombre: "",
        telefono: "",
        fecha: fecha,
        codigo: codigoCita
      };
      // Finalmente, se establece a true la variable que muestra el modal y se añade al atributo codigo el generado de la cita
      this.openModal = true;
      this.codigoGenerado = codigoCita;
    },

    // Este metodo recoge todas las citas de la base de datos y las mete en un array
    async getCitas() {
      await db.collection("citas").onSnapshot(query => {
        query.forEach(doc => {
          this.citas.push(doc.data());
        });
      });
    },

    // Este metodo permite crear una cita nueva.
    addCita() {
      // Se crea una nueva fecha con los valores de la fecha cogida por el usuario.
      var date = new Date(this.date.toDateString() + " 12:00:00");
      date.setHours(this.nuevaCita.fecha.hour, this.nuevaCita.fecha.minutes, 0);

      // Este array de datos es el que se introduce en firestore para almacenar todos los detalles de la cita.
      var citaFinal = {
        nombre: this.nuevaCita.nombre,
        telefono: this.nuevaCita.telefono,
        fecha: date,
        codigo: this.nuevaCita.codigo
      };

      //Finalmente, se crea el metodo en firestore que almacena en un documento nuevo, el array de los detalles.

      db.collection("citas")
        .doc()
        .set(citaFinal)
        .then(() => {
          this.openModal = false;
          this.mostrarCodigoGenerado = true;
        })
        .catch(error => {
          console.error(error);
        });
    }
  },

  // Se instancia el metodo citas en el created para que se ejecute al montar la aplicacion
  created() {
    this.getCitas();
  },

  // Esta propiedad computada coge cada una de las horas del archivo schedule. Estas horas son cada una de las horas en
  // las que puede dar cita el negocio. Lo que se hace es crear una fecha con el valor del datepicker y con la hora y minutos
  // del schedule. Finalmente, se comprueba si la fecha/hora seleccionada coincide con alguna fecha y hora almacenada en firestore
  // y se mete esa fecha en un array calendario, de forma que este array tiene los datos de hora, minutos y si está cogida o no.
  computed: {
    calendar() {
      let calendar = [];
      this.schedule.forEach(hour => {
        let date = new Date(this.date.toDateString() + " 12:00:00");
        date.setHours(hour.hour, hour.minutes, 0);

        if (date >= new Date()) {
          let reservation = this.citas.filter(x => {
            return x.fecha.seconds === date.getTime() / 1000;
          });
          calendar.push({
            hour: hour.hour,
            minutes: hour.minutes,
            isBooked: reservation.length === 1
          });
        }
      });

      return calendar;
    }
  }
};
</script>

<style scoped>
.booked {
  background-color: #ffa8a8;
  cursor: not-allowed;
}
.free {
  cursor: pointer;
  background-color: #95ee95;
}
</style>