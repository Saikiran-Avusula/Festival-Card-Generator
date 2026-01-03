// Generate or retrieve a unique device identifier
// This allows user data to persist without requiring authentication

const DEVICE_ID_KEY = 'festiva_device_id'

export function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY)

    if (!deviceId) {
        deviceId = generateDeviceId()
        localStorage.setItem(DEVICE_ID_KEY, deviceId)
    }

    return deviceId
}

function generateDeviceId() {
    // Generate a UUID-like identifier
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 15)
    const randomPart2 = Math.random().toString(36).substring(2, 15)

    return `${timestamp}-${randomPart}-${randomPart2}`
}

export function clearDeviceId() {
    localStorage.removeItem(DEVICE_ID_KEY)
}
