// Code windows shared by the ARC page and the Gallery.
export const SERIAL_CAPTURE = `=== SERIAL STATUS ===
_status: ESP_OK (0)
_isFirstRead: false
_validPacket: false
_currentPacketState: WAITING_FOR_HEADER (0)
_packetLength: 22 body bytes
_timeSinceLastReceive: 0
_timeOfSending: 164438584
_packet [full buffer] (128 bytes, hex):
  000: 80 00 16 00 00 00 00 09 CD 22 38 10 00 00 00 00
  016: 00 00 00 00 00 00 00 00 00 DE AD BE EF 00 00 00
  032: 40 DE AD BE EF 00 00 00 00 00 00 00 00 00 00 00
  ... (rows 048-112: all 00)
_sensorIDS (slot order): 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
=====================
UART received: 37`;

export const LOCKGUARD_CODE = `class LockGuard {
public:
    explicit LockGuard(SemaphoreHandle_t& mutex) : _mutexReference(mutex) {
        if (_mutexReference != nullptr &&
            xSemaphoreTake(_mutexReference, portMAX_DELAY) != pdFALSE) {
            _isLockedByLockGuard = true;
        }
    }
    // Releases only if this guard took the mutex.
    ~LockGuard() noexcept {
        if (_isLockedByLockGuard) xSemaphoreGive(_mutexReference);
    }
    LockGuard(const LockGuard&) = delete;
    LockGuard& operator=(const LockGuard&) = delete;
    bool isMutexLocked() { return _isLockedByLockGuard; }
private:
    SemaphoreHandle_t& _mutexReference;
    bool _isLockedByLockGuard = false;
};`;


export const SENSOR_EXAMPLE_CODE = `// src/main.cpp
namespace {
    constexpr uint8_t TMP117_ADDRESS = 0x48;
    constexpr uint8_t TEMP1_ID = 2;
    constexpr uint8_t TEMP1_MUX_CHANNEL = 3;   // 0x70, channel 3
    // ...
}

extern "C" void app_main()
{
    // ...
    auto& sensorBus = *I2CARSENAL::multiplexerBus;
    constexpr auto temperature = SensorUtils::SensorConfig::TEMPERATURE;
    static Sensor<2> temp1(
        "temp1", sensorBus, TMP117_ADDRESS, TEMP1_ID, false, temperature, TEMP1_MUX_CHANNEL);
    // ...
        const auto status = sensor->setup();
        if (status != SensorUtils::SENSOR_OK) {
            ESP_LOGE(TAG, "%s setup failed: %s", sensor->getName().data(),
                     SensorUtils::sensor_status_str(status));
            continue;
        }
    // ...
}

// lib/Sensor/SensorOffsetConfig.h
namespace SensorOffsetConfig {

    template <std::size_t N>
    void readTemperature(Sensor<N>& sensor, LockGuard& lock) {
        constexpr uint8_t temperatureRegister = 0x00;
        uint8_t temperatureBytes[2]{};
        const esp_err_t readStatus = sensor.readDeviceRegister(
            temperatureRegister, temperatureBytes, sizeof(temperatureBytes), lock);

        if (readStatus != ESP_OK) {
            return;
        }

        const uint16_t highByte = temperatureBytes[0];
        const uint16_t lowByte = temperatureBytes[1];
        const uint16_t rawTemperature = (highByte << 8) | lowByte;
        sensor.setReadings({rawTemperature, 0, 0});
    }

    template <std::size_t N>
    void addTemperatureOffsets(Sensor<N>& sensor) {
        constexpr uint8_t temperatureOffsetRegister = 0x07;
        constexpr uint16_t defaultTemperatureOffset = 0;
        constexpr uint8_t temperaturePacketSection = 0;
        constexpr uint8_t temperatureComponent = 0;
        constexpr auto registerLayout = SensorUtils::OffsetLayout::REG_16_BIT_HIGH_FIRST;

        sensor.appendOffset(
            "offsetTemperature", defaultTemperatureOffset, temperatureOffsetRegister,
            temperaturePacketSection, temperatureComponent, registerLayout);
    }

}`;
