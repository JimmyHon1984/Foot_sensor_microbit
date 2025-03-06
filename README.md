# 足部压力传感器库 v1.0

这个库用于与冠拓电子足部压力传感器进行通信，通过MicroBit的UART接口读取18个区域的压力数据。

## 基本用法

### 初始化传感器
```blocks
FootPressureSensor.initSensor(SerialPin.P0, SerialPin.P1, BaudRate.BaudRate115200)
