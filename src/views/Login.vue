<template>
  <div class="flex items-center justify-center lg:py-16 xl:py-56 sm:py-40 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <form class="w-full flex flex-col">
        <input
          v-model="user"
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
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      user: "",
      password: ""
    };
  },
  head() {
    return {
      title: "Login"
    };
  }
};
</script>

<style scoped>
</style>