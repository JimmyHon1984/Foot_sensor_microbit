# 足部压力传感器库 v1.0

这个库用于与冠拓电子足部压力传感器进行通信，通过MicroBit的UART接口读取18个区域的压力数据。

## 基本用法

### 初始化传感器
```blocks
FootPressureSensor.initSensor(SerialPin.P0, SerialPin.P1, BaudRate.BaudRate115200)
```

### 设置左右脚
```blocks
FootPressureSensor.setFoot(1) // 1=左脚, 2=右脚
```

### 读取压力数据
```blocks
let pressure = FootPressureSensor.getPressure(1) // 读取区域1的压力值(克)
读取多个区域的压力数据
複製
FootPressureSensor.readMultipleAreas(function (area1, area2, area3, area4, area5, area6, area7, area8, area9, area10, area11, area12, area13, area14, area15, area16, area17, area18) {
    // 直接使用各区域的压力值，无需创建额外变量
    if (area1 > 100) {
        basic.showIcon(IconNames.Happy)
    }
    // 可以对比多个区域
    if (area1 > area2) {
        basic.showString("A1>A2")
    }
})
```

### 检查数据是否准备好
```blocks
if (FootPressureSensor.isDataReady()) {
    // 数据已准备好，可以读取
}
```
## 高级功能

### 设置波特率
```blocks
FootPressureSensor.setBaudRate(2) // 1=9600, 2=115200
```

### 查询当前配置
```blocks
FootPressureSensor.querySettings()
```

### 获取所有区域压力值
```blocks
let allPressures = FootPressureSensor.getAllPressures()
```
## 新增功能说明

1. **readMultipleAreas 块**：
   - 这个新增的块允许学生一次性访问所有18个区域的压力数据
   - 使用了 `draggableParameters="reporter"` 属性，这样学生可以直接在回调函数中使用这些值
   - 不需要创建额外的变量，简化了代码结构
   - 适合比较不同区域的压力值或进行复杂的数据分析

2. **使用示例**：
   ```blocks
   FootPressureSensor.readMultipleAreas(function (area1, area2, area3, area4, area5, area6, area7, area8, area9, area10, area11, area12, area13, area14, area15, area16, area17, area18) {
       // 直接使用各区域的压力值
       if (area1 > 100 && area2 < 50) {
           basic.showIcon(IconNames.Happy)
       }
   })

### 许可证
MIT

### 支持的目标
MicroBit
