// static/js/DL_js/DL_07_Autoencoder.js

export const DL_07_Autoencoder = {
  id: 1,
  name: "DL_07_Autoencoder",
  code: [
    { line: "import tensorflow as tf", desc: "匯入 TensorFlow" },
    { line: "model = tf.keras.models.Sequential()", desc: "建立空的 Sequential 模型" },
    { line: "model.add(tf.keras.layers.Conv2D(32, (3,3), activation='relu'))", desc: "加入 Conv2D 層" },
    { line: "model.add(tf.keras.layers.Flatten())", desc: "展平輸出" },
    { line: "model.add(tf.keras.layers.Dense(10, activation='softmax'))", desc: "輸出層" },
    { line: "model.summary()", desc: "印出模型摘要" }
  ]
};
