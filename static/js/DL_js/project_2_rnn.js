// static/js/DL_js/project_2_rnn.js

export const project_2 = {
  id: 2,
  name: "RNN 範例",
  code: [
    { line: "import tensorflow as tf", desc: "匯入 TensorFlow" },
    { line: "model = tf.keras.models.Sequential()", desc: "建立空的 Sequential 模型" },
    { line: "model.add(tf.keras.layers.SimpleRNN(50, input_shape=(10,1)))", desc: "加入 RNN 層" },
    { line: "model.add(tf.keras.layers.Dense(1))", desc: "輸出層" },
    { line: "model.compile(optimizer='adam', loss='mse')", desc: "編譯模型" },
    { line: "model.summary()", desc: "印出模型摘要" }
  ]
};
