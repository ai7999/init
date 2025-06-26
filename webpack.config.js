const path = require('path'); // Подключаем модуль Node.js для работы с путями на компьютере
const CopyPlugin = require("copy-webpack-plugin");

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
  ],
  module: {
    rules: [
      {
        test: /\\.js$/, // Указываем регулярным выражением, что преобразовывать нужно только JavaScript-файлы
        exclude: /(node_modules)/, // Уточняем, что файлы из директории node_modules трогать не нужно
        use: ['babel-loader'] // Указываем, какой лоадер использовать
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
