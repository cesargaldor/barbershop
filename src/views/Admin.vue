<template>
  <div>
    <!-- Login que solo se muestra si el usuario no esta registrado -->
    <div
      v-if="!isAuth"
      class="flex items-center justify-center lg:py-16 xl:py-56 sm:py-40 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full">
        <div class="w-full flex flex-col">
          <input
            v-model="email"
            class="outline-none border border-solid border-gray-300 p-4 mb-2 rounded"
            type="text"
            placeholder="Introduce tu usuario"
          />
          <input
            v-model="password"
            class="outline-none border border-solid border-gray-300 p-4 mb-4 rounded"
            type="password"
            placeholder="Introduce tu contraseña"
          />
          <button
            @click="login"
            class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-black"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            Acceder
          </button>
        </div>
      </div>
    </div>

    <!-- Esto solo se muestra si esta registrado -->

    <div v-if="isAuth" class="flex flex-col items-center justify-center mt-6">
      <button @click="logout" class="px-5 py-2 bg-blue-400 rounded text-white mb-5">Salir</button>
      <h1 class="sm:text-xl text-2xl font-bold mb-8">Próximas citas</h1>
      <!-- La tabla solo se muestra en ordenadores -->
      <table v-if="citasPosteriores.length > 0" class="sm:hidden lg:block xl:block text-center">
        <tr class>
          <th class="border-b px-24 py-2">Nombre</th>
          <th class="border-b px-24 py-2">Teléfono</th>
          <th class="border-b px-24 py-2">Fecha</th>
          <th class="border-b px-24 py-2">Acciones</th>
        </tr>
        <tr v-for="cita in citasPosteriores" :key="cita.codigo">
          <td class="px-24 py-3">{{cita.nombre}}</td>
          <td class="px-24 py-3">{{cita.telefono}}</td>
          <td class="px-24 py-3">
            {{cita.fecha.toDate().getDate()}}/{{cita.fecha.toDate().getMonth()+1}}/{{cita.fecha.toDate().getFullYear()}}
            {{cita.fecha.toDate().getHours()}}:{{cita.fecha.toDate().getMinutes()}}0
          </td>
          <td class="px-24 py-3">
            <button
              @click="eliminarCita(cita)"
              class="bg-red-500 px-4 py-2 rounded text-white focus:outline-none hover:bg-red-600"
            >Cancelar</button>
          </td>
        </tr>
      </table>

      <div v-if="citasPosteriores.length == 0">
        <span>No hay ninguna cita</span>
      </div>

      <!-- El cuadro solo se muestra en móviles-->
      <div
        v-for="cita in citasPosteriores"
        :key="cita.codigo"
        class="w-10/12 mb-4 border xl:hidden lg:hidden"
      >
        <div class="p-3 w-full flex justify-between border-b">
          <span class="font-bold">Nombre:</span>
          <span>{{cita.nombre}}</span>
        </div>
        <div class="p-3 w-full flex justify-between border-b">
          <span class="font-bold">Teléfono:</span>
          <span>{{cita.telefono}}</span>
        </div>
        <div class="p-3 w-full flex justify-between border-b">
          <span class="font-bold">Fecha:</span>
          <span>
            {{cita.fecha.toDate().getDate()}}/{{cita.fecha.toDate().getMonth()+1}}/{{cita.fecha.toDate().getFullYear()}}
            {{cita.fecha.toDate().getHours()}}:{{cita.fecha.toDate().getMinutes()}}0
          </span>
        </div>
        <div class="p-3 w-full flex justify-between items-center">
          <span class="font-bold">Acciones:</span>
          <button
            @click="eliminarCita(cita)"
            class="bg-red-500 px-4 py-2 rounded text-white"
          >Cancelar</button>
        </div>
      </div>
      <div class="mb-16 xl:hidden">&nbsp;</div>
    </div>
  </div>
</template>

<script>
import { db } from "../config/firebase.js";
import { auth } from "../config/firebase.js";

export default {
  name: "admin",
  data() {
    return {
      citas: [],
      isAuth: false,
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.isAuth = true;
        })
        .catch(error => {
          console.log(error);
        });
    },

    logout() {
      auth.signOut().then(() => {
        this.isAuth = false;
      });
    },

    checkAdminAuth() {
      if (auth.currentUser) {
        this.isAuth = true;
      }
    },

    async getCitas() {
      await db.collection("citas").onSnapshot(query => {
        query.forEach(doc => {
          this.citas.push(doc.data());
        });
      });
    },

    eliminarCita(cita) {
      var citas = db
        .collection("citas")
        .where("codigo", "==", cita.codigo)
        .get()
        .then(idCita => {
          db.collection("citas")
            .doc(idCita.docs[0].id)
            .delete()
            .then(() => {
              this.isAuth = true;
              window.location.reload();
            });
        });
    }
  },

  created() {
    this.getCitas();
    this.checkAdminAuth();
  },

  computed: {
    citasPosteriores() {
      let citasPosteriores = [];
      this.citas.forEach(cita => {
        let segundosTimestamp = cita.fecha.seconds;

        if (segundosTimestamp >= new Date().getTime() / 1000) {
          let reservation = this.citas.filter(x => {
            return x.fecha.seconds > new Date().getTime() / 1000;
          });
          citasPosteriores.push({
            nombre: cita.nombre,
            telefono: cita.telefono,
            fecha: cita.fecha,
            codigo: cita.codigo
          });
        }
      });

      return citasPosteriores;
    }
  }
};
</script>

<style scoped>
</style>