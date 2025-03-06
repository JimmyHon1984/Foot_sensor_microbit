/**
 * 足部压力传感器库 v1.0
 * 基于冠拓电子足部压力传感器
 */
//% weight=100 color=#0fbc11 icon="\uf1eb"
namespace FootPressureSensor {
    // 常量定义
    const FRAME_HEADER = 0xAA;  // 帧头
    const LEFT_FOOT_ID = 0x01;  // 左脚数据包编号
    const RIGHT_FOOT_ID = 0x02; // 右脚数据包编号
    
    // 传感器数据存储
    let pressureData: number[] = [];
    let dataReady = false;
    let currentFoot = LEFT_FOOT_ID; // 默认为左脚
    
    /**
     * 初始化足部压力传感器
     * @param tx Tx引脚 eg: SerialPin.P0
     * @param rx Rx引脚 eg: SerialPin.P1
     * @param baudRate 波特率 eg: BaudRate.BaudRate115200
     */
    //% block="初始化足部压力传感器 TX $tx RX $rx 波特率 $baudRate"
    export function initSensor(tx: SerialPin, rx: SerialPin, baudRate: BaudRate = BaudRate.BaudRate115200): void {
        serial.redirect(tx, rx, baudRate);
        serial.setRxBufferSize(100);
        
        // 初始化数据数组
        for (let i = 0; i < 18; i++) {
            pressureData.push(0);
        }
        
        // 设置数据接收处理
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            processIncomingData();
        });
    }
    
    /**
     * 处理接收到的数据
     */
    function processIncomingData(): void {
        // 尝试读取完整的数据包
        let buffer = serial.readBuffer(39); // 根据协议，完整数据包长度为39字节
        
        // 检查是否为有效数据包
        if (buffer.length === 39 && buffer[0] === FRAME_HEADER) {
            // 检查数据包编号是否匹配当前设置的脚
            if (buffer[1] === currentFoot) {
                // 解析18个压力点数据
                for (let i = 0; i < 18; i++) {
                    // 每个点有高八位和低八位，分别在不同位置
                    let highByte = buffer[2 + i * 2];
                    let lowByte = buffer[3 + i * 2];
                    pressureData[i] = highByte * 256 + lowByte;
                }
                
                // 验证校验和
                let calculatedChecksum = 0;
                for (let i = 0; i < 38; i++) {
                    calculatedChecksum += buffer[i];
                }
                calculatedChecksum = calculatedChecksum & 0xFF; // 取低八位
                
                if (calculatedChecksum === buffer[38]) {
                    dataReady = true;
                }
            }
        }
    }
    
    /**
     * 设置当前使用的脚（左/右）
     * @param foot 选择左脚或右脚 eg: 1
     */
    //% block="设置为$foot"
    //% foot.defl=1
    //% foot.min=1 foot.max=2
    export function setFoot(foot: number): void {
        if (foot === 1) {
            currentFoot = LEFT_FOOT_ID;
            sendCommand("SETF=1");
        } else {
            currentFoot = RIGHT_FOOT_ID;
            sendCommand("SETF=2");
        }
        // 发送SET=OK命令保存设置
        sendCommand("SET=OK");
    }
    
    /**
     * 设置传感器波特率
     * @param rate 波特率选择 eg: 2
     */
    //% block="设置波特率$rate"
    //% rate.defl=2
    //% rate.min=1 rate.max=2
    export function setBaudRate(rate: number): void {
        if (rate === 1) {
            sendCommand("SETB=1"); // 9600
        } else {
            sendCommand("SETB=2"); // 115200
        }
        // 发送SET=OK命令保存设置
        sendCommand("SET=OK");
    }
    
    /**
     * 查询当前配置
     */
    //% block="查询当前配置"
    export function querySettings(): void {
        sendCommand("SET=?");
    }
    
    /**
     * 发送命令到传感器
     * @param command 要发送的命令字符串
     */
    function sendCommand(command: string): void {
        serial.writeString(command);
    }
    
    /**
     * 获取指定区域的压力值
     * @param area 区域编号 (1-18), eg: 1
     */
    //% block="获取区域 $area 的压力值(克)"
    //% area.min=1 area.max=18
    export function getPressure(area: number): number {
        if (area < 1 || area > 18) return 0;
        if (!dataReady) return 0;
        return pressureData[area - 1];
    }
    
    /**
     * 获取所有区域的压力值
     */
    //% block="获取所有区域压力值(克)"
    export function getAllPressures(): number[] {
        return pressureData;
    }
    
    /**
     * 检查数据是否准备好
     */
    //% block="传感器数据已准备好"
    export function isDataReady(): boolean {
        return dataReady;
    }
    
    /**
     * 读取多个区域的压力值并执行操作
     * @param handler 处理多个区域数据的回调函数
     */
    //% block="读取多个区域压力值"
    //% draggableParameters="reporter"
    export function readMultipleAreas(handler: (area1: number, area2: number, area3: number, area4: number, area5: number, area6: number, area7: number, area8: number, area9: number, area10: number, area11: number, area12: number, area13: number, area14: number, area15: number, area16: number, area17: number, area18: number) => void): void {
        if (!dataReady) return;
        
        handler(
            pressureData[0], pressureData[1], pressureData[2], 
            pressureData[3], pressureData[4], pressureData[5], 
            pressureData[6], pressureData[7], pressureData[8], 
            pressureData[9], pressureData[10], pressureData[11], 
            pressureData[12], pressureData[13], pressureData[14], 
            pressureData[15], pressureData[16], pressureData[17]
        );
    }
}
