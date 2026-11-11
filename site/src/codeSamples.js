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
