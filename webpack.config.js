const CopyPlugin = require('copy-webpack-plugin');
const path = require('path'); // Подключаем модуль Node.js для работы с путями на компьютере

module.exports = {
  entry: './src/main.js', // Указывает точку входа - наш главный JavaScript-файл проекта
  output: {
    filename: 'bundle.js', // Задаём название итоговому бандлу
    path: path.resolve(__dirname, 'build'), // Указываем, куда нужно положить бандл после создания
    clean: true, // Отмечаем, что перед сохранением обновлённого бандла старые файлы нужно удалить
  },
  devtool: 'source-map', // Активируем генерацию source-maps
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],// Добавляем плагин в сборку и указываем директорию, откуда нужно скопировать файлы
    }),
  ]
};
