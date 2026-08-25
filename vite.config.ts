import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
  base нужен для GitHub Pages: сайт лежит не в корне домена, а в
  подпапке с именем репозитория, и без префикса ссылки на css, js и
  картинки в public уходят на несуществующий путь.

  Значение берётся из переменной окружения, чтобы одна и та же сборка
  собиралась и под Pages, и под собственный домен: там префикс не нужен
  и достаточно передать VITE_BASE=/.
*/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/vetmir-site/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5189,
  },
})
