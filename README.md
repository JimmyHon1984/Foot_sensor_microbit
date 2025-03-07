// 压力传感器库使用示例
PressureSensorLib.init(SerialPin.P1, SerialPin.P2);
PressureSensorLib.setDebugMode(true);

// 当收到数据时的处理
PressureSensorLib.onDataReceived(function() {
    // 获取所有数据
    let data = PressureSensorLib.getData();
    
    // 显示脚类型
    if (PressureSensorLib.isLeftFoot()) {
        basic.showString("L");
    } else if (PressureSensorLib.isRightFoot()) {
        basic.showString("R");
    }
    
    // 获取特定点的压力值
    let point1 = PressureSensorLib.getPointValue(1);
    let point5 = PressureSensorLib.getPointValue(5);
    
    // 根据压力值做一些操作
    if (point1 > 1000) {
        basic.showIcon(IconNames.Heart);
    }
    
    // 也可以遍历所有点
    let maxValue = 0;
    let maxPoint = 0;
    
    for (let i = 1; i <= 18; i++) {
        let value = PressureSensorLib.getPointValue(i);
        if (value > maxValue) {
            maxValue = value;
            maxPoint = i;
        }
    }
    
    // 显示压力最大的点
    basic.showNumber(maxPoint);
});

// 处理校验和错误
PressureSensorLib.onChecksumError(function() {
    basic.showIcon(IconNames.No);
});

// 主循环
basic.forever(function() {
    // 库在后台自动处理数据
    // 这里可以添加其他逻辑
    basic.pause(100);
});
