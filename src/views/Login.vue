<template>
  <div class="flex items-center justify-center lg:py-16 xl:py-48 sm:py-32 px-4 sm:px-6 lg:px-8">
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
</template>

<script>
import { auth } from "../config/firebase.js";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.replace("/admin");
          localStorage.setItem("auth", auth);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>